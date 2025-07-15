from fastapi import APIRouter, HTTPException
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from typing import List
import pandas as pd
import os
import oracledb
from analyzer.schemas import MultiVSInput
from fastapi import HTTPException
from datetime import datetime
import pandas as pd
from fastapi.responses import JSONResponse
router = APIRouter()
import numpy as np

# ✅ 환경 설정
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Oracle 연결
dsn = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=121.78.128.150)(PORT=1521))(CONNECT_DATA=(SID=xe)))"
conn = oracledb.connect(user="team2", password="69017000", dsn=dsn)
cursor = conn.cursor()

# ✅ Trip 테이블에서 키워드 불러오기
def load_trip_keywords_from_db():
    cursor.execute("SELECT trip_no, keywords FROM trip WHERE keywords IS NOT NULL")
    rows = cursor.fetchall()
    return {trip_no: keywords for trip_no, keywords in rows}

# ✅ 데이터 로딩
DATA_PATH = "csv"
totaldata_df = pd.read_csv(f"{DATA_PATH}/totaldata.csv")
totaldata_df["검색건수"] = totaldata_df["검색건수"].astype(str).str.replace(",", "").astype(float)
totaldata_df["trip_no"] = totaldata_df["trip_no"].astype(int)

trip_df = totaldata_df.drop_duplicates("trip_no").copy()
trip_keywords_map = load_trip_keywords_from_db()
trip_df["keywords"] = trip_df["trip_no"].map(trip_keywords_map)

festival_df = pd.read_csv(f"{DATA_PATH}/totalfestas.csv")
festival_df["행사시작일"] = pd.to_datetime(festival_df["행사시작일"], format="%Y%m%d", errors="coerce")
festival_df["행사종료일"] = pd.to_datetime(festival_df["행사종료일"], format="%Y%m%d", errors="coerce")
festival_df.dropna(subset=["행사시작일", "행사종료일"], inplace=True)

# ✅ 공통 GPT 마케팅 문구 생성 함수
def generate_gpt_summary(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 여행지를 설명하는 감성 마케팅 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=300
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("❌ GPT 요약 실패:", str(e))
        return "이 지역은 감성과 정보가 어우러진 추천 여행지입니다."

# ✅ TripDetailPage용 요약 문구
def generate_trip_summary(trip_name: str, region: str, district: str, category: str, search_volume: float) -> str:
    prompt = f"""
'{trip_name}'은(는) 어디인가요? 왜 가야 하나요? 지금이 적기인가요?

여행지 '{trip_name}'은(는) {region} {district}에 위치한 {category} 중심지로,
현재 검색량은 약 {int(search_volume)}건으로 높은 관심을 받고 있습니다.

이 여행지는 최근 인기 급상승 중이며, 감성적인 휴식과 흥미로운 경험을 추구하는 분들에게 특히 추천됩니다.

위 내용을 기반으로 고객을 설득할 수 있는 3문장 이내의 감성적 + 정보력 있는 마케팅 문구를 작성해주세요.
"""
    return generate_gpt_summary(prompt)

# ✅ VS 추천용 요약 문구
def generate_ai_summary(region: str, month: int, festival: str, selected: List[str], category: str, place1: str, place2: str) -> str:
    prompt = f"""
당신은 관광 통계를 기반으로 감성적이고 설득력 있는 여행 마케팅 문구를 작성하는 전문가입니다.

다음 정보를 기반으로 사용자가 이 지역을 방문하고 싶어지도록, **3문장 이내**의 감성적이면서 정보력 있는 문장을 생성해주세요.

🔹 지역: {region}
🔹 월: {month}월
🔹 축제: {festival or '없음'}
🔹 선택 키워드: {', '.join(selected)}
🔹 인기 카테고리: {category}
🔹 대표 장소: {place1}, {place2}
"""
    return generate_gpt_summary(prompt)


KEYWORD_WEIGHT = 0.4
PLACE_WEIGHT = 0.6
KEYWORD_MATCH_WEIGHT = 6

# ✅ 점수 계산
def match_score(row, keywords: List[str]) -> float:
    score = 0.0
    log_search_volume = np.log1p(row["검색건수"])  # 최대값 완화
    for keyword in keywords:
        if keyword in row["중분류 카테고리"] or keyword in row["소분류 카테고리"]:
            score += log_search_volume * KEYWORD_WEIGHT
        if keyword in row["관광지명"]:
            score += log_search_volume * PLACE_WEIGHT
    return score

# ✅ 축제 필터링
def is_valid_trip(rows: pd.DataFrame) -> bool:
    # ❌ 너무 일반적인 단어는 제외 → 면세점 등만 제한
    exclude_name_keywords = ['면세점', '백화점', '아울렛']  # 쇼핑몰은 포함 가능
    exclude_categories = ['면세점', '백화점', '아울렛']       # 중분류에도 있는 경우 대비

    allow_name_keywords = ['시장', '거리', '전통', '문화', '골목', '광장', '테마파크', '리조트', '해변', '공원']

    for _, row in rows.iterrows():
        try:
            name = str(row.get("관광지명", "")).strip()
            category = str(row.get("중분류 카테고리", "")).strip()

            # ⛔ 제외 키워드가 이름에 포함되고, 동시에 허용 키워드가 없으면 필터링
            if any(bad in name for bad in exclude_name_keywords) and not any(ok in name for ok in allow_name_keywords):
                return False

            # ⛔ 제외 카테고리
            if category in exclude_categories:
                return False

        except Exception as e:
            print(f"⚠️ 여행지 유효성 검사 중 오류 발생: {e}")
            continue

    return True



def get_festival_for_region(region: str, month: int) -> str:
    try:
        if not region or pd.isna(region) or region.strip() == "":
            return ""

        # 주소 컬럼이 존재하고 문자열인지 확인
        if "주소" not in festival_df.columns or not pd.api.types.is_string_dtype(festival_df["주소"]):
            return ""

        # 날짜 필드 안전성 확보
        if "행사시작일" not in festival_df.columns or "행사종료일" not in festival_df.columns:
            return ""

        filtered = festival_df[
            festival_df["주소"].str.contains(region, na=False) &
            (festival_df["행사시작일"].dt.month <= month) &
            (festival_df["행사종료일"].dt.month >= month)
        ]

        if filtered.empty:
            return ""

        return filtered["명칭"].iloc[0]

    except Exception as e:
        print(f"⚠️ 축제 필터링 중 오류 발생 (region={region}, month={month}): {e}")
        return ""

# ✅ 인기 카테고리 / 장소
def get_top_categories(trip_no: int, n: int = 2) -> List[str]:
    data = totaldata_df[totaldata_df["trip_no"] == trip_no]
    grouped = data.groupby("중분류 카테고리")["검색건수"].sum().reset_index()
    return grouped.sort_values(by="검색건수", ascending=False)["중분류 카테고리"].head(n).tolist()

def get_top_places(trip_no: int, n: int = 2) -> List[str]:
    data = totaldata_df[totaldata_df["trip_no"] == trip_no]
    grouped = data.groupby("관광지명")["검색건수"].sum().reset_index()
    return grouped.sort_values(by="검색건수", ascending=False)["관광지명"].head(n).tolist()

# ✅ 추천 API
@router.post("/trip/agent-recommend")
def multi_vs_recommend(input: MultiVSInput):
    combined_keywords = input.score_keywords + input.emotional_keywords
    if len(combined_keywords) != 10:
        raise HTTPException(status_code=400, detail=f"키워드는 총 10개여야 합니다. 현재 {len(combined_keywords)}개 입력됨.")

    current_month = datetime.now().month
    trip_scores = []

    # 🔍 유효한 여행지만 추출
    valid_trip_nos = [
        trip_no for trip_no in trip_df["trip_no"].unique()
        if is_valid_trip(totaldata_df[totaldata_df["trip_no"] == trip_no])
    ]

    for trip_no in valid_trip_nos:
        rows = totaldata_df[totaldata_df["trip_no"] == trip_no]
        base_score = sum(match_score(r, combined_keywords) for _, r in rows.iterrows())

        trip_keywords_str = trip_df[trip_df["trip_no"] == trip_no]["keywords"].values[0]
        trip_keywords = trip_keywords_str.split(",") if isinstance(trip_keywords_str, str) else []

        matched_keywords = set(combined_keywords) & set(trip_keywords)
        keyword_match_ratio = len(matched_keywords) / len(combined_keywords)  # 0.0 ~ 1.0
        keyword_score = keyword_match_ratio * KEYWORD_MATCH_WEIGHT * 10  # 최대 100점 스케일

        total_score = base_score + keyword_score
        region = rows["시/군/구"].iloc[0] if not rows.empty else ""
        trip_scores.append((trip_no, total_score, region, matched_keywords))

    if not trip_scores or all(score == 0 for _, score, *_ in trip_scores):
        raise HTTPException(status_code=404, detail="추천할 여행지를 찾을 수 없습니다.")

    # 점수가 가장 높은 여행지 선택
    best_trip_no, _, best_region, matched_keywords = max(trip_scores, key=lambda x: x[1])
    best_trip_row = trip_df[trip_df["trip_no"] == best_trip_no].iloc[0]
    best_festival = get_festival_for_region(best_region, current_month)

    categories = get_top_categories(best_trip_no)
    places = get_top_places(best_trip_no)

    summary = generate_ai_summary(
        region=best_region,
        month=current_month,
        festival=best_festival,
        selected=combined_keywords,
        category=", ".join(categories) if categories else "문화/관광",
        place1=places[0] if places else "대표장소1",
        place2=places[1] if len(places) > 1 else "대표장소2"
    )

    return {
        "trip": {
            "trip_no": int(best_trip_row.trip_no),
            "tname": best_trip_row["관광지명"],
            "district": best_trip_row["시/군/구"],
            "matched_keywords": list(matched_keywords)
        },
        "summary": summary,
        "reason": f"'{best_trip_row['관광지명']}'은(는) 사용자의 선택 키워드 중 '{', '.join(matched_keywords)}' 키워드와 유사하며, 감성적으로 잘 맞는 여행지입니다."
    }

    
# ✅ GPT 요약 생성 AP

@router.get("/trip/agent-recommend/summary")
def recommend_summary(trip_no: int):
    try:
        trip_rows = trip_df[trip_df["trip_no"] == trip_no]
        if trip_rows.empty:
            raise HTTPException(status_code=404, detail="해당 여행지를 찾을 수 없습니다.")

        row = trip_rows.iloc[0]
        rows = totaldata_df[totaldata_df["trip_no"] == trip_no]

        # ✅ 유효한 여행지인지 검증 (쇼핑몰, 면세점 등 제외)
        if not is_valid_trip(rows):
            raise HTTPException(status_code=400, detail="⚠️ 이 여행지는 추천 대상에서 제외된 장소입니다. 다른 장소를 선택해주세요.")

        trip_name = row["관광지명"]
        region = row["광역시/도"]
        district = row["시/군/구"]
        category_list = get_top_categories(trip_no)
        category = category_list[0] if category_list else "여행지"
        search_volume_raw = rows["검색건수"].sum()
        search_volume = float(search_volume_raw) if not pd.isna(search_volume_raw) else 0.0

        # 키워드 처리
        keyword_str = str(row.get("keywords", "")).strip()
        keywords = keyword_str.split(",") if keyword_str else []
        keyword_text = ", ".join(keywords[:3]) if keywords else "감성, 힐링, 자연"

        # 축제 문장 처리
        raw_festival = get_festival_for_region(district, datetime.now().month)
        if pd.isna(raw_festival) or not raw_festival:
            festival_text = "별도 축제는 없지만, 계절적 분위기가 매력적인 장소입니다."
            festival_short = "없음"
        else:
            festival_text = f"'{raw_festival}' 축제가 열려 분위기가 더욱 활기찹니다."
            festival_short = raw_festival

        # GPT 프롬프트 구성
        prompt = f"""
당신은 AI 기반 맞춤 여행 마케팅 에이전트입니다.

다음 여행지에 대해 사용자가 지금 가장 끌릴 수 있도록 5문장의 감성 카피를 작성하세요:

1. {datetime.now().month}월 기준, 지금 '{trip_name}'을 방문해야 하는 시기적 이유를 트렌드, 계절, 이슈 중심으로 설명  
2. {region} {district}에 위치한 이 장소만의 분위기, 자연, 문화, 독특한 장소감을 감성적으로 묘사  
3. '감성적이고 트렌디한 여행 성향'을 가진 사용자에게 이 장소가 왜 어울리는지 설득  
4. {festival_text}  
5. 마지막 문장은 다음과 같이 마무리: "{keyword_text}" 같은 키워드를 가진 당신이라면, 분명 이곳에서 가장 큰 영감을 받을 것입니다.

[입력 요약]
- 지역명: {region}
- 여행지명: {trip_name}
- 카테고리: {category}
- 검색량: {int(search_volume):,}건
- 키워드: {keyword_text}
- 축제: {festival_short}

🎯 주의사항:
- 단순 소개가 아니라, 설득형 카피로 작성
- 지역명과 장소명 반복은 줄이고 문장 연결을 자연스럽게
- 마치 사용자의 성향을 읽고 AI가 추천하는 듯한 어투 유지
"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 여행지를 설명하는 감성 마케팅 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=400
        )
        summary = response.choices[0].message.content.strip()

        return {
            "summary": summary,
            "reason": f"'{trip_name}'은(는) '{keyword_text}' 키워드와 잘 어울리고, {region} {district} 지역의 계절 감성과 함께 추천할 수 있는 여행지입니다."
        }

    except HTTPException as e:
        raise e  # 400/404는 그대로 전달

    except Exception as e:
        print("❌ recommend_summary 에러:", str(e))
        raise HTTPException(status_code=500, detail=f"추천 요약 생성 중 오류: {str(e)}")
