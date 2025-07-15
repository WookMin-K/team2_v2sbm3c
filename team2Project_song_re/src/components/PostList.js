import React, { useEffect, useState } from 'react';
import { getPostListPaged } from '../api/postApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/post/list?type=${searchType}&keyword=${searchKeyword}`);
  };

  const fetchPosts = async (page, type = "all", keyword = "") => {
    const data = await getPostListPaged(page, type, keyword);
    setPosts(data.list);
    setNowPage(data.now_page);
    setTotalPostCount(data.total);
    setRecordPerPage(data.record_per_page);
  };

  const location = useLocation();

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

  const totalPage = Math.ceil(totalPostCount / recordPerPage);


  return (
    <div className="flex w-screen h-[800px] bg-[#f4f5f7]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-64 bg-white p-6 shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#3B3B58]">게시판</h2>
          <button className="btn mb-2" onClick={() => navigate('/post/create')}>글쓰기</button>
            <div className="flex gap-4">
              <div className="flex justify-center gap-6 mt-4 ml-10">
                {/* 즐겨찾기 버튼 */}
                <button
                  onClick={() => navigate('/mypage/bookmark')}
                  className="btn-star flex flex-col items-center gap-1 text-sm"
                >
                  <span className="icon w-6 h-6" />
                  <span>즐겨찾기</span>
                </button>

                {/* 내 게시글 버튼 */}
                <button
                  onClick={() => navigate('/mypage/posts')}
                  className="btn-post flex flex-col items-center gap-1 text-sm"
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
