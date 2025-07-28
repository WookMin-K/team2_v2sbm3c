// src/pages/MyTravelPage.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import MegaMenu from '../components/MegaMenu';
import upIcon     from '../pages/icon/up.png';
import prev5Icon  from '../pages/icon/left2.png';
import prev1Icon  from '../pages/icon/left.png';
import next1Icon  from '../pages/icon/right.png';
import next5Icon  from '../pages/icon/right2.png';

const PAGE_SIZE = 1; // 한 페이지에 보여줄 '날짜 블록' 수

const MyTravelPage = () => {
  const { loginUser } = useLoginContext();
  const [loadedUser,  setLoadedUser]  = useState(null);
  const navigate      = useNavigate();
  const scrollRef     = useRef(null);

  // 사이드바 햄버거
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle       = () => setMenuOpen(o => !o);

  // 여행 일정 데이터
  const [plans, setPlans]             = useState([]);
  const [loading, setLoading]         = useState(true);

  // 검색 상태
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm,  setSearchTerm]  = useState('');

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 사용자 정보 로드 (관리자 체크용)
  useEffect(() => {
    if (!loginUser?.user_id) return;
    axios.get(`/users/${loginUser.user_id}`)
      .then(res => {
        const data = res.data;
        setLoadedUser({ ...data, profileUrl: data.profileUrl ?? data.profile_url ?? null });
      })
      .catch(() => alert('사용자 정보를 불러올 수 없습니다.'));
  }, [loginUser]);

  const isAdmin = loadedUser?.grade === 0;

  // 여행 일정 가져오기
  useEffect(() => {
    if (!loginUser) return;
    axios.get(`/travel/list/${loginUser.user_no}`)
      .then(res => setPlans(res.data))
      .catch(err => console.error('❌ 여행 일정 가져오기 실패:', err))
      .finally(() => setLoading(false));
  }, [loginUser]);

  // 검색어 기반 필터링
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return plans;
    const term = searchTerm.toLowerCase();
    return plans.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.place.toLowerCase().includes(term)
    );
  }, [plans, searchTerm]);

  // 그룹핑 → 제목별→일별
  const groupedByTitle = useMemo(() => {
    const titleMap = {};
    filtered.forEach(item => {
      titleMap[item.title] = titleMap[item.title] || [];
      titleMap[item.title].push(item);
    });
    return Object.entries(titleMap).map(([title, items]) => {
      const dayMap = {};
      items.forEach(it => {
        dayMap[it.trip_day] = dayMap[it.trip_day] || [];
        dayMap[it.trip_day].push(it);
      });
      const days = Object.entries(dayMap)
        .map(([day, dayItems]) => ({
          day: Number(day),
          items: dayItems.sort((a,b) => new Date(a.start_date) - new Date(b.start_date))
        }))
        .sort((a,b) => a.day - b.day);
      return { title, days };
    });
  }, [filtered]);

  // 페이징 데이터 계산
  const totalPages = Math.ceil(groupedByTitle.length / PAGE_SIZE);
  const pageData   = groupedByTitle.slice(
    (currentPage-1)*PAGE_SIZE,
    currentPage*PAGE_SIZE
  );

  // 검색 폼 제출 핸들러
  const handleSearch = e => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  // 페이지 이동 함수
  const jumpToPage = delta => {
    let p = currentPage + delta;
    if (p < 1)         p = 1;
    if (p > totalPages) p = totalPages;
    setCurrentPage(p);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 렌더링 전 처리
  if (!loginUser) {
    return <div className="text-center mt-20">로그인이 필요합니다.</div>;
  }
  if (loading) {
    return <div className="text-center mt-20">로딩 중...</div>;
  }

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

          <div className="relative group w-full">
           <button onClick={() => navigate('/mypage')} className="btn-underline w-full flex flex-col items-center py-2">
             <img src="/icon/info_white.png" alt="내 정보" className="w-7 h-7" />
             <span className="text-white text-sm mt-2">내 정보</span>
           </button>
          </div>
           {isAdmin && (
            <button onClick={() => navigate('/mypage/users')} className="btn_user btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">회원 목록</span>
            </button>          
          )}

          {isAdmin && (
            <button onClick={() => navigate('/admin/reports')} className="btn_report btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">신고 목록</span>
            </button>
          )}

          <button onClick={() => navigate('/mypage/bookmark')} className="btn-star btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">즐겨찾기</span>
          </button>

          <button onClick={() => navigate('/mypage/postlist')} className="btn-post btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 게시글</span>
          </button>

          <button onClick={() => navigate('/mypage/mytravel')} className="btn_plane btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 여행 일정</span>
          </button>
          
          {/* 관리자는 '문의 목록', 일반 회원은 '내 문의' */}
          <button
            onClick={() => navigate('/request/list')}
            className="btn_inquiry btn-underline w-full flex flex-col items-center py-2"
          >
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">
              {isAdmin ? '문의 목록' : '내 문의'}
            </span>
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
      <section ref={scrollRef} className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40">
        <h2 className="text-3xl text-center font-bold mb-4">내 여행 일정</h2>
        <div className="border-t border-gray-300 my-14"/>

        {plans.length === 0 ? (
          /* 데이터가 없을 때만 본문 메시지 */
          <div className="text-center mt-20">등록된 여행 일정이 없습니다.</div>
        ) : (
        <>
        {/* 검색창 */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="bg-white rounded border border-[#DFD3D3] p-2 pr-10">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="제목 또는 장소 검색..."
                className="outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                <img src="/search_icon.png" alt="검색" className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* 일정 리스트 */}
        <div className="w-full max-w-5xl mx-auto min-w-[1200px] px-6">
          {pageData.map(({ title, days }) => (
            <section key={title} className="mb-8 p-4 border rounded-md">
              <h3 className="text-xl font-bold mb-4">📁 {title}</h3>
              <div className="w-full flex justify-center space-x-6 overflow-x-auto">
                {days.map(({ day, items }) => (
                  <div key={day} className="min-w-[200px] bg-white rounded shadow flex-shrink-0">
                    <h4 className="px-4 py-2 bg-gray-100 font-medium text-center">{day}일차</h4>
                    <ul className="divide-y">
                      {items.map(p => (
                        <li key={p.plan_no} className="flex justify-between px-4 py-2 hover:bg-gray-50">
                          <span>{new Date(p.start_date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                          <span>{p.place}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 페이징 영역 */}
        <div className="flex justify-center items-center space-x-2 my-6">
          <button className="page-btn" onClick={()=>jumpToPage(-5)} disabled={currentPage===1}>
            <img src={prev5Icon} alt="◀◀" className="w-6 h-6"/>
          </button>
          <button className="page-btn" onClick={()=>jumpToPage(-1)} disabled={currentPage===1}>
            <img src={prev1Icon} alt="◀" className="w-6 h-6"/>
          </button>
          {Array.from({length: totalPages},(_,i)=>i+1).slice(0,15).map(page=>(
            <button
              key={page}
              onClick={()=>setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center ${
                page===currentPage
                  ? 'bg-blue-600 text-white rounded-full'
                  : 'text-gray-700 hover:text-white hover:bg-blue-500 rounded-full'
              }`}
            >{page}</button>
          ))}
          <button className="page-btn" onClick={()=>jumpToPage(1)} disabled={currentPage===totalPages}>
            <img src={next1Icon} alt="▶" className="w-6 h-6"/>
          </button>
          <button className="page-btn" onClick={()=>jumpToPage(5)} disabled={currentPage>=totalPages}>
            <img src={next5Icon} alt="▶▶" className="w-6 h-6"/>
          </button>
        </div>
        </>
        )}
      </section>
    </div>
  );
}

export default MyTravelPage;
