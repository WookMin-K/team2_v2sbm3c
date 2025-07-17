# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# import os
# from openai import OpenAI
# from dotenv import load_dotenv

# # ✅ .env 로드 (메인에서 했으면 생략 가능하지만 독립성 위해 포함)
# load_dotenv()

# # ✅ OpenAI 클라이언트 초기화
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# client = OpenAI(api_key=OPENAI_API_KEY)

# # ✅ Router 생성
# router = APIRouter(prefix="/api", tags=["Translation"])

# # ✅ Request 모델
# class TranslationRequest(BaseModel):
#     text: str
#     target_language: str

# # ✅ 번역 엔드포인트
# @router.post("/translate")
# async def translate_text(request: TranslationRequest):
#     print(f"✅ 번역 요청: {request.text} -> {request.target_language}")

#     prompt = f"""
# 다음 문장을 {request.target_language}로 자연스럽게 번역해 줘.

# [문장]
# {request.text}

# ✅ 출력 형식:
# 번역된 문장만 출력
# """

#     try:
#         completion = client.chat.completions.create(
#             model="gpt-4o",
#             messages=[
#                 {"role": "system", "content": "너는 번역 전문가야."},
#                 {"role": "user", "content": prompt}
#             ]
#         )

#         translated_text = completion.choices[0].message.content.strip()
#         print("✅ 번역 결과:", translated_text)

#         return {"translated_text": translated_text}

#     except Exception as e:
#         print("❌ 번역 실패:", e)
#         raise HTTPException(status_code=500, detail="번역 실패")
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter(prefix="/api", tags=["Translation"])  # ✅ 반드시 전역 scope!

class TranslationRequest(BaseModel):
    text: str
    target_language: str

@router.post("/translate")
async def translate_text(request: TranslationRequest):
    print(f"✅ 번역 요청: {request.text} -> {request.target_language}")

    prompt = f"""
다음 문장을 {request.target_language}로 자연스럽게 번역해 줘.

[문장]
{request.text}

✅ 출력 형식:
번역된 문장만 출력
"""

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "너는 번역 전문가야."},
                {"role": "user", "content": prompt}
            ]
        )

        translated_text = completion.choices[0].message.content.strip()
        print("✅ 번역 결과:", translated_text)

        return {"translated_text": translated_text}

    except Exception as e:
        print("❌ 번역 실패:", e)
        raise HTTPException(status_code=500, detail="번역 실패")
