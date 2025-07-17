import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getPostListPaged } from '../api/postApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';

import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [originalPosts, setOriginalPosts] = useState([]);     // ← 원본 보관
  const [isTranslating, setIsTranslating] = useState(false);  // ← 번역 중 플래그

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
          axios.post('http://localhost:8000/api/translate', {
            text: post.title, target_language: targetLanguage
          }),
          axios.post('http://localhost:8000/api/translate', {
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



  return (
    <div className="flex w-screen h-[800px] bg-[#f4f5f7]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-64 bg-white p-6 shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#3B3B58]">게시판</h2>

              {/* 글쓰기 */}
              <button
                className="btn mb-2"
                onClick={handleWriteClick}
              >
                글쓰기
              </button>

              <div className="flex gap-4">
                
              <div className="flex justify-center gap-6 mt-4 ml-10">
              {/* 즐겨찾기 */}
              <button
                className="btn-star flex flex-col items-center gap-1 text-sm"
                onClick={handleBookmarkClick}
              >
                <span className="icon w-6 h-6" />
                <span>즐겨찾기</span>
              </button>

              {/* 내 게시글 */}
              <button
                className="btn-post flex flex-col items-center gap-1 text-sm"
                onClick={handleMyPostsClick}
              >
                <span className="icon w-6 h-6" />
                <span>내 게시글</span>
              </button>
              </div>
            </div>          
          <div className="-mx-6 border-t border-gray-300 my-6" />
          <button onClick={() => navigate('/post/list')} 
          className="flex items-center gap-2 mb-2 text-lg text-left">
            <img src="/icon/note.png" alt="자유 게시판" className="w-6 h-6" />자유 게시판</button>
          <button onClick={() => alert('준비 중입니다.')}
          className="flex items-center gap-2 text-lg text-left">
            <img src="/icon/note.png" alt="일정 공유 게시판" className="w-6 h-6" />일정 공유 게시판</button>
        </div>
      </aside>

      {/* ── 본문 ── */}
      <section className="flex-1 flex justify-center items-start mt-10">
        {/* info card */}
        <div className="w-full max-w-[1180px] bg-white p-6 rounded shadow
               flex flex-col justify-between h-[720px]" >
          {/* 제목 + 비번 버튼 */}
            <h2 className="text-3xl font-bold ml-1">자유 게시판</h2>

              {/* ===== 번역 버튼 ===== */}
              <div className="translate-buttons mb-4">
                <button
                  onClick={() => handleTranslate('en')}
                  disabled={isTranslating}
                >
                  {isTranslating ? '번역 중…' : '영어로 번역'}
                </button>
                <button
                  onClick={() => handleTranslate('ja')}
                  disabled={isTranslating}
                >
                  {isTranslating ? '번역 중…' : '일본어로 번역'}
                </button>
                <button onClick={handleResetTranslation}>
                  원래대로
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 my-4">
                {/* 검색 조건 선택창 */}                 
                  <select value={searchType} onChange={(e) => setSearchType(e.target.value)}
                    className="border border-[#DFD3D3] text-sm rounded h-[36px] w-[120px]">
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
        <div className="flex-1 overflow-y-auto mb-0">  
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>작성시간</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.post_no} className={post.notice_yn === 'Y' ? 'top-post' : ''}>
                  <td>{post.notice_yn === 'Y' ? '📌' : post.post_no}</td>
                  <td>
                    <Link to={`/post/read/${post.post_no}`} className="link-btn">
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.name}</td>
                  <td>{new Date(post.created_day).toLocaleDateString()}</td>
                  <td>{post.view_cnt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
          {/* 페이징 영역 */}
          <div className="pagination flex justify-center items-center gap-4 pt-0">
          <button
            className="page-btn"
            onClick={() => navigate(`/post/list?page=${nowPage - 1}&type=${searchType}&keyword=${searchKeyword}`)}
            disabled={nowPage === 1}
          >
            ◀
          </button>
          <span>{nowPage} / {totalPage}</span>
          <button
            className="page-btn"
            onClick={() => navigate(`/post/list?page=${nowPage + 1}&type=${searchType}&keyword=${searchKeyword}`)}
            disabled={nowPage === totalPage}
          >
            ▶
          </button>
            <span>전체 {totalPostCount}건</span>
          </div>  
        </div>
      </section>
    </div>
  );
};

export default PostList;
