// src/components/MegaMenu.jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';

/**
 * open: boolean — 메뉴 열림/닫힘
 * onClose: () => void — 닫기 핸들러
 */
export default function MegaMenu({ open, onClose }) {
  if (!open) return null

  return ReactDOM.createPortal(
    // 1) 이 outer div 전체가 클릭 시 onClose
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-12 overflow-auto"
      onClick={onClose}
    >
      {/* 2) 백드롭 */}
      <div className="absolute inset-0 bg-[#12345a]/90" />

      {/* 3) 실제 메뉴: 클릭 시 이벤트 전파 차단 */}
      <div
        className="relative w-full max-w-4xl text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* ✕ 버튼 */}
        <button
          className="absolute -top-10 text-4xl text-white"
          style={{ right: '-500px' }}
          onClick={onClose}
        >
          &times;
        </button>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-3 gap-12 mt-60">
          {/* 마이페이지 */}
          <div>
            <h3 className="text-4xl font-semibold mb-6">마이페이지</h3>
            <ul className="space-y-3 text-2xl">
              <li><Link to="/mypage">내 정보</Link></li>
              <li><Link to="/mypage/bookmark">즐겨찾기</Link></li>
              <li><Link to="/mypage/postlist">내 게시글</Link></li>
              <li><Link to="/mypage/mytravel">내 여행 일정</Link></li>
              <li><Link to="/request/list">내 문의</Link></li>
            </ul>
          </div>

          {/* 공지사항 */}
          <div>
            <h3 className="text-4xl font-semibold mb-6">공지사항</h3>
            <ul className="space-y-3 text-2xl">
              <li><Link to="/notice">공지사항</Link></li>
              <li><Link to="/notice">질문 게시판</Link></li>
            </ul>
          </div>

          {/* 게시판 */}
          <div>
            <h3 className="text-4xl font-semibold mb-6">게시판</h3>
            <ul className="space-y-3 text-2xl">
              <li><Link to="/post/list">자유 게시판</Link></li>
              <li><Link to="/post">일정 공유 게시판</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
