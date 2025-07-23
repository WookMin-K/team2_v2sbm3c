// src/components/bookmark/bookmarkbutton_post.js
import React, { useEffect, useState } from 'react';
import { useLoginContext } from '../../contexts/LoginContext';
import './bookmark.css';  // ✅ 공통 스타일

const API_BASE = 'http://192.168.12.142:9093';

function BookmarkPostButton({ post_no }) {
  const { loginUser } = useLoginContext();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [clicked, setClicked] = useState(false); // ✅ 클릭 애니메이션용 상태

  const user_no = loginUser?.user_no;

  useEffect(() => {
    if (!user_no || !post_no) return;
    fetch(`${API_BASE}/bookmark/check_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_no, post_no }),
    })
      .then((res) => res.text())
      .then((count) => setIsBookmarked(parseInt(count) > 0));
  }, [user_no, post_no]);

  const toggleBookmark = () => {
    const url = isBookmarked ? '/bookmark/delete_post' : '/bookmark/create_post';
    fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_no, post_no }),
    })
      .then(() => {
        setIsBookmarked(!isBookmarked);
        setClicked(true);
        setTimeout(() => setClicked(false), 300); // 클릭 애니메이션 리셋
      })
      .catch((err) => console.error('북마크 변경 실패:', err));
  };

  // ✅ 클래스 동적 설정
  const className = `bookmark-button ${isBookmarked ? 'bookmark-active' : 'bookmark-default'} ${clicked ? 'clicked' : ''}`;

  return (
    <button onClick={toggleBookmark} className={className}>
      {isBookmarked ? '⭐ 즐겨찾기 완료' : '☆ 즐겨찾기'}
    </button>
  );
}

export default BookmarkPostButton;
