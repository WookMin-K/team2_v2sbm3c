import os
import pandas as pd
from dotenv import load_dotenv
import openai

# 🔹 API 키 로딩
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# 🔹 경로 상수
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_DIR = os.path.join(BASE_DIR, "..", "csv")


# ✅ 월별 외지인 관광객 수 차트 생성
def generate_monthly_chart(region_code: str):
    file_path = os.path.join(CSV_DIR, f"{region_code}.csv")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found.")

    df = pd.read_csv(file_path, encoding="utf-8")

    # 컬럼 정리
    df.rename(columns={
        "기준년월": "month",
        "기조치자체": "dname",
        "방문자 구분": "type",
        "방문자 수": "visitors"
    }, inplace=True)

    # 🔹 외지인 필터링
    df = df[df["type"] == "외지인방문자(b)"]

    # 🔹 월별 방문자 수 합산
    df_grouped = df.groupby("month")["visitors"].sum().reset_index()

    # 🔹 형 변환
    df_grouped["month"] = df_grouped["month"].astype(str)
    df_grouped["visitors"] = df_grouped["visitors"].astype(int)

    return df_grouped.to_dict(orient="records")


# ✅ 파이차트 + Top5 관광지 데이터 생성
def generate_pie_and_top5(trip_no: int):
    file_path = os.path.join(CSV_DIR, "totaldata.csv")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found.")

    df = pd.read_csv(file_path, encoding="utf-8")

    # 🔹 검색건수 숫자화 (쉼표 제거 후 숫자 변환)
    df["검색건수"] = df["검색건수"].astype(str).str.replace(",", "").str.strip()
    df["검색건수"] = pd.to_numeric(df["검색건수"], errors="coerce")
    df = df[df["검색건수"].notnull() & (df["검색건수"] > 0)]


    # 🔹 trip_no 필터링
    filtered = df[df["trip_no"] == trip_no]

    if filtered.empty:
        print(f"⚠️ trip_no={trip_no}에 해당하는 검색 데이터 없음.")
        return {
            "piechart": [],
            "top5": []
        }

    # 🔹 파이차트: 중분류별 검색건수
    # 🔹 파이차트: 중분류별 검색건수 (NaN 방지)
    filtered = filtered.dropna(subset=["중분류 카테고리"])

    pie_df = (
        filtered.groupby("중분류 카테고리")["검색건수"]
        .sum()
        .reset_index()
        .sort_values(by="검색건수", ascending=False)
    )

    piechart = [
        {"name": row["중분류 카테고리"], "value": int(row["검색건수"])}
        for _, row in pie_df.iterrows()
    ]

    # 🔹 Top5 관광지
    top5_df = (
        filtered.groupby("관광지명")["검색건수"]
        .sum()
        .reset_index()
        .sort_values(by="검색건수", ascending=False)
        .head(5)
    )
    top5 = [
        {"name": row["관광지명"], "count": int(row["검색건수"])}
        for _, row in top5_df.iterrows()
    ]

    return {
        "piechart": piechart,
        "top5": top5
    }
