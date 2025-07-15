import os
import re
from openai import OpenAI
from typing import List, Dict

# 🔹 OpenAI 클라이언트 초기화
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 🔹 문장 수 계산용
SENTENCE_RE = re.compile(r"[.!?](?:\s|$)")

# 🔹 공통 system 지침 (5 항목·5~7문장)
SYSTEM_MSG = (
    "당신은 통계 및 검색 데이터를 바탕으로 관광지를 분석하고, 방문을 유도할 수 있는 마케팅 문구를 작성하는 전문가입니다.\n"
    "아래 5가지 항목을 빠짐없이 반영한 5~7문장의 한국어 평서문을 작성하세요.\n\n"
    
    "[작성 항목]\n"
    "① 월별 방문객 수를 기반으로 성수기·비수기를 명확히 구분하고, 가장 많은 달과 가장 적은 달의 방문객 수치를 포함하세요.\n"
    "② 사람들이 가장 선호하는 콘텐츠 유형(쇼핑, 교통보다는 자연, 역사, 체험을 중심으로)을 요약하고, 검색 비중이 높았던 키워드 중심으로 서술하세요.\n"
    "③ 대표 명소 2~3곳을 제시하고, 각각의 관심도(검색량, 검색비율 등 수치 기반)가 드러나도록 작성하세요.\n"
    "④ 이 지역을 선호할 가능성이 높은 타겟층(예: 20~30대, 가족, 개인 여행자 등)을 명시하세요.\n"
    "⑤ 타겟층이 이 지역을 방문해야 하는 이유를 감성적으로 표현하고, 마무리는 설득력 있는 문장으로 구성하세요.\n\n"

    "[작성 조건]\n"
    "- 모든 문장은 한국어 평서문으로 작성하세요 (명령문, 감탄문, 질문문 금지).\n"
    "- {region_name}포함한 지명은 반드시 한국어로 작성하세요 (예: JUNG → 중구).\n"
    "- 총 5~7문장으로 구성하고, 번호·불릿·이모티콘·영어·연도·강조표현(*) 등은 사용하지 마세요.\n"
    "- 쇼핑·교통 등 상업적 요소는 언급을 지양하고, 자연·문화·역사·체험 중심 콘텐츠에 집중하세요.\n"
    "- 과장된 표현(예: 최고, 유일무이, 꼭 방문 등)은 금지하며, 데이터 기반 통찰과 감성적 설득을 조화롭게 구성하세요.\n\n"

    "[목표]\n"
    "- 작성된 문장은 관광 플랫폼, 지역 소개 페이지, 키워드 광고 등에서 활용됩니다.\n"
    "- 핵심은 독자가 이 지역을 ‘직접 방문하고 싶게’ 만드는 감성적이면서도 신뢰할 수 있는 설명을 제공하는 것입니다.\n"
)


# ────────────────────────────────────────────────────────────
def generate_insight(
    region_code: str,
    chart_data: List[Dict],
    piechart: List[Dict],
    top5: List[Dict]
) -> str:
    """LLM 기반 관광 분석 문구 생성 (5~7문장)"""

    # 1) 지역명 / 데이터 요약
    region_name = ''.join(filter(str.isalpha, region_code))
    summary = ", ".join([f"{d['month']}월: {d['visitors']:,}명" for d in chart_data])

    main_categories = ", ".join([c['name'] for c in piechart[:2]]) or "정보 없음"
    top_places      = ", ".join([t['name'] for t in top5[:3]])    or "정보 없음"

    # 2) 프롬프트
    prompt = (
        f"[지역명: {region_name}]\n\n"

        f"[제공 데이터]\n"
        f"1. 월별 관광객 수 요약: {summary}\n"
        f"2. 인기 콘텐츠 유형: {main_categories}\n"
        f"3. 대표 명소 예시: {top_places}\n\n"

        f"[작성 요청 사항]\n"
        f"- 위 데이터를 기반으로, SYSTEM 메시지에 제시된 5가지 항목을 **모두 포함**해 주세요.\n"
        f"- {region_name}포함 모든 문장은 꼭 한국어로 작성하세요.\n"
        f"- 총 5~7문장 모두 반드시 한국어 **평서문**으로 자연스럽게 연결하되, 각 항목이 누락되지 않아야 합니다.\n"
        f"- 마지막 문장은 반드시 타겟층이 이 지역을 방문해야 하는 **감성적·설득력 있는 마무리** 문장으로 작성해 주세요.\n"
        f"- 불필요한 수식어·강조표시·영어·연도·이모티콘은 사용하지 마세요.\n"
        f"정보는 반드시 데이터에 근거해야 하며, 과장된 광고 문구나 주관적 감탄은 절대 사용하지 않습니다.\n\n"
    )

    

    # 3) GPT 호출 + 5~7문장 검증
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    try:
        res = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_MSG},
                {"role": "user",   "content": prompt},
            ],
            temperature=0.35,
            top_p=0.85,
            max_tokens=600,
        ).choices[0].message.content.strip()

        if 5 <= len(SENTENCE_RE.findall(res)) <= 7:
            return res
        return "LLM 응답이 형식을 충족하지 못했습니다."

    except Exception as e:
        print(f"[LLM 분석 오류] {e}")
        return f"{region_name}의 관광 트렌드를 분석하는 데 실패했습니다."
