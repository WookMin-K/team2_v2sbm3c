import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';
import MegaMenu from '../components/MegaMenu';
import axios from 'axios';
import './UserListWithPaging.css';
import './MyPage.css';
import prev5Icon from './icon/left2.png';  // src/assets에 두었다면 import
import prev1Icon from './icon/left.png';
import next1Icon from './icon/right.png';
import next5Icon from './icon/right2.png';
import upIcon from '../pages/icon/up.png';

axios.defaults.withCredentials = true;

const UserListWithPaging = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginContext()
  const [userList, setUserList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [searchType, setSearchType] = useState("all");
  const [nowPage, setNowPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const perPage = 10;
  const totalPage = Math.ceil(totalCnt / perPage);
  const isAdmin = loginUser && String(loginUser.grade) === '0';
  const scrollRef = useRef(null);

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

  const jumpToPage = (delta) => {
    let page = nowPage + delta;
    if (page < 1) page = 1;
    if (page > totalPage) page = totalPage;
    navigate(`/mypage/users?page=${page}&type=${searchType}&keyword=${keyword}`);
  };

    // 관리자가 아니면 접근 자체 차단!
  useEffect(() => {
    // 아직 loadedUser 정보가 안 들어온 상태면 아무것도 안함
    if (!loginUser) return;
    const isAdmin = String(loginUser.grade) === '0';
    if (!isAdmin) {
      alert('관리자만 접근 가능한 페이지입니다.');
      navigate('/mypage'); // 원하는 곳으로 보내기
    }
  }, [loginUser, navigate]);

  const handleMenuToggle = () => setMenuOpen(o => !o);

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
        {/* 제목 */}
        <h2 className="text-3xl text-center font-bold mb-4">회원 목록</h2>

        <div className="border-t border-gray-300 my-14" />

        <div className="w-full max-w-5xl mx-auto min-w-[1000px] mt-14">
        {/* 검색창 */}
        <div className="flex justify-center mt-4">
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
            className="border border-[#DFD3D3] text-sm rounded h-[42px] w-[120px]"
          >
            <option value="all">전체</option>
            <option value="id">아이디</option>
            <option value="name">이름</option>
            <option value="email">이메일</option>
          </select>
          <form onSubmit={handleSearch}>
            <div className="bg-white rounded border border-[#DFD3D3] p-2 pr-10 relative ml-2">
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요."
                className="text-sm focus:outline-none"
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

      {/* 목록 */}
      <div className="w-full max-w-5xl mx-auto min-w-[1200px]">
        <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
          {userList.map(user => (
            <div
              key={user.user_no}
              className="flex items-center justify-between py-4 hover:bg-gray-50 transition"
            >
              {/* 왼쪽: 번호 */}
              <div className="w-1/12 text-center text-sm text-gray-500">
                {user.user_no}
              </div>
              {/* 중간: 아이디 */}
              <div className="w-6/12 flex items-center gap-2">
                <span className="text-xl font-medium text-gray-900 truncate">
                  {user.user_id}
                </span>
              </div>
              {/* 오른쪽: 이름, 이메일, 등급, 가입일 등 */}
              <div className="w-2/12 flex flex-col items-end text-sm text-gray-400 mr-10 space-y-1">
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>등급 {user.grade}</span>
                <span>가입 {user.created_at?.split('T')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

        <div className="relative mt-6 mb-8">

          {/* 페이징 */}
          <div className="flex justify-center items-center space-x-2 my-6">
            <button
              className="page-btn"
              onClick={() => jumpToPage(-5)}
              disabled={nowPage === 1}
            >
              <img src={prev5Icon} alt="◀◀" className="w-6 h-6" />
            </button>
            <button
              className="page-btn"
              onClick={() => jumpToPage(-1)}
              disabled={nowPage === 1}
            >
              <img src={prev1Icon} alt="◀" className="w-6 h-6" />
            </button>

            {Array.from({ length: totalPage }, (_, i) => i + 1)
              .slice(0, 15)
              .map(page => (
                <button
                  key={page}
                  onClick={() => navigate(`/mypage/users?page=${page}&type=${searchType}&keyword=${keyword}`)}
                  className={`w-8 h-8 flex items-center justify-center ${
                    page === nowPage
                      ? 'bg-blue-600 text-white rounded-full'
                      : 'text-gray-700 hover:text-white hover:bg-blue-500 rounded-full'
                  }`}
                >
                  {page}
                </button>
              ))
            }

            <button
              className="page-btn"
              onClick={() => jumpToPage(1)}
              disabled={nowPage === totalPage}
            >
              <img src={next1Icon} alt="▶" className="w-6 h-6" />
            </button>
            <button
              className="page-btn"
              onClick={() => jumpToPage(5)}
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