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

# ✅ AI 추천 요청 입력 스키마
class MultiVSInput(BaseModel):
    score_keywords: List[str]           # 예: ['핫플', '산', ...]
    emotional_keywords: List[str]       # 예: ['감성', '힐링', ...]
    user_id: Optional[int] = None       # 비회원일 경우 None 가능
