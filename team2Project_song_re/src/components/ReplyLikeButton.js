import React, { useEffect, useState } from 'react';

const ReplyLikeButton = ({ replyNo, userNo }) => {
  const [liked, setLiked] = useState(false);     // 좋아요 눌렀는지 여부
  const [likeCount, setLikeCount] = useState(0); // 좋아요 총 개수

  // 처음 로딩될 때 좋아요 상태 및 개수 불러오기
  useEffect(() => {
    const fetchLikeStatus = async () => {
      const res = await fetch(`/reply/like/status?reply_no=${replyNo}&user_no=${userNo}`);
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    };
    fetchLikeStatus();
  }, [replyNo, userNo]);

  // 좋아요 토글 버튼 클릭 시
    const toggleLike = async () => {
    try {
        const res = await fetch(`/reply/like?reply_no=${replyNo}&user_no=${userNo}`, {
        method: 'POST',
        });

        if (!res.ok) {
        const errorText = await res.text();
        console.error("서버 오류 응답:", errorText);
        alert("좋아요 처리 중 오류 발생!");
        return;
        }

        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
    } catch (err) {
        console.error("에러 발생:", err);
        alert("네트워크 오류가 발생했습니다.");
    }
    };

  return (
    <button onClick={toggleLike} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
      {liked ? '❤️' : '🤍'} {likeCount}
    </button>
  );
};

export default ReplyLikeButton;
