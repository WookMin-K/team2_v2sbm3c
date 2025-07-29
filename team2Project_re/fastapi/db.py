# db.py
from dotenv import load_dotenv
load_dotenv()       # .env 파일을 읽어서 os.environ 에 올려 줌

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DB_URL")  
# 예시: oracle+cx_oracle://user:pass@host:port/?service_name=XE

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
