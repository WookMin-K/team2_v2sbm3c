import os
from pathlib import Path
from langchain.schema import Document
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# FAISS 인덱스를 저장할 디렉토리
INDEX_DIR = Path("faiss_index")
INDEX_FILE = INDEX_DIR / "index.faiss"

# trAveI FAQ 정의
FAQ_PAIRS = [
    {
        "question": "여행 일정은 어떻게 생성하나요?",
        "answer": "메인에서 'trAveI 시작하기' 또는 '일정 생성' 클릭 → 여행지·날짜 등 정보입력 → 자동 생성됩니다."
    },
    {
        "question": "일정을 저장하려면?",
        "answer": "회원가입 후 로그인 상태에서 생성하고 저장 버튼을 누르면 저장돼요."
    },
    {
        "question": "저장된 일정은 어디서 보나요?",
        "answer": "상단 메뉴 '마이페이지 → 내 일정'에서 확인 가능합니다."
    },
    {
        "question": "PDF로 저장할 수 있나요?",
        "answer": "'내 일정' 화면의 'PDF 저장' 버튼을 누르면 돼요."
    },
    {
        "question": "친구와 공유는?",
        "answer": "일정 상세보기에서 '공유하기' 버튼 클릭 → 링크 복사됩니다."
    },
]


def get_vectorstore() -> FAISS:
    embeddings = OpenAIEmbeddings()

    # 인덱스가 이미 있으면 로드
    if INDEX_FILE.exists():
        return FAISS.load_local(
            str(INDEX_DIR),
            embeddings,
            allow_dangerous_deserialization=True
        )

    # 1) FAQ 문서 생성
    faq_docs = [
        Document(
            page_content=f"Q: {item['question']}\nA: {item['answer']}",
            metadata={"source": "faq"}
        )
        for item in FAQ_PAIRS
    ]

    # 2) 사용자 대화 로그 로드 (옵션)
    history_loader = TextLoader("chat_history.txt", encoding="utf-8")
    history_docs = history_loader.load()

    # 3) 모든 문서 합치기
    all_docs = faq_docs + history_docs

    # 4) 문서 분할
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(all_docs)

    # 5) 빈 인덱스 방지
    if not chunks:
        vs = FAISS.from_texts([""], embeddings)
    else:
        vs = FAISS.from_documents(chunks, embeddings)

    # 6) 디스크에 저장
    vs.save_local(str(INDEX_DIR))
    return vs
