import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useLoginContext } from '../../contexts/LoginContext';
import './Notice.css';

import prev5Icon from './icon/left2.png';
import prev1Icon from './icon/left.png';
import next1Icon from './icon/right.png';
import next5Icon from './icon/right2.png';
import upIcon from './icon/up.png';
import MegaMenu from '../MegaMenu';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [type, setType] = useState('공지');
  const [nowPage, setNowPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const totalPage = Math.ceil(totalCount / recordPerPage);

  const { boardType } = useParams(); // noticeboard | question
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useLoginContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);

  // 메뉴 토글
  const handleMenuToggle = () => setMenuOpen(open => !open);

  // 글쓰기 이동
  const handleWriteClick = () => navigate('/notice/create');

  // API에 넘길 type 값 매핑
  const boardTypeKor = boardType === 'question' ? '질문' : '공지';
  const displayTitle = boardTypeKor === '공지' ? '공지사항' : '질문게시판';

  const fetchNotices = async (page) => {
    const safePage = Number(page) || 1;

    try {
      const res = await fetch(`http://192.168.12.142:9093/notice/list?type=${type}&now_page=${safePage}`);
      const data = await res.json();
      setNotices(data.list || []);
      setNowPage(data.now_page);
      setTotalCount(data.total);
      setRecordPerPage(data.record_per_page);
    } catch (error) {
      console.error('❌ 공지/질문 목록 불러오기 실패', error);
    }
  };

  // URL 쿼리 변경 시 fetch
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "all";
    const keyword = params.get("keyword") || "";
    const page = parseInt(params.get("page") || "1");

    setSearchType(type);
    setSearchKeyword(keyword);
    setNowPage(page);

    fetchNotices(page, type, keyword);
  }, [location.search]);

  // 페이지 이동 핸들러
  const jumpToPage = (delta) => {
    let page = nowPage + delta;
    if (page < 1) page = 1;
    if (page > totalPage) page = totalPage;
    navigate(`/notice/list?page=${page}&type=${searchType}&keyword=${searchKeyword}`);
  };

  return (
    <div className="flex w-screen h-[807px] bg-[#ffffff]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-24 bg-[#2e3a4e] flex flex-col justify-between items-center pt-4 pb-0 shadow-md">

        <button 
          className="ham_btn mb-2 focus:outline-none"
          onClick={handleMenuToggle}>
          <div className="line" />
          <div className="line" />
          <div className="line" />
        </button>
        <MegaMenu open={menuOpen} onClose={handleMenuToggle} />

        <hr className="w-24 border-gray-600 my-4" />

        <nav className="flex-1 flex flex-col items-center justify-end space-y-6">
          <div className="relative group w-full">
            <button
              onClick={() => navigate('/notice')}
              className="btn_notice btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-8 h-8" />
              <span className="text-white text-sm mt-2">공지사항</span>
            </button>
          </div>
          {/* <button 
            onClick={() => navigate('/notice/question')} 
            className="btn_question btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-8 h-8" />
            <span className="text-white text-sm mt-2 mb-2">질문 게시판</span>
          </button> */}
          <button
            onClick={() => alert('질문 게시판은 준비 중입니다 😊')}
            className="btn_question btn-underline w-full flex flex-col items-center py-2"
          >
            <span className="icon w-8 h-8" />
            <span className="text-white text-sm mt-2 mb-2">질문 게시판</span>
          </button>
        </nav>
        <span className="mb-4"></span>
        <button
          onClick={() => scrollRef.current.scrollTo({ top: 0, behavior: 'smooth'})}
          className="w-full p-6 flex justify-center bg-blue-300 transition-colors group">
          <img src={upIcon} alt="위로가기" 
          className="w-5 h-5 transform transition-transform duration-200 ease-in-out
                     group-hover:-translate-y-1" />
        </button>
      </aside>

      {/* ───────── 오른쪽 본문 ───────── */}
      <section ref={scrollRef} className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40">
        <h2 className="text-3xl text-center font-bold mb-4">공지사항</h2>

        {loginUser?.grade === 0 && (
          <div className="flex justify-end mr-8">
            <button
              className="btn border py-2 px-4 rounded"
              onClick={handleWriteClick}
            >
              글쓰기
            </button>
          </div>
        )}
        <div className="border-t border-gray-300 my-6" />

        {/* ───────── 게시글 리스트 ───────── */}
        <div className="w-full max-w-5xl mx-auto min-w-[1200px] mt-14">
          <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
            {notices.length === 0 ? (
              <div className="py-10 text-center text-gray-500 text-lg">게시물이 없습니다.</div>
            ) : (
              notices.map((notice) => (
                <Link
                  key={notice.notice_no}
                  to={`/notice/${notice.notice_no}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 transition"
                >
                  {/* 번호 */}
                  <div className="w-1/12 text-center text-sm text-gray-500">
                    {notice.notice_no}
                  </div>

                  {/* 제목 */}
                  <div className="w-6/12 flex items-center gap-2">
                    {notice.notice_yn === 'Y' && (
                      <span className="inline-block px-3 py-[2px] text-sm bg-blue-900 text-white rounded-3xl">
                        공지
                      </span>
                    )}
                    <span className="text-xl font-medium text-blue-700 truncate">
                      {notice.title}
                    </span>
                  </div>

                  {/* 날짜/조회/작성자 */}
                  <div className="w-2/12 flex flex-col items-end text-sm text-gray-500 mr-10">
                    <span>{new Date(notice.wdate).toLocaleDateString()}</span>
                    <span>조회수 {notice.viewcnt}</span>
                    <span>{notice.user_name}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>    
        {/* ───────── 페이지네이션 ───────── */}
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

          {Array.from({ length: totalPage }, (_, i) => i + 1).slice(0, 15).map((page) => (
            <button
              key={page}
              onClick={() => navigate(`/notice/list?page=${page}&type=${searchType}&keyword=${searchKeyword}`)}
              className={`w-8 h-8 flex items-center justify-center
                ${page === nowPage
                  ? 'bg-blue-600 text-white rounded-full'
                  : 'text-gray-700 hover:text-white hover:bg-blue-500 rounded-full'}`}
            >
              {page}
            </button>
          ))}

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
      </section>
    </div>
  );
};

export default NoticeList;
