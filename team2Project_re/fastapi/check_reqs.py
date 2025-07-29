# check_reqs.py
import importlib

# 필수 패키지 목록
required = [
    'fastapi',
    'uvicorn',
    'dotenv',            # python-dotenv
    'pydantic',
    'sqlalchemy',
    'openai',
    'langchain_community',
    'chromadb',
]

missing = []
for pkg in required:
    try:
        importlib.import_module(pkg)
    except ImportError:
        missing.append(pkg)

if missing:
    print("❌ 설치가 필요한 패키지:")
    for m in missing:
        # 패키지 이름 보정
        name = {
            'dotenv': 'python-dotenv',
            'langchain_community': 'langchain-community'
        }.get(m, m)
        print(f"  • {name}")
else:
    print("✅ 모든 필수 패키지가 설치되어 있습니다.")
