// src/pages/MyPostListPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';
import MegaMenu from '../components/MegaMenu';
import upIcon    from '../pages/icon/up.png';
import prev5Icon from '../pages/icon/left2.png';
import prev1Icon from '../pages/icon/left.png';
import next1Icon from '../pages/icon/right.png';
import next5Icon from '../pages/icon/right2.png';
import { getMyPostListPaged } from '../api/postApi';
import './MyPostListPage.css';

export default function MyPostListPage() {
  const { loginUser, isLoggedIn, setIsLoginOpen } = useLoginContext();
  const [loadedUser, setLoadedUser] = useState(null);

  const navigate  = useNavigate();
  const location  = useLocation();
  const scrollRef = useRef(null);

  // ── 사이드바 열기/닫기
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen(open => !open);

  // ── 게시글 상태
  const [posts,         setPosts]         = useState([]);
  const [nowPage,       setNowPage]       = useState(1);
  const [totalCount,    setTotalCount]    = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);

  // ── 검색 상태
  const [searchType,    setSearchType]    = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 로그인 유저 정보 가져오기 (grade 체크용)
  useEffect(() => {
    if (!loginUser?.user_id) return;
    axios.get(`/users/${loginUser.user_id}`)
      .then(res => setLoadedUser(res.data))
      .catch(() => alert('사용자 정보를 불러올 수 없습니다.'));
  }, [loginUser]);

  const isAdmin = loadedUser?.grade === 0;

  // ── 마운트 시 기본 1페이지 데이터 로딩
  useEffect(() => {
    getMyPostListPaged(1, 'all', '')
      .then(data => {
        setPosts(data.list);
        setTotalCount(data.total);
        setRecordPerPage(data.record_per_page);
      })
      .catch(console.error);
    // URL 에 쿼리스트링이 없다면 기본값 셋팅
    if (!location.search) {
      navigate('/mypage/postlist?page=1&type=all&keyword=');
    }
  }, []); // 빈 deps → 마운트 때만

  // ── URL 바뀔 때마다 데이터 다시 불러오기
  useEffect(() => {
    const params       = new URLSearchParams(location.search);
    const typeParam    = params.get('type')    || 'all';
    const keywordParam = params.get('keyword') || '';
    const pageParam    = parseInt(params.get('page') || '1', 10);

    setSearchType(typeParam);
    setSearchKeyword(keywordParam);
    setNowPage(pageParam);

    getMyPostListPaged(pageParam, typeParam, keywordParam)
      .then(data => {
        setPosts(data.list);
        setTotalCount(data.total);
        setRecordPerPage(data.record_per_page);
      })
      .catch(console.error);
  }, [location.search]);

  const totalPages = Math.ceil(totalCount / recordPerPage);

  // ── 검색 폼 제출
  const handleSearch = e => {
    e.preventDefault();
    navigate(`/mypage/postlist?page=1&type=${searchType}&keyword=${searchKeyword}`);
  };

  // 글쓰기 버튼 눌렀을 때
  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate('/post/create');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/post/create');
      setIsLoginOpen(true);
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

  // ── 페이징 이동
  const jumpToPage = delta => {
    let p = nowPage + delta;
    if (p < 1)          p = 1;
    if (p > totalPages) p = totalPages;
    navigate(`/mypage/postlist?page=${p}&type=${searchType}&keyword=${searchKeyword}`);
  };

  // ── 스크롤 탑 버튼 토글
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 0);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

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
      <section ref={scrollRef} className="overflow-y-auto flex-1 mt-16 pb-40">
        <h2 className="text-3xl text-center font-bold mb-4">내 게시글</h2>

        {/* 글쓰기 버튼 */}
        <div className="flex justify-end mr-8 mb-4">
          <button className="btn border py-2 px-4 rounded" onClick={handleWriteClick}>
            글쓰기
          </button>
        </div>
        <div className="border-t border-gray-300 my-6"/>

        {/* 검색폼 */}
        <div className="flex justify-center mb-6 space-x-4 px-6">
          <select
            value={searchType}
            onChange={e=>setSearchType(e.target.value)}
            className="border text-sm rounded h-[42px] w-[120px]"
          >
            <option value="all">제목 + 내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <form onSubmit={handleSearch} className="relative">
            <div className="bg-white rounded border p-2 pr-10">
              <input
                type="text"
                value={searchKeyword}
                onChange={e=>setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요."
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                <img src="/search_icon.png" alt="검색" className="w-5 h-5"/>
              </button>
            </div>
          </form>
        </div>

        {/* 게시글 테이블 */}
        <div className="w-full max-w-5xl mx-auto min-w-[1200px] px-6 overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="px-2 py-1">No</th>
                <th className="px-2 py-1">제목</th>
                <th className="px-2 py-1">작성시간</th>
                <th className="px-2 py-1">작성자</th>
                <th className="px-2 py-1">조회수</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.post_no} className="hover:bg-gray-50">
                  <td className="px-2 py-1">{post.post_no}</td>
                  <td className="px-2 py-1">
                    <Link to={`/post/read/${post.post_no}`} className="text-blue-600 hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-2 py-1">{new Date(post.created_day).toLocaleDateString()}</td>
                  <td className="px-2 py-1">{post.name}</td>
                  <td className="px-2 py-1">{post.view_cnt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="flex justify-center items-center space-x-2 my-6">
          <button className="page-btn" onClick={()=>jumpToPage(-5)} disabled={nowPage===1}>
            <img src={prev5Icon} alt="◀◀" className="w-6 h-6"/>
          </button>
          <button className="page-btn" onClick={()=>jumpToPage(-1)} disabled={nowPage===1}>
            <img src={prev1Icon} alt="◀" className="w-6 h-6"/>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 15)
            .map(page => (
              <button
                key={page}
                onClick={()=>navigate(`/mypage/postlist?page=${page}&type=${searchType}&keyword=${searchKeyword}`)}
                className={`w-8 h-8 flex items-center justify-center ${
                  page===nowPage
                    ? 'bg-blue-600 text-white rounded-full'
                    : 'text-gray-700 hover:text-white hover:bg-blue-500 rounded-full'
                }`}
              >
                {page}
              </button>
          ))}
          <button className="page-btn" onClick={()=>jumpToPage(1)} disabled={nowPage===totalPages}>
            <img src={next1Icon} alt="▶" className="w-6 h-6"/>
          </button>
          <button className="page-btn" onClick={()=>jumpToPage(5)} disabled={nowPage>=totalPages}>
            <img src={next5Icon} alt="▶▶" className="w-6 h-6"/>
          </button>
        </div>
      </section>
    </div>
  );
}
