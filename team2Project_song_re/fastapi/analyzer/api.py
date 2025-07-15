from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd

from analyzer.chart_generator import generate_monthly_chart, generate_pie_and_top5
from analyzer.insight_generator import generate_insight
from analyzer.agent_recommend import multi_vs_recommend, generate_trip_summary  # ✅ GPT 요약 함수 재사용
from analyzer.schemas import MultiVSInput
import traceback
import os



router = APIRouter(prefix="/trip")

# ✅ 1. 여행지 분석 API (TripModal)
@router.get("/analysis")
def analyze_trip(region_code: str = Query(...), trip_no: int = Query(...)):
    try:
        chart = generate_monthly_chart(region_code)
        pie_top = generate_pie_and_top5(trip_no)
        insight = generate_insight(
            region_code=region_code,
            chart_data=chart,
            piechart=pie_top["piechart"],
            top5=pie_top["top5"]
        )
        return JSONResponse({
            "trip_no": trip_no,
            "chart": chart,
            "piechart": pie_top["piechart"],
            "top5": pie_top["top5"],
            "insight": insight
        })
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSV 파일이 존재하지 않습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ 2. VS 성향 기반 추천 API
@router.post("/agent-recommend")
def agent_recommend_endpoint(input: MultiVSInput):
    return multi_vs_recommend(input)

trip_no_to_tname = {
    1: "GANGNAM",
    2: "JONGNO",
    3: "MAPO",
    4: "SONGPA",
    5: "JUNG",
    6: "YDP",
    7: "YONGSAN",
    8: "SEOCHO",
    9: "GANGSEO",
    10: "NOWON",
    11: "GANGBUK",
    12: "HAEUNDAE",
    13: "JUNGGU",
    14: "YEONGDO",
    15: "DONGNAE",
    16: "SUYEONG",
    17: "SAHA",
    18: "JUNGGU",
    19: "동성로",
    20: "SUSEONG",
    21: "DALSEO",
    22: "JUNGGU",
    23: "YEONSU",
    24: "NAMDONG",
    25: "MICHOHOL",
    26: "GYEYANG",
    27: "DONGGU",
    28: "SEOGU",
    29: "NAMGU",
    30: "BUKGU",
    31: "JUNGGU",
    32: "SEOGU",
    33: "YUSEONG",
    34: "DAEDEOK",
    35: "JUNGGU",
    36: "NAMGU",
    37: "DONGGU",
    38: "BUKGU",
    39: "ULJUGUN",
    40: "GAPYEONG",
    41: "SUWON",
    42: "YONGIN",
    43: "SEONGNAM",
    44: "HWASEONG",
    45: "ANSAN",
    46: "GOYANG",
    47: "ICHEON",
    48: "PAJU",
    49: "BUCHEON",
    50: "CHUNCHEON",
    51: "SOKCHO",
    52: "GANGNEUNG",
    53: "WONJU",
    54: "YANGYANG",
    55: "CHEONGJU",
    56: "CHUNGJU",
    57: "JECHEON",
    58: "CHEONAN",
    59: "GONGJU",
    60: "NONSAN",
    61: "SEOSAN",
    62: "JEONJU",
    63: "GUNSAN",
    64: "NAMWON",
    65: "IKSAN",
    66: "SUNCHEON",
    67: "YEOSU",
    68: "MOKPO",
    69: "NAJU",
    70: "GYEONGJU",
    71: "ANDONG",
    72: "POHANG",
    73: "GYEONGSAN",
    74: "CHANGWON",
    75: "TONGYEONG",
    76: "GEOJE",
    77: "JINJU",
    78: "JEJU",
    79: "SEOGWIPO",
    80: "SEJONG"
}



@router.get("/agent-analysis")
def analyze_trip_by_trip_no(trip_no: int = Query(...)):
    try:
        # ✅ tname 매핑 확인
        if trip_no not in trip_no_to_tname:
            raise HTTPException(status_code=404, detail="해당 trip_no에 대한 tname 없음")

        tname = trip_no_to_tname[trip_no]
        region_code = f"{trip_no}{tname.strip().upper()}"
        file_path = f"csv/{region_code}.csv"

        print("📌 trip_no:", trip_no)
        print("📌 tname:", tname)
        print("📌 region_code:", region_code)
        print("📌 file_path:", file_path)
        

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"분석용 CSV 파일 {file_path} 없음")

        # 👇 분석 로직 실행
        chart = generate_monthly_chart(region_code)
        pie_top = generate_pie_and_top5(trip_no)
        insight = generate_insight(
            region_code=region_code,
            chart_data=chart,
            piechart=pie_top["piechart"],
            top5=pie_top["top5"]
        )

        return JSONResponse({
            "trip_no": trip_no,
            "chart": chart,
            "piechart": pie_top["piechart"],
            "top5": pie_top["top5"],
            "insight": insight
        })

    except FileNotFoundError as e:
        traceback.print_exc()
        raise HTTPException(status_code=404, detail="CSV 파일이 존재하지 않습니다.")
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# # ✅ 4. 추천 요약 문구 API (TripDetailPage에서 사용)
# @router.get("/agent-recommend/summary")
# def recommend_summary(trip_no: int = Query(...)):
#     try:
#         df = pd.read_csv("csv/totaldata.csv")
#         row = df[df["trip_no"] == trip_no]

#         if row.empty:
#             raise HTTPException(status_code=404, detail="해당 trip_no 없음")

#         trip_name = row.iloc[0]["관광지명"]
#         region = row.iloc[0]["광역시/도"]
#         district = row.iloc[0]["시/군/구"]
#         category = row.iloc[0]["중분류 카테고리"]
#         search_volume_raw = row.iloc[0]["검색건수"]
#         try:
#             search_volume = int(str(search_volume_raw).replace(",", ""))
#         except:
#             search_volume = 1000  # 기본값으로 대체

#         summary = generate_trip_summary(
#             trip_name=trip_name,
#             region=region,
#             district=district,
#             category=category,
#             search_volume=search_volume
#         )

#         return JSONResponse({ "summary": summary })
#     except FileNotFoundError:
#         raise HTTPException(status_code=404, detail="CSV 파일이 존재하지 않습니다.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
