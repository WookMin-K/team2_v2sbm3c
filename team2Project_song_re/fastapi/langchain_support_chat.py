"""
langchain_support_chat.py
LangChain-Community 기반 고객 클라우드 서비스 지원 토크 시스템 예제 (APIRouter, 비동기 버전)
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from datetime import datetime
import logging

# LangChain-Community imports
from langchain_community.llms import OpenAI
from langchain_community.embeddings.openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# Database imports
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 환경 변수에서 API 키 로드
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY 환경 변수가 설정되어 있지 않습니다.")

# APIRouter 생성
router = APIRouter()

# 벡터 DB 및 임베딩 초기화
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
vectordb = Chroma(persist_directory="chroma_db", embedding_function=embeddings)
retriever = vectordb.as_retriever(search_kwargs={"k": 5})

# LLM 초기화 (GPT-4o-mini)
llm = OpenAI(
    model_name="gpt-4o-mini",
    temperature=0.2,
    openai_api_key=OPENAI_API_KEY
)

# SQLite DB 설정
DATABASE_URL = "sqlite:///./chat_history.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    question = Column(Text)
    answer = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

# 테이블 생성
Base.metadata.create_all(bind=engine)

# 요청/응답 모델
class ChatRequest(BaseModel):
    user_id: str
    question: str

class ChatResponse(BaseModel):
    answer: str
    chat_history: list

# 챗봇 엔드포인트 (비동기)
@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    db = SessionLocal()
    try:
        # 과거 대화 메모리 주입
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        history = db.query(Message).filter_by(user_id=req.user_id).order_by(Message.timestamp).all()
        for msg in history:
            memory.chat_memory.add_user_message(msg.question)
            memory.chat_memory.add_ai_message(msg.answer)

        # 체인 실행 (비동기)
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            verbose=False,
        )
        result = await chain.arun(question=req.question)

        # 결과 처리
        answer = result.get("answer")
        chat_hist = memory.load_memory_variables({"chat_history": []}).get("chat_history", [])

        # DB에 저장
        new_msg = Message(
            user_id=req.user_id,
            question=req.question,
            answer=answer,
            timestamp=datetime.utcnow()
        )
        db.add(new_msg)
        db.commit()

        return ChatResponse(answer=answer, chat_history=chat_hist)

    except Exception as e:
        logging.exception("챗봇 처리 중 오류 발생")
        raise HTTPException(status_code=500, detail="챗봇 응답 생성 실패")

    finally:
        db.close()
