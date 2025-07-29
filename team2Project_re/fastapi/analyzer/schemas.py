from pydantic import BaseModel
from typing import List, Optional

# ✅ 월별 방문자 차트 항목
class ChartItem(BaseModel):
    month: str          # 예: '1월', '2월'
    visitors: int       # 방문자 수

# ✅ 파이차트 항목 (중분류 카테고리 비율)
class PieItem(BaseModel):
    name: str           # 중분류 카테고리명
    value: int          # 해당 카테고리의 검색 건수

# ✅ Top5 장소 항목
class Top5Item(BaseModel):
    name: str           # 장소명
    count: int          # 검색 건수

# ✅ 분석 결과 응답 스키마
class InsightResponse(BaseModel):
    trip_no: int
    chart: List[ChartItem]      # 선형 차트 데이터
    insight: str                # AI 인사이트 문장
    piechart: List[PieItem]     # 파이차트 데이터
    top5: List[Top5Item]        # 인기 장소 Top5

# ✅ 질문/응답 쌍 (VS 기반 감성 문항)
class QuestionAnswerPair(BaseModel):
    question: str
    answer: str

# ✅ AI 추천 요청 입력 스키마
class MultiVSInput(BaseModel):
    score_keywords: List[str]
    emotional_keywords: List[str]
    selected_questions: Optional[List[QuestionAnswerPair]] = []
    user_name: Optional[str] = None  # ✅ 이 라인 추가
    last_trip: Optional[str] = None  # ✅ 이것도 썼다면 함께 추가
    user_no: Optional[int] = None         # 🔥 추가
    session_id: Optional[str] = None      # 🔥 추가
