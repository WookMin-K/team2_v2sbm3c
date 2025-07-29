# ✅ 전체 추천 API 완성형 (GPT가 5개 후보 중 1개 선택)
from fastapi import APIRouter, HTTPException, Request  
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from typing import List, Dict
import pandas as pd
import numpy as np
import os
import oracledb
from typing import List, Tuple
from uuid import uuid4
from analyzer.schemas import MultiVSInput
from datetime import datetime


router = APIRouter()

# ✅ 환경 설정
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Oracle 연결
dsn = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=121.78.128.150)(PORT=1521))(CONNECT_DATA=(SID=xe)))"
conn = oracledb.connect(user="team2", password="69017000", dsn=dsn)
cursor = conn.cursor()

# ✅ AI 사용 제한 로직 (비회원=IP, 유저=user_no)
ai_usage_cache: Dict[str, int] = {}

def get_limit_key(user_no: int = None, request: Request = None) -> Tuple[str, str]:
    today = datetime.now().strftime('%Y-%m-%d')
    if user_no:
        return f"user:{user_no}:{today}", "user"
    ip = request.client.host if request else "unknown"
    return f"ip:{ip}:{today}", "guest"

def check_ai_limit(user_no: int = None, request: Request = None):
    key, user_type = get_limit_key(user_no, request)
    limit = 3 if user_type == "user" else 1

    # 화이트리스트 예외 (관리자 or 시연 계정)
    if user_no in [1, 26]:
        return

    count = ai_usage_cache.get(key, 0)
    if count >= limit:
        raise HTTPException(status_code=429, detail=f"오늘은 AI 추천을 {limit}회까지만 이용할 수 있습니다.")

    ai_usage_cache[key] = count + 1



# ✅ Trip 테이블에서 키워드 불러오기
def load_trip_keywords_from_db():
    cursor.execute("SELECT trip_no, keywords FROM trip WHERE keywords IS NOT NULL")
    rows = cursor.fetchall()
    return {trip_no: keywords for trip_no, keywords in rows}

# ✅ CSV 로딩
data_path = "csv"
totaldata_df = pd.read_csv(f"{data_path}/totaldata.csv")
totaldata_df["검색건수"] = totaldata_df["검색건수"].astype(str).str.replace(",", "").astype(float)
totaldata_df["trip_no"] = totaldata_df["trip_no"].astype(int)

# 중복 제거 및 trip 키워드 매핑
trip_df = totaldata_df.drop_duplicates("trip_no").copy()
trip_keywords_map = load_trip_keywords_from_db()
trip_df["keywords"] = trip_df["trip_no"].map(trip_keywords_map).fillna("")


festival_df = pd.read_csv(f"{data_path}/totalfestas.csv")
festival_df["행사시작일"] = pd.to_datetime(festival_df["행사시작일"], format="%Y%m%d", errors="coerce")
festival_df["행사종료일"] = pd.to_datetime(festival_df["행사종료일"], format="%Y%m%d", errors="coerce")
festival_df.dropna(subset=["행사시작일", "행사종료일"], inplace=True)


# ✅ 점수 계산
def match_score(row, keywords, trip_keywords):
    """
    검색건수 기반 점수는 줄이고, trip_keywords 중심 감성 점수를 강화한 함수.
    """
    log_vol = np.log1p(row["검색건수"])
    score = 0.0
    used = set()

    for kw in keywords:
        if kw in used:
            continue
        used.add(kw)

        # 중분류 / 소분류 카테고리 키워드 포함 시: 가중치 낮게
        if kw in row["중분류 카테고리"] or kw in row["소분류 카테고리"]:
            score += log_vol * 0.1  # ✅ 낮은 영향력

        # 관광지명에 포함될 경우
        if kw in row["관광지명"]:
            score += log_vol * 0.15  # ✅ 중간 영향력

        # trip 테이블 keywords에 포함될 경우
        if kw in trip_keywords:
            score += 0.4  # ✅ 감성 키워드 강한 영향력 (검색량과 무관)

    return score

def keyword_match_score(keywords, trip_keywords):
    """
    사용자 감성 키워드와 여행지 키워드의 교집합 비율을 계산.
    """
    set_user = set(keywords)
    set_trip = set(trip_keywords)

    if not set_user or not set_trip:
        return 0.0

    match_count = len(set_user & set_trip)
    match_ratio = match_count / len(set_user)

    return match_ratio



KEYWORD_MATCH_WEIGHT = 15

def is_valid_trip(rows):
    exclude = ['면세점', '백화점', '아울렛','역']
    allow = ['시장', '거리', '전통', '문화', '골목', '광장', '테마파크', '리조트', '해변', '공원']
    for _, row in rows.iterrows():
        name = str(row.get("관광지명", ""))
        cat = str(row.get("중분류 카테고리", ""))
        if any(e in name for e in exclude) and not any(a in name for a in allow):
            return False
        if cat in exclude:
            return False
    return True

def get_festival(region, month):
    try:
        filtered = festival_df[
            festival_df["주소"].str.contains(region, na=False) &
            (festival_df["행사시작일"].dt.month <= month) &
            (festival_df["행사종료일"].dt.month >= month)
        ]
        return filtered["명칭"].iloc[0] if not filtered.empty else ""
    except:
        return ""

def get_top_places(trip_no, n=2):
    data = totaldata_df[totaldata_df["trip_no"] == trip_no]
    return data.groupby("관광지명")["검색건수"].sum().sort_values(ascending=False).head(n).index.tolist()

def get_top_categories(trip_no, n=2):
    data = totaldata_df[totaldata_df["trip_no"] == trip_no]
    return data.groupby("중분류 카테고리")["검색건수"].sum().sort_values(ascending=False).head(n).index.tolist()

totaldata_df_grouped = totaldata_df.groupby("trip_no")["검색건수"].sum().reset_index().sort_values(by="검색건수", ascending=False).reset_index(drop=True)

def get_trip_rank(trip_no: int) -> int:
    rank_row = totaldata_df_grouped[totaldata_df_grouped["trip_no"] == trip_no]
    if rank_row.empty:
        return None
    return int(rank_row.index[0]) + 1

def build_trip_summary(row, keywords, volume, category, place1, place2, festival):
    keyword_text = ", ".join(keywords[:3])
    congestion = "많이 붐빔" if volume > 200000 else "약간 북적임" if volume > 100000 else "여유로운 곳"
    return f"『{row['관광지명']}』 - {row['광역시/도']} {row['시/군/구']}, 키워드: {keyword_text}, 검색량: {int(volume):,}건 ({congestion}), 콘텐츠: {place1}, {place2}, 축제: {festival or '없음'}"

def get_current_season() -> str:
    month = datetime.now().month
    if 3 <= month <= 5:
        return "봄"
    elif 6 <= month <= 8:
        return "여름"
    elif 9 <= month <= 11:
        return "가을"
    else:
        return "겨울"


import json

def get_last_trip_info(user_no=None, session_id=None):
    """
    🔐 로그인 유저만 과거 추천 이력 조회 가능
    🧑‍🚫 비회원(session_id) 이력은 저장만 되고, 조회는 반영하지 않음
    """
    if not user_no:
        print("🚫 비회원은 과거 추천 이력을 조회하지 않습니다.")
        return None

    print(f"🔍 [QUERY] 사용자 번호 기반 조회 시도: user_no = {user_no}")
    cursor.execute("""
        SELECT trip_no, keywords, result_summary
        FROM (
            SELECT trip_no, keywords, result_summary
            FROM recommend_log
            WHERE user_no = :user_no
            ORDER BY timestamp DESC
        )
        WHERE ROWNUM = 1
    """, {"user_no": user_no})

    row = cursor.fetchone()
    if row:
        trip_no, raw_keywords, summary = row[0], row[1], row[2] or ""

        cursor.execute("SELECT sname FROM trip WHERE trip_no = :trip_no", {"trip_no": trip_no})
        result = cursor.fetchone()
        trip_name = result[0] if result else "이전 여행지"

        # keywords는 json 문자열 or 쉼표 문자열일 수 있음
        try:
            keyword_list = json.loads(raw_keywords)
            keywords_str = ", ".join(keyword_list) if isinstance(keyword_list, list) else str(raw_keywords)
        except:
            keywords_str = str(raw_keywords)

        return {
            "user_no": user_no,
            "trip_no": trip_no,
            "trip_name": trip_name,
            "keywords": keywords_str,
            "keywords_list": keywords_str.split(", "),
            "result_summary": summary
        }

    print("ℹ️ 추천 이력 없음 (user_no 존재, 기록 없음)")
    return None


def build_agent_prompt(
    user_name: str,
    last_trip: str,
    last_keywords: str,
    last_summary: str,
    place_list: str,
    summaries: List[str],
    qna_text: str,
    top5: List[Tuple[int, float]],
    current_season: str
) -> str:
    user_name = user_name or "여행자"
    last_trip = last_trip or "없음"
    last_keywords = last_keywords or "기록 없음"
    last_summary = last_summary or "이전에 추천된 정보는 없습니다."
    place_split = (place_list or "추천된 장소 없음").split(",")
    place1, place2, place3 = (place_split + ["", "", ""])[:3]
    qna_text = qna_text or "- 없음"

    formatted_summaries = "\n".join([
    f"{i+1}. {trip_df[trip_df['trip_no'] == trip_no]['시/군/구'].values[0]}"
    f" ({trip_df[trip_df['trip_no'] == trip_no]['관광지명'].values[0]}), trip_no={trip_no}: {summary}"
    for i, ((trip_no, _), summary) in enumerate(zip(top5, summaries))
])


    return f"""
# 🎯 역할 정의
당신은 'Travel AI'라는 감성 여행 에이전트입니다.  
이용자의 감정, 성향, 계절, 관심 장소 등을 고려해, 친구처럼 감성적으로 조언하는 여행 파트너입니다.  
정보를 단순 나열하지 말고, **감정과 이유를 담아 설득력 있게** 추천해주세요.  
최종 선택은 당신이 직접 해야 합니다. 사용자의 취향을 고려하여 **5개 후보 중 1곳만 선택**하고, 감성적 설명과 이유를 함께 작성해주세요.

## 당신은 감성 여행 에이전트로써, 해당 지침을 필수로 지시해야합니다.
이전 추천 회고 정보가 있다면 필수로 첫 문장에 꼭 last_trip, last_keywords를 적절히 언급하여 이전 추천 내용을 언급하세요.
만약 last_trip가 없음, last_keywords가 기록 없음일 경우 신규 사용자로 가정하고 이전 여행지 언급을 하지 않습니다.

# 📌 최종 목표
- 아래 5개의 지역 후보 중 **1곳을 골라 추천**해주세요.  
- 추천 문장은 총 **7~8문장**, 감성적이면서도 구체적으로 작성해주세요.  


# 👤 사용자 정보
- 이름: {user_name}
- 이전에 추천했던 여행지: {last_trip}
- 이전에 선택한 감성 키워드: {last_keywords}
- 주요 명소: {place1}, {place2}, {place3}
- 현재 계절: {current_season}

# 🔁 이전 추천 회고 정보
지난번에는 {last_trip}을 추천했어요.  
그때는 이런 이유로 선택했죠: {last_summary}

이전 추천에서 사용자가 선택한 키워드와 이번 키워드가 겹칠 수 있어요.  
**이번에는 겹치는 감성을 유지하면서도, 새로운 경험을 줄 수 있는 장소를 추천해주세요.**  
반면, **직전 추천 장소와 너무 유사하거나 같은 장소는 피해주세요.**  
당신은 사용자의 성향을 기억하고 있으므로,  
이번 추천에서도 그 흐름이 이어지되, **새로운 분위기와 감정을 함께 제안해야 합니다.**

또한 아래 5개의 후보 중에서,
- **이전 키워드와 유사한 감성을 가진 후보**는 **더 신중히 고려**하고  
- **이전 여행지와 동일하거나 비슷한 지역/장소는 피할 것**  
- **선택 근거에는 과거 기록과 현재 선택한 키워드를 반드시 포함할 것**

이번에는 그 감정을 기억하면서도, **{current_season}에 어울리는 새로운 감성**을 담아 추천해주세요.  
특히 {last_keywords} 같은 키워드를 선택했던 {user_name}님이라면 이번에도 비슷한 감정선을 찾고 싶어할 가능성이 높아요.

# 🧠 사용자 성향 분석 (선택)
{qna_text}

# 🗺️ 후보 목록 요약
{formatted_summaries}

※ 아래는 후보 요약의 예시입니다:  
- 강릉 경포해변: 감성적인 해변과 여름철 음악 축제, 낮보다 밤이 더 아름다운 곳.  
- 전주 한옥마을: 전통과 현대가 어우러진 골목, 고즈넉한 분위기와 먹거리 가득.  
이 형식을 참고해 내용을 잘 파악하고, 적절한 후보를 선택하세요.

# ✍️ 작성 기준 (요약 정리)
- [필수] 첫 문장에 추천 지역과 장소를 명시해주세요.  
- [필수] 사용자의 감정/키워드와 추천 이유를 연결해주세요.  
- [필수] 지역의 콘텐츠나 축제, 계절 요소 중 하나 이상 포함해주세요.  
- [필수(있을 경우)] 예시 스타일  
  - “이번엔 {user_name}님께 딱 어울리는 지역명, 장소명을 추천할게요.”  
  - “최근 {last_trip}에 다녀오셨다면, 이번엔 {place1}에서 새로운 분위기를 느껴보세요.”  
  - “{last_keywords} 같은 키워드를 고르신 {user_name}님이라면 분명히 좋아하실 거예요.”
- [선택] {place1}의 내용이 부족하다면 {place2}, {place3} 같은 장소들도 함께 추천해주세요.

# 🛑 주의사항
- 추상적인 말만 반복하지 말고, **구체적인 이유**를 담아 설득해주세요.  
- 후보에 없는 지역을 새로 만들거나, 지역명을 임의로 변경하지 마세요.  
- 장소명이 "역", "정류장", "학교", "터미널", "백화점", "아울렛"일 경우, 감성 표현에서는 제외하고 대신 {place2}, {place3} 같은 장소를 중심으로 서술해주세요.  
- 문장은 리듬감 있게, 말투는 부드럽고 친근하게 써주세요. **에이전트로서 주도적**으로 말해주세요.

# ✅ 기대되는 사용자 반응
“AI가 나를 이해해줘서 신기하다.”  
“이 지역, 진짜 가보고 싶다.”  
“친구가 추천해준 느낌이라 좋다.”  
“다른 키워드로도 더 추천 받아보고 싶다.”

# 🔚 마무리 지시
- 감성적으로, 하지만 **사실과 연결된 판단**을 내려주세요.  
- 선택은 당신의 몫입니다. 사용자에게 가장 설득력 있는 감정적 + 논리적 이유를 전달해주세요.

# 🔢 선택 형식 지시
- 반드시 아래 후보 중 실제 여행지 번호(`trip_no`)를 선택해주세요.
- 마지막 줄에 아래 형식처럼 선택한 trip_no를 명시해주세요.

- 예시 : [추천 trip_no: 18]

top5 리스트 외의 번호를 생성하지 마세요.

""".strip()

def is_guest_session(session_id: str) -> bool:
    return session_id is None or session_id.startswith("guest_")

def generate_agent_recommendation_prompt(input, top5, summaries, place_list, qna_text):
    session_id = input.session_id if hasattr(input, "session_id") else None

    # ✅ guest session이면 과거 정보 무시
    if input.user_no:
        last_info = get_last_trip_info(user_no=input.user_no)
    elif session_id and not is_guest_session(session_id):
        last_info = get_last_trip_info(session_id=session_id)
    else:
        last_info = None

    current_season = get_current_season()

    return build_agent_prompt(
        user_name=input.user_name,
        last_trip=last_info["trip_name"] if last_info else None,
        last_keywords=last_info["keywords"] if last_info else None,
        last_summary=last_info["result_summary"] if last_info else None,
        place_list=place_list,
        summaries=summaries,
        qna_text=qna_text,
        top5=top5,
        current_season=current_season 
    )
    



def generate_agent_recommendation(prompt):
    try:
        res = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": """
                당신은 'Travel AI'라는 감성 여행 에이전트입니다.  
                사용자의 감정, 취향, 계절, 여행 이력을 종합적으로 분석하여  
                가장 적합한 여행지를 직접 판단하고 설득력 있게 설명하는 역할을 맡고 있습니다.  
                친구처럼 따뜻하게 말하되, 정보 기반 판단도 놓치지 마세요. 
                또한 당신은 과거 정보도 알고 있으므로, 이를 언급하여 사용자에게 감동을 줄 수 있습니다.
                """.strip()},
                {"role": "user", "content": prompt}
            ],
            temperature=0.35,
            top_p=0.85,
            max_tokens=1200,
            presence_penalty=0.6,
            frequency_penalty=0.2
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        print("❌ GPT 추천 실패:", e)
        return "이번엔 여기가 참 잘 어울릴 것 같아요. 함께 떠나볼까요?"

# ✅ 최종 API
@router.post("/trip/agent-recommend")
def agent_recommend(input: MultiVSInput, request: Request):
    check_ai_limit(user_no=input.user_no if hasattr(input, "user_no") else None, request=request)
    keywords = input.score_keywords + input.emotional_keywords
    if len(keywords) < 6:
        raise HTTPException(status_code=400, detail="키워드는 최소 6개 이상이어야 합니다.")

    qna_pairs = [
        {"question": q.question, "answer": q.answer} for q in input.selected_questions
    ] if input.selected_questions else []

    now_month = datetime.now().month
    current_season = get_current_season()

    def extract_keywords(trip_no: int) -> List[str]:
        row = trip_df[trip_df["trip_no"] == trip_no]
        if row.empty:
            return []
        keyword_str = row["keywords"].values[0]
        if pd.isna(keyword_str) or not isinstance(keyword_str, str):
            return []
        return [k.strip() for k in keyword_str.split(",") if k.strip()]

    # ✅ 점수 계산
    scores = []
    for trip_no in totaldata_df["trip_no"].unique():
        trip_rows = totaldata_df[totaldata_df["trip_no"] == trip_no]
        trip_keywords = extract_keywords(trip_no)
        base_score = sum(
            match_score(row, keywords, trip_keywords)
            for _, row in trip_rows.iterrows()
        )
        match_score_kw = keyword_match_score(keywords, trip_keywords) * KEYWORD_MATCH_WEIGHT
        final_score = base_score + match_score_kw
        scores.append((trip_no, final_score))

    # ✅ 상위 5개 후보 추출
    top5 = sorted(scores, key=lambda x: x[1], reverse=True)[:5]
    trip_summaries, place_list, trip_names = [], [], []

    for trip_no, _ in top5:
        filtered = trip_df[trip_df["trip_no"] == trip_no]
        if filtered.empty:
            continue
        row = filtered.iloc[0]
        region = row["시/군/구"]
        volume = totaldata_df[totaldata_df["trip_no"] == trip_no]["검색건수"].sum()
        places = get_top_places(trip_no)
        cats = get_top_categories(trip_no)
        festa = get_festival(region, now_month)
        summary = build_trip_summary(
            row, keywords, volume,
            ", ".join(cats),
            places[0] if places else "",
            places[1] if len(places) > 1 else "",
            festa
        )
        trip_summaries.append(summary)
        place_list.extend(places[:1])
        trip_names.append((trip_no, row["관광지명"]))

    user_name = input.user_name or "여행자"
    print(f"👤 [전달된 사용자 이름]: {user_name}")
    session_id = input.session_id if hasattr(input, "session_id") else None
    user_no = input.user_no if hasattr(input, "user_no") else None

    # ✅ 로그인 여부에 따라 과거 추천 정보 불러오기
    if user_no:  # 로그인한 사용자
        last_info = get_last_trip_info(user_no=user_no, session_id=None)
    else:        # 비로그인 사용자
        last_info = get_last_trip_info(user_no=None, session_id=session_id)

    last_trip = last_info["trip_name"] if last_info and last_info.get("trip_name") else "없음"
    last_keywords = last_info["keywords"] if last_info and last_info.get("keywords") else "기록 없음"
    last_summary = last_info["result_summary"] if last_info and last_info.get("result_summary") else "이전에 추천된 정보는 없습니다."


    place_str = ", ".join(place_list) if place_list else None
    qna_text = "\n".join([f"Q: {q['question']}\nA: {q['answer']}" for q in qna_pairs]) if qna_pairs else None

    print("🧠 [이전 추천 정보]")
    print(f" - 마지막 여행지: {last_trip}")
    print(f" - 선택한 감성 키워드: {last_keywords}")
    print(f" - 추천 요약: {last_summary}")

    print("🔝 top5 candidates for GPT:")
    for idx, (trip_no, score) in enumerate(top5):
        name = trip_df[trip_df["trip_no"] == trip_no]["관광지명"].values[0]
        print(f"{idx+1}. {name} (trip_no={trip_no}, score={score:.2f})")

    # ✅ 프롬프트 생성 및 GPT 호출
    prompt = build_agent_prompt(
        user_name=user_name,
        last_trip=last_trip,
        last_keywords=last_keywords,
        last_summary=last_summary,
        place_list=place_str,
        summaries=trip_summaries,
        qna_text=qna_text,
        top5=top5,
        current_season=current_season
    )
    import re
    # ✅ GPT 응답 받기
    summary_text = generate_agent_recommendation(prompt)

    # ✅ trip_no 추출
    match = re.search(r"\[추천 trip_no:\s*(\d+)\]", summary_text)
    if match:
        chosen_trip_no = int(match.group(1))
        summary_text = re.sub(r"\[추천 trip_no:\s*\d+\]", "", summary_text).strip()
        chosen_row = trip_df[trip_df["trip_no"] == chosen_trip_no]
        matched = chosen_row["관광지명"].values[0] if not chosen_row.empty else "알 수 없음"
        print(f"🎯 ✅ 정규식 추출된 trip_no: {chosen_trip_no}, matched: {matched}")
    else:
        chosen_trip_no = top5[0][0]
        matched = trip_df[trip_df["trip_no"] == chosen_trip_no]["관광지명"].values[0]
        print("⚠️ GPT 응답에서 trip_no 추출 실패. fallback 사용.")



        # ✅ GPT 응답에서 trip_no 정규식 추출
        import re
        match = re.search(r"\[추천 trip_no:\s*(\d+)\]", summary_text)
        if match:
            chosen_trip_no = int(match.group(1))
            chosen_row = trip_df[trip_df["trip_no"] == chosen_trip_no]
            matched = chosen_row["관광지명"].values[0] if not chosen_row.empty else "알 수 없음"
        else:
            chosen_trip_no = top5[0][0]
            matched = trip_df[trip_df["trip_no"] == chosen_trip_no]["관광지명"].values[0]
            print("⚠️ GPT 응답에서 trip_no 추출 실패. fallback 사용.")

    # ✅ trip_keywords 불러오기
    keyword_str = trip_df[trip_df["trip_no"] == chosen_trip_no]["keywords"].values[0] if not trip_df.empty else ""
    trip_keywords = [k.strip() for k in keyword_str.split(",")] if isinstance(keyword_str, str) else []

    return {
        "trip": {
            "trip_no": int(chosen_trip_no),
            "sname": matched,
        },
        "summary": summary_text,
        "reason": f"TravelAI가 {matched}를 추천하는 이유입니다",
        "score": round(top5[0][1], 2),
        "rank": get_trip_rank(chosen_trip_no),
        "festival": get_festival(trip_df[trip_df["trip_no"] == chosen_trip_no]["시/군/구"].values[0], now_month),
        "matched_keywords": list(set(keywords) & set(trip_keywords)),
        "extracted_trip_no": match.group(1) if match else "fallback"
    }


