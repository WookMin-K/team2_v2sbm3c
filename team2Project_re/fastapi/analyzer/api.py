from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd

from analyzer.chart_generator import generate_monthly_chart, generate_pie_and_top5
from analyzer.insight_generator import generate_insight
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
        if trip_no not in trip_no_to_tname:
            raise HTTPException(status_code=404, detail="해당 trip_no에 대한 tname 없음")

        tname = trip_no_to_tname[trip_no]
        region_code = f"{trip_no}{tname.strip().upper()}"
        file_path = f"csv/{region_code}.csv"

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"분석용 CSV 파일 {file_path} 없음")

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
