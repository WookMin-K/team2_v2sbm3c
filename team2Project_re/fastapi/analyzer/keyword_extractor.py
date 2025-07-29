from fastapi import APIRouter
import openai
from dotenv import load_dotenv
import os
import oracledb
from typing import List
import ast  # 안전한 문자열 리스트 변환

router = APIRouter()
load_dotenv()

# ✅ GPT 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# ✅ Oracle 연결 설정
dsn = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=121.78.128.150)(PORT=1521))(CONNECT_DATA=(SID=xe)))"
conn = oracledb.connect(user="team2", password="69017000", dsn=dsn)
cursor = conn.cursor()

# ✅ 키워드 추출 함수
def extract_keywords_from_intro(intro: str) -> List[str]:
    prompt = f"""
다음은 여행지 소개글입니다. 이 내용을 기반으로 장소/감성/테마 중심 키워드 5~7개를 추출해주세요. 중복되거나 모호한 단어는 피하고, 고유명사보다는 일반화된 감성/분위기 키워드를 선호합니다.

[설명]
{intro}

[출력 예시]
["감성", "카페", "트렌디", "자연", "힐링", "문화"]
"""
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 여행지 소개글에서 키워드를 추출하는 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=300
        )
        return ast.literal_eval(response.choices[0].message.content.strip())  # 안전한 변환
    except Exception as e:
        print(f"❌ GPT 호출 실패: {e}")
        return []

# ✅ 라우터
@router.get("/trip/extract_keywords")
def extract_all_keywords():
    cursor.execute("SELECT trip_no, intro FROM trip WHERE intro IS NOT NULL")
    rows = cursor.fetchall()

    update_sqls = []
    for trip_no, intro in rows:
        try:
            keywords = extract_keywords_from_intro(str(intro))
            keyword_str = ",".join(keywords)
            update_sql = f"UPDATE trip SET keywords = '{keyword_str}' WHERE trip_no = {trip_no};"
            update_sqls.append(update_sql)
        except Exception as e:
            update_sqls.append(f"-- trip_no {trip_no} 처리 실패: {e}")

    return {"sql_list": update_sqls}
