import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';
import MegaMenu from '../components/MegaMenu';

import upIcon from '../pages/icon/up.png';
import './AdminReportList.css';  // 필요시 추가 스타일

axios.defaults.withCredentials = true;

const AdminReportList = () => {
   const [tab, setTab] = useState('post');
   const [reports, setReports] = useState([]);
   const [loading, setLoading] = useState(true);
   const [menuOpen, setMenuOpen] = useState(false);
   const scrollRef = useRef(null);

   const { loginUser } = useLoginContext();
   const navigate = useNavigate();
  const isAdmin = loginUser?.grade === 0;

  // 햄버거 메뉴 열림/닫힘 상태
  const handleMenuToggle = () => setMenuOpen(open => !open);

  // 로그인/관리자 권한 검사
   useEffect(() => {
     if (!loginUser || String(loginUser.grade) !== '0') {
       alert('관리자만 접근 가능합니다.');
       navigate('/mypage');
     }
   }, [loginUser, navigate]);

  // 신고 리스트 가져오는 useEffect
  useEffect(() => {
    setLoading(true);
    const url = tab === 'post' 
      ? '/admin/reports'      // 게시글 신고
      : '/admin/reply_reports';     // 댓글 신고

    axios.get(url, { withCredentials: true })
      .then(res => {
        // 다양한 응답 래핑에 대비
        const data = res.data;
        let list = Array.isArray(data) 
          ? data 
          : Array.isArray(data.reports) 
            ? data.reports 
            : Array.isArray(data.data) 
              ? data.data 
              : [];
        setReports(list);
      })
      .catch(err => {
        console.error('신고 목록 조회 실패', err);
        setReports([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tab]);

  // 조건부 early-return
   if (!loginUser || String(loginUser.grade) !== '0') return null;
   if (loading) return <div className="p-8">로딩 중…</div>;

   // 이후 로직, JSX 반환

  const titleMap = { post: '게시글 신고', reply: '댓글 신고' };


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
          
          <button onClick={() => navigate('/request/list')} className="btn_inquiry btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 문의</span>
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
      <section
        ref={scrollRef}
        className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40"
      >
        {/* 제목 */}
        <h2 className="text-3xl text-center font-bold mb-4">신고 관리</h2>

        <div className="border-t border-gray-300 my-14" />

        {/* 탭 선택 (본문 상단 컨트롤) */}
        <div className="flex justify-center mb-6 space-x-4">
          {['post', 'reply'].map(key => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                px-4 py-1 rounded-lg font-medium
                ${tab === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              {titleMap[key]}
            </button>
          ))}
        </div>


        {/* 리스트 */}
        <div className="w-full max-w-5xl mx-auto min-w-[1000px] mt-14">
          {/* 컬럼 헤더 */}
          <div className="w-full max-w-5xl mx-auto min-w-[1000px]">
            <div className="flex border-b border-gray-300 bg-gray-100 font-semibold text-gray-700 py-3">
              <div className="w-1/12 text-center">NO</div>
              <div className="w-2/12 text-center">{tab === 'post' ? '게시글 번호' : '댓글 번호'}</div>
              <div className="w-2/12 text-center">신고자</div>
              <div className="w-4/12 text-center">신고 사유</div>
              <div className="w-2/12 text-center">접수 날짜</div>
              <div className="w-1/12 text-center">처리 상태</div>
            </div>
          </div>
          <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
            {reports.map(r => (
              <Link
                key={tab === 'post' ? r.report_no : `${r.post_no}-${r.reply_no}`}
                to={
                  tab === 'post'
                    ? `/post/read/${r.post_no}`
                    : `/post/read/${r.post_no}#reply-${r.reply_no}`
                }
                className="flex items-center justify-between py-6 hover:bg-gray-50 transition"
              >
                {/* 신고번호 */}
                <div className="w-1/12 text-center text-sm text-gray-500">
                  {r.report_no}
                </div>
                {/* 대상 번호 */}
                <div className="w-2/12 text-center text-sm text-gray-700">
                  {tab === 'post' ? r.post_no : r.reply_no}
                </div>
                {/* 신고자 */}
                <div className="w-2/12 text-center text-sm text-gray-700">
                  {r.user_no}
                </div>
                {/* 사유 */}
                <div className="w-4/12 text-sm text-gray-900 truncate">
                  {r.reason}
                </div>
                {/* 날짜 */}
                <div className="w-2/12 text-center text-sm text-gray-400">
                  {new Date(r.report_date).toLocaleString()}
                </div>
                {/* 처리 상태 */}
                <div className="w-1/12 text-center text-sm text-gray-700">
                  {r.status === 'N' ? '미처리' : '처리완료'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminReportList;
