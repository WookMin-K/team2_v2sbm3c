import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';
import axios from 'axios';
import './UserListWithPaging.css';
import './MyPage.css';
import prev5Icon from './icon/left2.png';  // src/assets에 두었다면 import
import prev1Icon from './icon/left.png';
import next1Icon from './icon/right.png';
import next5Icon from './icon/right2.png';

axios.defaults.withCredentials = true;
const DEFAULT_PROFILE = '/icon/user2.png';

const UserListWithPaging = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginContext()
  const [userList, setUserList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [nowPage, setNowPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const perPage = 10;
  const totalPage = Math.ceil(totalCnt / perPage);
  const isAdmin = loginUser && String(loginUser.grade) === '0';

  const fetchUserList = useCallback(async () => {
    try {
      const res = await axios.get('/users/list/paging', {
        params: { page: nowPage, size: perPage, keyword }
      });
      if (res.data.status === 'success') {
        setUserList(res.data.data);
        setTotalCnt(res.data.total);
      } else {
        console.warn(res.data.message);
      }
    } catch (err) {
      console.error('목록 불러오기 실패:', err);
    }
  }, [nowPage, keyword]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const handleSearch = e => {
    e.preventDefault();
    setNowPage(1);
    fetchUserList();
  };

  const goPage = pageNum => {
    if (pageNum >= 1 && pageNum <= totalPage) setNowPage(pageNum);
  };

    // ⭐️ 관리자가 아니면 접근 자체 차단!
  useEffect(() => {
    // 아직 loadedUser 정보가 안 들어온 상태면 아무것도 안함
    if (!loginUser) return;
    const isAdmin = String(loginUser.grade) === '0';
    if (!isAdmin) {
      alert('관리자만 접근 가능한 페이지입니다.');
      navigate('/mypage'); // 원하는 곳으로 보내기
    }
  }, [loginUser, navigate]);

  return (
    <div className="flex w-screen h-[800px] bg-[#f4f5f7]">
      {/* ── 왼쪽 사이드바 ── */}
      {/* <aside className="w-64 bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#3B3B58]">마이페이지</h2>
          <img
            src={loginUser?.profileUrl || DEFAULT_PROFILE}
            alt="profile"
            className="w-20 h-20 mx-auto"
          />
          <p className="mt-4 font-semibold text-lg">{loginUser?.name || '---'}</p>
        </div>

        <nav className="mt-6 space-y-4">
          <div className="-mx-6 border-t border-gray-300 my-6" />
          <h3 className="text-xl font-semibold">계정</h3>

          <button onClick={() => navigate('/mypage')} className="flex items-center gap-2 text-lg ml-4">
            <img src="/icon/info.png" alt="내 정보" className="w-6 h-6" />
            내 정보
          </button>

          {isAdmin && (
            <button onClick={() => navigate('/mypage/users')} className="btn-user flex items-center gap-2 text-lg ml-4">
              <span className="icon w-6 h-6" />
              회원 목록
            </button>          
          )}

          {isAdmin && (
            <button onClick={() => navigate('/admin/reports')} className="btn_report flex items-center gap-2 text-lg ml-4">
              <span className="icon w-6 h-6" />
              신고 목록
            </button>
          )}

          <h3 className="text-xl font-semibold">글 관리</h3>
          <button onClick={() => navigate('/mypage/bookmark')} className="btn-star flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            즐겨찾기
          </button>

          <button onClick={() => navigate('/mypage/postlist')} className="btn-post flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            내 게시글
          </button>

          <button onClick={() => navigate('/mypage/mytravel')} className="btn_plane flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            내 여행 일정
          </button>
          
          <button onClick={() => navigate('/request/list')} className="btn_inquiry flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            내 문의
          </button>

        </nav>
      </aside> */}
      
      <section className="flex-1 flex justify-center items-start mt-12">
          <div className="w-full max-w-[1180px] bg-white p-6 rounded shadow flex flex-col relative" style={{ minHeight: '700px' }}>
          <h2 className="text-3xl font-bold mb-4 ml-1">회원 목록</h2>

          <div className="relative w-full max-w-sm mx-auto mb-4">
            <div className="bg-white rounded-md shadow border border-[#e5e0e0] p-2 pr-12">
              <input
                type="text"
                placeholder="아이디, 이름, 이메일 검색"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();      // form 제출 막기
                    handleSearch(e);
                  }
                }}
                className="w-full px-4 py-2 text-sm border border-[#e5e0e0] rounded focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-[14px] p-1"
            >
              <img src="/search_icon.png" alt="검색" className="w-5 h-5" />
            </button>
          </div>

        <div className="table-wrapper flex-1 overflow-y-auto">
          <table className="user-table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>등급</th>
                    <th>가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user, index) => (
                    <tr key={user.user_no}>
                      <td>{totalCnt - (nowPage - 1) * perPage - index}</td>
                      <td>{user.user_id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.grade}</td>
                      <td>{user.created_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <div className="pagination flex items-center gap-4 absolute bottom-4 right-4">
            {/* 현재 페이지 / 전체 페이지 */}
            <span className="page-info">
              {nowPage}
            </span>

            {/* 전체 건수 */}
            <span className="total-count">
              전체 {totalCnt}건
            </span>
            
            {/* 5페이지 앞으로 */}
            <button
              className="page-btn"
              onClick={() => goPage(nowPage - 5, 1)}
              disabled={nowPage <= 1}
            >
              <img src={prev5Icon} alt="◀◀" className="w-6 h-6" />
            </button>

            {/* 1페이지 앞으로 */}
            <button
              className="page-btn"
              onClick={() => goPage(nowPage - 1)}
              disabled={nowPage === 1}
            >
              <img src={prev1Icon} alt="◀" className="w-6 h-6" />
            </button>

            {/* 1페이지 뒤로 */}  
            <button
              className="page-btn"
              onClick={() => goPage(nowPage + 1)}
              disabled={nowPage === totalPage}
            >
              <img src={next1Icon} alt="▶" className="w-6 h-6" />
            </button>

            {/* 5페이지 뒤로 */}
            <button
              className="page-btn"
              onClick={() => goPage(nowPage + 5, totalPage)}
              disabled={nowPage >= totalPage}
            >
              <img src={next5Icon} alt="▶▶" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    </div>  
  );
};

export default UserListWithPaging;