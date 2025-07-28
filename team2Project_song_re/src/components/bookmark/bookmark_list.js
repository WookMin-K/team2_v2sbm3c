// src/components/bookmark/BookmarkListPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useLoginContext } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import MegaMenu from '../MegaMenu';
import TripModal from '../TripModal';
import './bookmark.css';
import prev5Icon from '../../pages/icon/left2.png';
import prev1Icon from '../../pages/icon/left.png';
import next1Icon from '../../pages/icon/right.png';
import next5Icon from '../../pages/icon/right2.png';
import upIcon from '../../pages/icon/up.png';

const API_BASE = 'http://192.168.12.142:9093';
const PAGE_SIZE = 5;

export default function BookmarkListPage() {
  const { loginUser, isLoggedIn, setIsLoginOpen } = useLoginContext();
  const navigate      = useNavigate();
  const scrollRef     = useRef(null);

  const [bookmarks,  setBookmarks]  = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [nowPage,    setNowPage]    = useState(1);
  const [activeTrip, setActiveTrip] = useState(null);
  const [showModal,  setShowModal]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle       = () => setMenuOpen(o => !o);

  const user_no = loginUser?.user_no;

  // 1) API에서 북마크 불러오기
  useEffect(() => {
    if (!user_no) return;
    fetch(`${API_BASE}/bookmark/list_join?user_no=${user_no}`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data)
          ? data
          : data.data || data.bookmarks || [];
        console.log('API → bookmarks:', list);
        setBookmarks(list);
      })
      .catch(console.error);
  }, [user_no]);

  // 2) trip / post 분리
  const tripBookmarks = bookmarks.filter(b => b.type==='trip' && b.trip_no && b.trip_title);
  const postBookmarks = bookmarks.filter(b => b.type==='post' && b.post_no && b.post_title);

  // 3) 페이징 로직
  const allList    = filter==='all'
    ? [...tripBookmarks, ...postBookmarks]
    : filter==='trip'
      ? tripBookmarks
      : postBookmarks;
  const totalPages = Math.ceil(allList.length / PAGE_SIZE);
  const pageList   = allList.slice((nowPage-1)*PAGE_SIZE, nowPage*PAGE_SIZE);

  // 4) 페이지 이동
  const jumpToPage = delta => {
    let p = nowPage + delta;
    if (p < 1)           p = 1;
    if (p > totalPages)  p = totalPages;
    setNowPage(p);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5) 아이템 클릭
  const handleClick = async (item) => {
    if (item.type === 'trip') {
      try {
        setLoading(true); // ✅ 로딩 시작
        const regionCode = `${item.trip_no}${item.trip_title?.toUpperCase?.() || ''}`;
        const res = await fetch(`http://192.168.12.142:8000/trip/analysis?region_code=${regionCode}&region_name=${item.trip_title}&trip_no=${item.trip_no}`);
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

  // 즐겨찾기
  const handleBookmarkClick = () => {
    if (isLoggedIn) {
      navigate('/mypage/bookmark');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/mypage/bookmark');
      setIsLoginOpen(true);
    }
  };

  // 내 게시글
  const handleMyPostsClick = () => {
    if (isLoggedIn) {
      navigate('/mypage/postlist');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/mypage/postlist');
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="flex w-screen h-[807px] bg-[#ffffff]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-24 bg-[#2e3a4e] flex flex-col justify-between items-center pt-4 pb-0 shadow-md">

        <button
          className="ham_btn mb-4 focus:outline-none"
          onClick={handleMenuToggle}>
          <div className="line" />
          <div className="line" />
          <div className="line" />  
        </button>
        <MegaMenu open={menuOpen} onClose={handleMenuToggle} />
        
        <hr className="w-24 border-gray-600 mb-4" />

        <nav className="flex-1 flex flex-col items-center justify-end space-y-6">
          {/* 즐겨찾기 */}
          <div className="relative group w-full">
            <button
              onClick={handleBookmarkClick} 
              className="btn-star btn-underline w-full flex flex-col items-center py-2" >
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">즐겨찾기</span>
            </button>
          </div>
          {/* 내 게시글 */}
          <button 
            onClick={handleMyPostsClick}
            className="btn-post btn-underline w-full flex flex-col items-center py-2" >
            <span className="icon w-8 h-8" />
            <span className="text-white text-sm mt-2">내 게시글</span>
          </button>
        
          <button 
            onClick={() => navigate('/post/list')} 
            className="btn-underline w-full flex flex-col items-center py-2">
            <img src="/icon/note_white.png" alt="자유 게시판" className="w-7 h-7" />
            <span className="text-white text-sm mt-2">자유 게시판</span>
          </button>

          <button onClick={() => alert('준비 중입니다.')}
            className="btn-underline w-full flex flex-col items-center py-2">
            <img src="/icon/note_white.png" alt="일정 공유 게시판" className="w-7 h-7" />
            <span className="text-white text-sm mt-2">일정 공유</span>
            <span className="text-white text-sm">게시판</span>
          </button>
          <span className="mb-2"></span>
        </nav>
        <button
          onClick={() => scrollRef.current.scrollTo({ top: 0, behavior: 'smooth'})}
          className="w-full p-6 flex justify-center bg-blue-300 transition-colors group">
          <img src={upIcon} alt="위로가기" 
          className="w-5 h-5 transform transition-transform duration-200 ease-in-out
                     group-hover:-translate-y-1" />
        </button>
      </aside>
      {/* ── 본문 ── */}
      <section ref={scrollRef} className="overflow-y-auto flex-1 mt-16 px-6 pb-40">
        <h2 className="text-3xl text-center font-bold mb-14">즐겨찾기</h2>

        <div className="border-t border-gray-300 my-6 "/>

        {/* 필터 버튼 */}
        <div className="flex justify-center mb-6 space-x-4">
          {['all','trip','post'].map(key => (
            <button
              key={key}
              onClick={() => { setFilter(key); setNowPage(1); }}
              className={`px-4 py-1 rounded-lg border font-medium ${
                filter===key
                  ? 'bg-[#bfd6eb] text-black'
                  : 'bg-[#F4F5F7] text-gray-700 hover:bg-[#bfd6eb]'
              }`}
            >
              {key==='all' ? '전체' : key==='trip' ? '여행지' : '게시글'}
            </button>
          ))}
        </div>

        {/* 리스트 */}
        <div className="w-full max-w-5xl mx-auto min-w-[1200px]">
          <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
            {pageList.length === 0
              ? <li className="py-6 text-center text-gray-500">
                  ➖ 표시할 항목이 없습니다.
                </li>
              : pageList.map((item, idx) => (
                <li
                  key={item.bookmark_no}
                  className="flex items-center justify-between py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <div className="w-1/12 text-center text-sm text-gray-500">
                    {(nowPage-1)*PAGE_SIZE + idx + 1}
                  </div>
                  <div className="w-6/12 flex items-center gap-2">
                    <span className={`px-3 py-[4px] rounded-3xl ${
                      item.type==='trip' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {item.type==='trip' ? '📍' : '📝'}
                    </span>
                    <span className="text-lg font-medium truncate">
                      {item.type==='trip' ? item.trip_title : item.post_title}
                    </span>
                  </div>
                  <div className="w-2/12 flex flex-col items-end text-sm text-gray-700">
                    {item.type==='trip' ? (
                      <>
                        <span>지역: {item.sname}</span>
                        <span>등록: {item.created_at?.split('T')[0]}</span>
                      </>
                    ) : (
                      <>
                        <span>게시일: {item.created_day?.split('T')[0]}</span>
                        <span>조회수: {item.view_cnt}</span>
                      </>
                    )}
                  </div>
                </li>
              ))
            }
          </div>  
        </div>

        {/* 페이징 영역 */}
        <div className="flex justify-center items-center space-x-2 my-6">
          <button className="page-btn" onClick={() => jumpToPage(-5)} disabled={nowPage===1}>
            <img src={prev5Icon} alt="◀◀" className="w-6 h-6"/>
          </button>
          <button className="page-btn" onClick={() => jumpToPage(-1)} disabled={nowPage===1}>
            <img src={prev1Icon} alt="◀" className="w-6 h-6"/>
          </button>
          {Array.from({length: totalPages}, (_,i)=>i+1)
            .slice(0,15)
            .map(page => (
              <button
                key={page}
                onClick={()=>setNowPage(page)}
                className={`w-8 h-8 flex items-center justify-center ${
                  page===nowPage
                    ? 'bg-blue-600 text-white rounded-full'
                    : 'text-gray-700 hover:text-white hover:bg-blue-500 rounded-full'
                }`}
              >{page}</button>
          ))}
          <button className="page-btn" onClick={() => jumpToPage(1)}    disabled={nowPage===totalPages}>
            <img src={next1Icon} alt="▶" className="w-6 h-6"/>
          </button>
          <button className="page-btn" onClick={() => jumpToPage(5)}    disabled={nowPage>=totalPages}>
            <img src={next5Icon} alt="▶▶" className="w-6 h-6"/>
          </button>
        </div>

        {/* TripModal */}
        {showModal && activeTrip && (
          <TripModal trip={activeTrip} onClose={()=>setShowModal(false)} user_no={user_no}/>
        )}
      </section>
    </div>
  );
}
