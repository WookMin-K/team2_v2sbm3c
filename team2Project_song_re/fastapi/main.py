from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import json
import re
import openai
from openai import OpenAI

# ✅ .env 로드
load_dotenv()

# ✅ OpenAI 클라이언트 초기화
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print("✅ API KEY (repr):", repr(OPENAI_API_KEY))
openai.api_key = OPENAI_API_KEY
client = OpenAI(api_key=OPENAI_API_KEY)


# ✅ FastAPI 앱 생성
app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # or ["http://localhost:3000"] for local dev only
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ 📌 모델 정의
class DateRange(BaseModel):
    start: str
    end: str

class Spot(BaseModel):
    id: int
    name: str
    contenttypeid: int
    lat: float
    lng: float

class ScheduleRequest(BaseModel):
    dateRange: DateRange
    spots: list[Spot]
    departure: str
    transport: str
    persons: int


# ✅ 📌 GPT Prompt 생성 함수
def create_prompt(request: ScheduleRequest) -> str:
    mapping_info = """
contenttypeid 의미:
- 12: 관광지
- 32: 숙박
- 39: 맛집
"""

    prompt = f"""
너는 여행 일정 전문가야.
아래 정보를 참고해 여행 일정을 생성해 줘.

✅ 조건:
- 반드시 JSON만 출력해. 설명이나 문장 추가 금지.
- 맛집은 11:00~13:00 시간대에 배치
- 숙박은 하루 마지막 일정
- 동선을 최소화
- 여행일수는 {request.dateRange.start} ~ {request.dateRange.end}

✅ contenttypeid 매핑
{mapping_info}

✅ 장소 데이터
{request.spots}

✅ 출발지
{request.departure}

✅ 이동수단
{request.transport}

✅ 인원 수
{request.persons}

✅ 출력 예시 (반드시 이 구조로 출력):
{{
  "days": [
    {{
      "date": "2024-07-01",
      "schedule": [
        {{"time":"09:00","place":"경복궁"}},
        {{"time":"11:30","place":"해장국집"}},
        {{"time":"20:00","place":"호텔"}}
      ]
    }}
  ]
}}
"""
    return prompt


# ✅ 📌 엔드포인트 등록
@app.post("/api/generate-schedule")
async def generate_schedule(request: ScheduleRequest):
    print("✅ 받은 요청 데이터:", request.dict())

    prompt = create_prompt(request)
    print("✅ 생성된 프롬프트:", prompt)

    try:
        # GPT 호출
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "너는 여행 일정 생성 전문가야. 반드시 JSON만 출력해."},
                {"role": "user", "content": prompt}
            ]
        )

        # GPT 응답
        schedule_text = completion.choices[0].message.content
        print("✅ GPT 응답:", schedule_text)

        # JSON 블록만 추출
        match = re.search(r"\{[\s\S]*\}", schedule_text)
        if not match:
            raise ValueError("JSON 블록을 찾을 수 없습니다.")

        schedule_json = json.loads(match.group())
        print("✅ 파싱된 JSON:", schedule_json)

        return {"schedule": schedule_json}

    except Exception as e:
        print("❌ JSON 파싱 실패:", e)
        raise HTTPException(status_code=500, detail="일정 생성 실패 - 서버 응답 처리 오류")


# ✅ 📌 (선택) 추가 라우터 등록 예시
try:
    from analyzer.api import router
    app.include_router(router)
except ImportError:
    print("⚠️ analyzer.api.router 를 찾을 수 없어 추가하지 않았습니다.")
    
# 라우터 등록
from analyzer.api import router as analysis_router
app.include_router(analysis_router)

from analyzer.keyword_extractor import router as keyword_router
app.include_router(keyword_router)

for route in app.routes:
    print(f"🔍 {route.path} → {route.name}")
    
from analyzer.agent_recommend import router as recommend_router
app.include_router(recommend_router)

# ✅ 새로 추가
from translate import router as translate_router
app.include_router(translate_router)
