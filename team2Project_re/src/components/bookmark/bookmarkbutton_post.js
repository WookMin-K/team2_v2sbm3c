// src/components/bookmark/bookmarkbutton_post.js
import React, { useEffect, useState } from 'react';
import { useLoginContext } from '../../contexts/LoginContext';

// 아이콘 경로만 맞춰서 import
import filledStar from '../../pages/icon/star.png';       // ⭐ 채워진 별
import outlineStar from '../../pages/icon/star_line.png'; // ☆ 테두리 별

const API_BASE = 'http://192.168.12.142:9093';

export default function BookmarkPostButton({
  post_no,
  onClickCallback, // 메뉴 닫을 때 호출
}) {
  const { loginUser } = useLoginContext();
  const user_no = loginUser?.user_no;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [clicked, setClicked] = useState(false);

  // 1) 초기 중복 체크
  useEffect(() => {
    if (!user_no || !post_no) return;
    fetch(`${API_BASE}/bookmark/check_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_no, post_no }),
    })
      .then(r => r.text())
      .then(cnt => setIsBookmarked(parseInt(cnt) > 0))
      .catch(console.error);
  }, [user_no, post_no]);

  // 2) 토글
  const toggleBookmark = () => {
    const url = isBookmarked
      ? '/bookmark/delete_post'
      : '/bookmark/create_post';

    fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_no, post_no }),
    })
      .then(() => {
        setIsBookmarked(b => !b);
        setClicked(true);
        onClickCallback?.();             // 메뉴 닫기 콜백
        setTimeout(() => setClicked(false), 300);
      })
      .catch(console.error);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center w-full px-4 py-2 text-sm text-gray-700
                  hover:bg-gray-100 ${clicked ? 'clicked' : ''}`}
    >
      <img
        src={isBookmarked ? filledStar : outlineStar}
        alt="bookmark icon"
        className="w-4 h-4 mr-2"
      />
      {isBookmarked ? '해제' : '즐겨찾기'}
    </button>
  );
}
