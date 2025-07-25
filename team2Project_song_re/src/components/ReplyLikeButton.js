import React, { useEffect, useState } from 'react';
import { useLoginContext } from '../contexts/LoginContext';
import { useLocation ,useNavigate} from 'react-router-dom';

const ReplyLikeButton = ({ replyNo, userNo }) => {
  const [liked, setLiked] = useState(false);     // 좋아요 눌렀는지 여부
  const [likeCount, setLikeCount] = useState(0); // 좋아요 총 개수
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoginOpen } = useLoginContext();
   const location = useLocation();
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
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다 😊');
      // 로그인 후 돌아올 경로 저장
      sessionStorage.setItem(
        'redirectAfterLogin',
        location.pathname + location.search
      );
      setIsLoginOpen(true);
      return;
    }

    try {
      const res = await fetch(
        `/reply/like?reply_no=${replyNo}&user_no=${userNo}`,
        {
          method: 'POST',
          credentials: 'include',  // ← 세션 쿠키 포함
        }
      );
      if (!res.ok) {
        console.error('좋아요 토글 실패:', res.status);
        return;
      }
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error('좋아요 토글 중 에러:', err);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <button onClick={toggleLike} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
      {liked ? '❤️' : '🤍'} {likeCount}
    </button>
  );
};

export default ReplyLikeButton;
