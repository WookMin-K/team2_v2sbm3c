import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useLoginContext } from '../../contexts/LoginContext';
import './Notice.css';

import upIcon from './icon/up.png';
import MegaMenu from '../MegaMenu';

const NoticeDetail = () => {
  const { loginUser } = useLoginContext();
  const { notice_no } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);

    // 메뉴 토글
  const handleMenuToggle = () => setMenuOpen(open => !open);
  

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://121.78.128.95:9093/notice/read/${notice_no}`);
        if (!res.ok) throw new Error("공지사항을 불러올 수 없습니다.");
        const data = await res.json();
        setNotice(data.notice);
      } catch (error) {
        console.error('조회 실패:', error.message);
      }
    };

    fetchNotice();
  }, [notice_no]);

  if (!notice) return <div>로딩 중...</div>;

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

      {/* 본문 */}
      <section ref={scrollRef} className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40">
        <div className="notice-content">
          <div className="notice-title">{notice.title}</div>
          <div className="notice-meta">
            작성자: {notice.user_no} | 작성일: {new Date(notice.wdate).toLocaleDateString()} | 조회수: {notice.viewcnt}
          </div>
          <div className="notice-body">{notice.content}</div>

        {/* ✅ 첨부파일 영역 */}
        <div className="notice-files">
          {[1, 2].map((index) => {
            const origin = notice[`origin_name${index}`];
            const saved = notice[`saved_name${index}`];
            const type = notice[`filetype${index}`];
            const size = notice[`filesize${index}`];

            if (!origin || !saved) return null;

            const isImage = type && type.startsWith("image/");
            const fileUrl = `http://121.78.128.95:9093/uploads/notice/${saved}`;

            return (
              <div key={index} className="notice-file-block" style={{ marginBottom: '1rem' }}>
                {isImage ? (
                  <>
                    <img src={fileUrl} alt={origin} style={{ maxWidth: '100%', maxHeight: 300, border: '1px solid #ccc', marginTop: '8px' }} />
                    <div>
                      <div>🖼️ {origin} ({(size / 1024).toFixed(1)}KB)</div>
                      
                    </div>
                  </>
                ) : (
                  <div>
                    📎 <a
                      href={fileUrl}
                      download={origin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {origin} ({(size / 1024).toFixed(1)}KB)
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>


          <div className="buttons">
            {loginUser?.grade === 0 && (
              <>
                <button className="notice-btn" onClick={() => navigate(`/notice/update/${notice.notice_no}`)}>수정</button>
                <button className="notice-btn" onClick={() => navigate(`/notice/delete/${notice.notice_no}`)}>삭제</button>
              </>
            )}
            <button className="notice-btn" onClick={() => navigate('/notice')}>목록</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoticeDetail;
