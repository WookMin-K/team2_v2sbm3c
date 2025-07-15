import React, { useEffect, useState } from 'react';
import {
  createBookmark,
  deleteBookmark,
  checkBookmark,
} from './bookmark';
import '../TripModal.css';

export default function BookmarkButton({ user_no, trip_no, post_no }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [clicked, setClicked] = useState(false);

  // 🎯 숫자 변환 (문자열로 들어올 경우 대비)
  const parsedTripNo = trip_no ? parseInt(trip_no, 10) : null;
  const parsedPostNo = post_no ? parseInt(post_no, 10) : null;

  const isTrip = !!parsedTripNo;
  const targetKey = isTrip ? 'trip_no' : 'post_no';
  const targetValue = isTrip ? parsedTripNo : parsedPostNo;
  const type = isTrip ? 'trip' : 'post';

  // 최초 1회 상태 조회
  useEffect(() => {
    if (!user_no || !targetValue) return;

    checkBookmark({ user_no, [targetKey]: targetValue })
      .then((res) => setBookmarked(res === 1))
      .catch((e) => console.error('✅ 북마크 체크 실패:', e));
  }, [user_no, targetValue]);

  // 북마크 토글 핸들러
  const toggleBookmark = async () => {
    if (!user_no || !targetValue) {
      console.warn('🚫 user_no / 대상 ID 없음', { user_no, targetValue });
      return;
    }

    console.log("📌 전달된 payload:", {
      user_no,
      [targetKey]: targetValue,
      type,
    });

    setClicked(true);
    const payload = { user_no, [targetKey]: targetValue, type };

    try {
      if (bookmarked) {
        await deleteBookmark(payload);
        setBookmarked(false);
      } else {
        await createBookmark(payload);
        setBookmarked(true);
      }
    } catch (err) {
      console.error('❌ 북마크 처리 중 오류:', err);
    } finally {
      setTimeout(() => setClicked(false), 300);
    }
  };

  const className =
    `bookmark-button ${bookmarked ? 'bookmark-active' : 'bookmark-default'}`
    + (clicked ? ' clicked' : '');

  return (
    <button onClick={toggleBookmark} className={className}>
      {bookmarked ? '⭐ 즐겨찾기 완료' : '☆ 즐겨찾기'}
    </button>
  );
}
