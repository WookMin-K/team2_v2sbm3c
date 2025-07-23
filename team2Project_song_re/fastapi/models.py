from pydantic import BaseModel
from typing import List
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Spot(BaseModel):
    title: str
    x: float
    y: float
    addr1: str
    contenttypeid: int

class Departure(BaseModel):
    city: str
    district: str

class DateRange(BaseModel):
    start: str
    end: str

class ScheduleRequest(BaseModel):
    departure: Departure
    dateRange: DateRange
    transport: str
    persons: str
    spots: List[Spot]
    
# 챗봇용 SQLAlchemy 모델 정의
class User(Base):
    __tablename__ = "users"
    user_no    = Column(Integer, primary_key=True)
    user_id    = Column(String(50), unique=True, nullable=False)
    password   = Column(String(255), nullable=False)
    email      = Column(String(100), unique=True, nullable=False)
    name       = Column(String(100), nullable=False)
    phone      = Column(String(20))
    created_at = Column(DateTime)
    grade      = Column(Integer)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    history_id = Column(Integer, primary_key=True)
    user_no    = Column(Integer, ForeignKey("users.user_no", ondelete="CASCADE"))
    role       = Column(String(10), nullable=False)   # 'human' or 'ai'
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history")

User.history = relationship("ChatHistory", back_populates="user", cascade="all, delete")    

