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
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from db import SessionLocal
from models import User, ChatHistory, Base

# LangChain imports

from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder
)
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI

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

SITE_SYSTEM_PROMPT = """
너는 'trAveI' 여행 자동 일정 생성 사이트의 챗봇이야.
아래 FAQ를 기반으로 짧고 정확하게 답하고,
추가 설명 요청이 오면 친절하게 풀어서 설명해 줘.

▶중요◀: 절대로 사용자의 질문을 반복하거나 질문 일부를 답변 앞에 넣지 마세요.
▶중요◀: “AI:”, “System:” 같은 접두사도 전혀 사용하지 말고, 오직 자연스러운 문장 형태로만 응답하세요.

Q: 여행 일정은 어떻게 생성하나요?
A: 메인에서 'trAveI 시작하기' 또는 '일정 생성' 클릭 → 여행지·날짜 등 정보입력 → 자동 생성됩니다.

Q: 일정을 저장하려면?
A: 회원가입 후 로그인 상태에서 생성하고 저장버튼을 누르면 저장돼요.

Q: 저장된 일정은 어디서 보나요?
A: 상단 메뉴 '마이페이지 → 내 일정'에서 확인 가능합니다.

Q: PDF로 저장할 수 있나요?
A: '내 일정' 화면의 'PDF 저장' 버튼을 누르면 돼요.

Q: 친구와 공유는?
A: 일정 상세보기에서 '공유하기' 버튼 클릭 → 링크 복사됩니다.

"""


# 2) 프롬프트 구성: system → human
chat_prompt = ChatPromptTemplate.from_messages([
    # (a) FAQ 가이드
    SystemMessagePromptTemplate.from_template(SITE_SYSTEM_PROMPT),
    # (b) 대화 히스토리 자리
    MessagesPlaceholder(variable_name="history"),
    # (c) 최신 질문
    HumanMessagePromptTemplate.from_template("{query}"),
])

# 3) 메모리
memory = ConversationBufferMemory(
    memory_key="history",
    return_messages=True,      
)

# 4) 체인 생성 (ConversationChain)
chat_chain = ConversationChain(
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0.7), # LangChain LLM 래퍼
    prompt=chat_prompt,             # 위에서 정의한 ChatPromptTemplate
    memory=memory,                  # ConversationBufferMemory
    input_key="query",
    verbose=False,
)


# ✅ FastAPI 앱 생성
app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.12.142:3000"],         # or ["http://localhost:3000"] for local dev only
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

    # 1) 메모리 완전 초기화
    memory.clear()

    if request.user_no:
        # 2) 로그인한 회원 → DB에서 이력 불러와서 memory에 채워 넣기
        past = (
            db.query(ChatHistory)
              .filter(ChatHistory.user_no == request.user_no)
              .order_by(ChatHistory.created_at)
              .all()
        )
        for msg in past:
            if msg.role == "human":
                memory.save_context(
                    {"query": msg.content},  # 과거 사용자 질문
                    {"response": ""}         # placeholder
                )
            else:
                memory.save_context(
                    {"query": ""},           # placeholder
                    {"response": msg.content}# 과거 봇 답변
                )
    else:
        # 3) 비로그인(guest) → 초기화된 상태(원하면 환영 메시지 한 줄만)
        memory.save_context(
            {"query": ""}, 
            {"response": "손님님, 환영합니다! 무엇을 도와드릴까요?"}
        )

    # 4) 대화 실행 (history + 지금 질문)
    answer = chat_chain.predict(query=request.query)

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


