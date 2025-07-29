import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getPostListPaged } from '../api/postApi';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';
import prev5Icon from '../pages/icon/left2.png';
import prev1Icon from '../pages/icon/left.png';
import next1Icon from '../pages/icon/right.png';
import next5Icon from '../pages/icon/right2.png';
import './PostList.css';
import upIcon from '../pages/icon/up.png';
import MegaMenu from '../components/MegaMenu';

const RECORDS_PER_PAGE = 10;    // 한 페이지에 보여줄 게시글 수
const PAGES_PER_GROUP = 5;     // 페이지 버튼 묶음 크기

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(5);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [originalPosts, setOriginalPosts] = useState([]);     // ← 원본 보관
  const [isTranslating, setIsTranslating] = useState(false);  // ← 번역 중 플래그

  // 햄버거 메뉴 열림/닫힘 상태
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen(open => !open);

  // 본문 스크롤 감지용 ref
  const scrollRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, setIsLoginOpen } = useLoginContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/post/list?type=${searchType}&keyword=${searchKeyword}`);
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


  const fetchPosts = async (page, type = "all", keyword = "") => {
    const data = await getPostListPaged(page, type, keyword);
    // ① 원본 저장
    setOriginalPosts(data.list);

    // ② LocalStorage에 남은 번역 결과 있으면 덮어쓰기
    const map = JSON.parse(localStorage.getItem('translatedPosts') || '{}');

    const applied = data.list.map(post =>
      map[post.post_no]
        ? { ...post,
            title:   map[post.post_no].title,
            content: map[post.post_no].content }
        : post
    );
    setPosts(applied);
    setNowPage(data.now_page);
    setTotalPostCount(data.total);
    setRecordPerPage(data.record_per_page);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "all";
    const keyword = params.get("keyword") || "";
    const page = parseInt(params.get("page") || "1");

    setSearchType(type);
    setSearchKeyword(keyword);
    setNowPage(page);

    fetchPosts(page, type, keyword);
  }, [location.search]);

  // ③ 번역 버튼 핸들러
  const handleTranslate = async (targetLanguage) => {
    if (isTranslating) return;
    setIsTranslating(true);

    try {
      const translated = await Promise.all(posts.map(async post => {
        const [{ data: tRes }, { data: cRes }] = await Promise.all([
          axios.post('http://192.168.12.142:8000/api/translate', {
            text: post.title, target_language: targetLanguage
          }),
          axios.post('http://192.168.12.142:8000/api/translate', {
            text: post.content, target_language: targetLanguage
          }),
        ]);
        return {
          ...post,
          title:   tRes.translated_text,
          content: cRes.translated_text,
        };
      }));

      setPosts(translated);

      // LocalStorage에 번역 저장
      const newMap = {};
      translated.forEach(p => {
        newMap[p.post_no] = { title: p.title, content: p.content };
      });
      localStorage.setItem('translatedPosts', JSON.stringify(newMap));

    } catch (err) {
      console.error(err);
      alert('번역 중 오류가 발생했습니다.');
    } finally {
      setIsTranslating(false);
    }
  };

  // ④ “원래대로” 버튼 핸들러
  const handleResetTranslation = () => {
    setPosts(originalPosts);
    localStorage.removeItem('translatedPosts');
  };


  const totalPage = Math.ceil(totalPostCount / recordPerPage);
  const groupIndex = Math.floor((nowPage - 1) / PAGES_PER_GROUP);
  const startPage = groupIndex * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPage);
  const prevGroupPage = startPage - PAGES_PER_GROUP;
  const nextGroupPage = startPage + PAGES_PER_GROUP;
  // 🚀 변경된 페이지네이션 로직 끝

  const goToPage = page => {
    // 목표 페이지가 1 미만이면 1로, totalPage 초과하면 totalPage로
    const p = Math.max(1, Math.min(page, totalPage));
    navigate(`/post/list?page=${p}&type=${searchType}&keyword=${searchKeyword}`);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 본문 스크롤 감지
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setShowTop(el.scrollTop > 0);
    };
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
      <section ref={scrollRef} className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40">
        {/* 제목 */}
        <h2 className="text-3xl text-center font-bold mb-4">자유 게시판</h2>
                  {/* 글쓰기 버튼 */}
          <div className="flex justify-end mr-8">
            <button
              className="btn border py-2 px-4 rounded"
              onClick={handleWriteClick}
            >
              글쓰기
            </button>
          </div>
        <div className="border-t border-gray-300 my-6 "/>

        {/* 상단 컨트롤 */}
        <div className="flex flex-col w-full mb-6 space-y-4">

            {/* ===== 번역 버튼 (스타일 업그레이드) ===== */}
            <div className="flex justify-end mr-8 space-x-2">
              <button
                onClick={() => handleTranslate('en')}
                disabled={isTranslating}
                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isTranslating ? 'Translating…' : 'ENG'}
              </button>

              <button
                onClick={() => handleTranslate('ja')}
                disabled={isTranslating}
                className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isTranslating ? '翻訳中…' : '日本語'}
              </button>

              <button
                onClick={handleResetTranslation}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-300 transition"
              >
                한국어
              </button>
            </div>

          <div className="flex justify-center mt-4">
            {/* 검색 조건 선택창 */}                 
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}
              className="border border-[#DFD3D3] text-sm rounded h-[42px] w-[120px]">
              <option value="all">제목 + 내용</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
            <form onSubmit={handleSearch}>
              <div className="bg-white rounded border border-[#DFD3D3] p-2 pr-10 relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="검색어를 입력하세요."
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
        </div>

        <div className="w-full max-w-5xl mx-auto min-w-[1200px]">
          <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
            {posts.map((post) => (
              <Link
                key={post.post_no}
                to={`/post/read/${post.post_no}`}
                state={{ fromSearch: location.search }}
                className="flex items-center justify-between py-4 hover:bg-gray-50 transition"
              >
                {/* 왼쪽: 번호 + 공지 뱃지 */}
                <div className="w-1/12 text-center text-sm text-gray-500">
                    {post.post_no}
                </div>

                {/* 가운데: 제목 + 작성자 */}
                <div className="w-6/12 flex items-center gap-2">
                  {post.notice_yn === 'Y' && (
                    <span className="inline-block px-3 py-[4px] text-sm bg-blue-900 text-white rounded-3xl mr-1">
                      공지
                    </span>
                  )}
                  <span className="text-xl font-medium text-gray-900 truncate">
                    {post.title}
                  </span>
                </div>

                {/* 오른쪽: 작성일 + 조회수 */}
                <div className="w-2/12 flex flex-col items-end text-sm text-gray-400 mr-10">
                  <span>{new Date(post.created_day).toLocaleDateString()}</span>
                  <span>조회수 {post.view_cnt}</span>
                  <span className="text-sm text-gray-500">{post.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative mt-6 mb-8">

          {/* 페이징 영역 */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          {/* 이전 그룹: 1~5 구간에선 1페이지로 이동 */}
          <button
            onClick={() => goToPage(prevGroupPage < 1 ? 1 : prevGroupPage)}
            disabled={nowPage === 1}
            className="p-2"
          >
            <img src={prev5Icon} alt="«" className="page-btn" />
          </button>

          {/* 이전 페이지 */}
          <button
            onClick={() => goToPage(nowPage - 1)}
            disabled={nowPage === 1}
            className="p-2"
          >
            <img src={prev1Icon} alt="‹" className="page-btn" />
          </button>

          {/* 페이지 번호 버튼 */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                page === nowPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          {/* 다음 페이지 */}
          <button
            onClick={() => goToPage(nowPage + 1)}
            disabled={nowPage === totalPage}
            className="p-2"
          >
            <img src={next1Icon} alt="›" className="page-btn" />
          </button>

          {/* 다음 그룹 */}
          <button
            onClick={() => goToPage(nextGroupPage > totalPage ? totalPage : nextGroupPage)}
            disabled={nowPage === totalPage}
            className="p-2"
          >
            <img src={next5Icon} alt="»" className="page-btn" />
          </button>
          </div>
        </div>
      </section>
    </div>  
  );
};

export default PostList;
