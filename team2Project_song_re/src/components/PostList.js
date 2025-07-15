import React, { useEffect, useState } from 'react';
import { getPostListPaged } from '../api/postApi';
import { useNavigate, Link } from 'react-router-dom';
import LoginModal from '../pages/Login';
import './PostList.css';
import { useLoginContext } from '../contexts/LoginContext'; // ✅ Context 불러오기

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);

  const navigate = useNavigate();
  const {
    isLoggedIn,
    userName,
    login,
    logout,
    isLoginOpen,
    setIsLoginOpen
  } = useLoginContext();

  // 게시글 목록 불러오기
  const fetchPosts = async (page) => {
    const data = await getPostListPaged(page);
    setPosts(data.list);
    setNowPage(data.now_page);
    setTotalPostCount(data.total);
    setRecordPerPage(data.record_per_page);
  };

  useEffect(() => {
    fetchPosts(nowPage);
  }, [nowPage]);

  // 로그인 성공 시 처리
  const handleLoginSuccess = (name) => {
    login(name); // ✅ Context 기반 로그인 처리

    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl);
    } else {
      window.location.reload(); // 기본 새로고침
    }
  };

  // 글쓰기 클릭 시 로그인 여부 확인
  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate('/post/create');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/post/create');
      setIsLoginOpen(true);
    }
  };

  const totalPage = Math.ceil(totalPostCount / recordPerPage);

  return (
    <div className="container">
      {/* 사이드바 */}
      <div className="sidebar">
        <h3>게시판</h3>
        <button className="btn" onClick={handleWriteClick}>글쓰기</button>
        <hr />
        <ul>
          <li>
            <button className="link-btn" onClick={() => navigate('/post/list')}>
              자유 게시판
            </button>
          </li>
          <li>
            <button className="link-btn" onClick={() => alert('준비 중입니다.')}>일정 공유 게시판</button>
          </li>
        </ul>
      </div>

      {/* 게시글 목록 */}
      <div className="content">
        <div className="board-header">
          <h2>자유 게시판</h2>
        </div>

        <table>
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

        {/* 페이징 */}
        <div className="pagination">
          <button className="page-btn" onClick={() => setNowPage(nowPage - 1)} disabled={nowPage === 1}>◀</button>
          <span>{nowPage} / {totalPage}</span>
          <button className="page-btn" onClick={() => setNowPage(nowPage + 1)} disabled={nowPage === totalPage}>▶</button>
          <span>전체 {totalPostCount}건</span>
        </div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={() => {
          setIsLoginOpen(false);
          navigate('/users/signup');
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default PostList;
