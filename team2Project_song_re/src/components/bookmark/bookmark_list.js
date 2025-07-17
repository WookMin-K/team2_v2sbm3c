// src/components/bookmark/BookmarkListPage.js

import React, { useEffect, useState } from 'react';
import { useLoginContext } from '../../contexts/LoginContext';
import TripModal from '../TripModal';
import './bookmark.css';

const API_BASE = 'http://localhost:9093';

function BookmarkListPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태
  const { loginUser } = useLoginContext();
  const user_no = loginUser?.user_no;

  useEffect(() => {
    if (!user_no) return;
    fetch(`${API_BASE}/bookmark/list_join?user_no=${user_no}`)
      .then(res => res.json())
      .then(data => {
        const bookmarkArray = Array.isArray(data)
          ? data
          : (data.data || data.bookmarks || []);
        console.log('✅ 북마크 목록:', bookmarkArray);
        setBookmarks(bookmarkArray);
      })
      .catch(err => console.error('❌ 북마크 목록 불러오기 실패:', err));
  }, [user_no, loginUser]);

  const handleClick = async (item) => {
    if (item.type === 'trip') {
      try {
        setLoading(true); // ✅ 로딩 시작
        const regionCode = `${item.trip_no}${item.trip_title?.toUpperCase?.() || ''}`;
        const res = await fetch(`http://localhost:8000/trip/analysis?region_code=${regionCode}&region_name=${item.trip_title}&trip_no=${item.trip_no}`);
        const data = await res.json();

        const trip = {
          trip_no: item.trip_no,
          tname: item.trip_title,
          image: item.image || '',
          intro: item.intro || '',
          tnew: item.tnew || '',
          viewcnt: item.viewcnt || 0,
          url_1: item.url_1 || '',
          url_2: item.url_2 || '',
          chart: data.chart,
          insight: data.insight,
          piechart: data.piechart,
          top5: data.top5
        };

        setActiveTrip(trip);
        setShowModal(true);
      } catch (err) {
        console.error('❌ 여행지 분석 데이터 fetch 실패:', err);
        alert('여행지 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false); // ✅ 로딩 끝
      }
    } else if (item.type === 'post') {
      window.location.href = `/post/read/${item.post_no}`;
    }
  };

  // 🔹 여행지 / 게시글 분리 + 필드 존재 여부 필터
  const tripBookmarks = bookmarks.filter(b => b.type === 'trip' && b.trip_no && b.trip_title);
  const postBookmarks = bookmarks.filter(b => b.type === 'post' && b.post_no && b.post_title);


  return (
    <div className="bookmark-container">
      {/* ✅ 로딩 중 오버레이 */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>여행지 데이터를 불러오는 중입니다 ⏳</p>
        </div>
      )}

      <h2 className="bookmark-title">
        ⭐ <strong>{loginUser?.name}</strong> 님의 즐겨찾기 목록
      </h2>

      {/* 여행지 즐겨찾기 */}
      <section>
        <h3 className="bookmark-section-title">📍 여행지</h3>
        {tripBookmarks.length === 0 ? (
          <p className="bookmark-empty">➖ 즐겨찾기한 여행지가 없습니다.</p>
        ) : (
          <ul className="bookmark-list">
        {tripBookmarks.map(item => (
          <li
            key={item.bookmark_no}
            className="bookmark-card"
            onClick={() => handleClick(item)}
          >
            <h3 className="bookmark-title-text">
              {item.trip_title || '제목 없음'}
            </h3>
            <div className="bookmark-meta">
              <span>📌 지역: {item.sname || '미지정'}</span>
              <span>👤 등록자: {item.user_name || '이름 없음'}</span>
            </div>
          </li>
        ))}
          </ul>
        )}
      </section>

      {/* 게시글 즐겨찾기 */}
      <section>
        <h3 className="bookmark-section-title">📝 게시글</h3>
        {postBookmarks.length === 0 ? (
          <p className="bookmark-empty">➖ 즐겨찾기한 게시글이 없습니다.</p>
        ) : (
          <ul className="bookmark-list">
            {postBookmarks.map(item => (
              <li key={item.bookmark_no} className="bookmark-card" onClick={() => handleClick(item)}>
                <h3 className="bookmark-title-text">{item.post_title}</h3>
                <div className="bookmark-meta">
                  <span>📅 작성일: {new Date(item.created_day).toLocaleDateString()}</span>
                  <span>👤 작성자: {item.user_name || '이름 없음'}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 여행지 모달 출력 */}
      {showModal && activeTrip && (
        <TripModal
          trip={activeTrip}
          onClose={() => setShowModal(false)}
          user_no={user_no}
        />
      )}
    </div>
  );
}

export default BookmarkListPage;
