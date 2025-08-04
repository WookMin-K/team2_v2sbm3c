from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import json
import re
import openai
from openai import OpenAI
from typing import List

from sqlalchemy.orm import Session
from db import SessionLocal
from models import User, ChatHistory, Base

# LangChain imports
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from rag_utils import get_vectorstore
from langchain.prompts import PromptTemplate

# 1) DB 종속성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ .env 로드
load_dotenv()

# ✅ OpenAI 클라이언트 초기화
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print("✅ API KEY (repr):", repr(OPENAI_API_KEY))
openai.api_key = OPENAI_API_KEY
client = OpenAI(api_key=OPENAI_API_KEY)


# 1) vectorstore 초기화
vectorstore = get_vectorstore()
# 2) RetrievalQA 체인 생성
# “Context에 있는 내용만 참고” 하라는 프롬프트 템플릿
template = """
아래 'Context'에 있는 내용만 참고해서 질문에 **정확하게** 답해주세요.
 Context:
 {context}

 질문:
 {question}

 ※ Context에 답이 없다면, '죄송합니다. 해당 정보를 찾을 수 없습니다.'라고만 답해주세요.
 """

prompt = PromptTemplate(
    template=template,
    input_variables=["context", "question"]
)

qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0),
    chain_type="stuff",
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": prompt},
)
# ✅ FastAPI 앱 생성
app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://121.78.128.95:3000"],         # or ["http://localhost:3000"] for local dev only
    allow_credentials=True,
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
    
class ChatRequest(BaseModel):
    user_no: int | None       # guest 면 None
    user_name: str | None     # guest 면 None
    query: str
    
class ChatHistoryItem(BaseModel):
    role: str
    content: str
    created_at: str

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
- 맨처음 일정은 {request.departure} 에서 출발하는걸로 해줘 
- 반드시 JSON만 출력해. 설명이나 문장 추가 금지.
- 맛집은 11:00~13:00 시간대에 배치
- 숙박은 하루 마지막 일정
- 동선을 최소화
- 여행일수는 {request.dateRange.start} ~ {request.dateRange.end}
- 여행 마지막 일정은 {request.departure} 로 돌아가게 해줘 

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

# 대화 이력만 조회 엔드포인트
@app.get("/api/chat/history", response_model=List[ChatHistoryItem])
def get_chat_history(user_no: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_no == user_no).first()
    if not user:
        raise HTTPException(404, "등록된 회원이 아닙니다.")
    rows = (
        db.query(ChatHistory)
          .filter(ChatHistory.user_no == user_no)
          .order_by(ChatHistory.created_at)
          .all()
    )
    return [
        ChatHistoryItem(
            role=row.role,
            content=row.content,
            created_at=row.created_at.isoformat()
        )
        for row in rows
    ]
    
# 4) /api/chat 엔드포인트
@app.post("/api/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # — 사용자·이력 조회 —
    if request.user_no:
        user = db.query(User).filter(User.user_no == request.user_no).first()
        if not user:
            raise HTTPException(404, "등록된 회원이 아닙니다.")
        name = user.name
        past = (
            db.query(ChatHistory)
              .filter(ChatHistory.user_no == request.user_no)
              .order_by(ChatHistory.created_at)
              .all()
        )
    else:
        name = "손님"
        past = []


    # # 4) 대화 실행 (history + 지금 질문)
    # answer = chat_chain.predict(query=request.query)
    
    # 4) RAG 기반 응답 생성
    answer = qa_chain.run(request.query)
    
    # -- 파일에도 기록 --
    with open("chat_history.txt", "a", encoding="utf-8") as f:
        f.write(f"USER: {request.query}\n")
        f.write(f"AI  : {answer}\n")
        f.write("-" * 40 + "\n")

    # — DB에 새 이력 저장 (회원만) —
    if request.user_no:
        db.add(ChatHistory(user_no=request.user_no, role="human", content=request.query))
        db.add(ChatHistory(user_no=request.user_no, role="ai",    content=answer))
        db.commit()

    return {"answer": answer}



    

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


from analyzer.agent_recommend_api import router as agent_router
app.include_router(agent_router)
for route in app.routes:
    print(f"🔍 {route.path} → {route.name}")

# ✅ 새로 추가
from translate import router as translate_router
app.include_router(translate_router)


