// 📁 src/api/replyApi.js

// 댓글 등록
export const createReply = async (replyData) => {
  const res = await fetch('/reply/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(replyData),
  });

  if (!res.ok) {
    throw new Error('댓글 등록 실패');
  }

  return await res.json(); // 성공 시 응답 데이터
};

// (필요 시 추가할 항목)
// - 댓글 수정
// - 댓글 삭제
// - 댓글 단건 조회
