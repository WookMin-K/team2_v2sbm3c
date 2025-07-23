// src/components/notice/NoticeList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLoginContext } from '../../contexts/LoginContext'; // ✅ 추가
import './Notice.css';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [type, setType] = useState('공지');
  const [nowPage, setNowPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const navigate = useNavigate();
  

  const { loginUser } = useLoginContext(); // ✅ Context에서 직접 loginUser 사용

  const fetchNotices = async (page, selectedType) => {
    const safePage = Number(page) || 1;
    const safeType = selectedType || '공지';

    try {
      const res = await fetch(`http://192.168.12.142:9093/notice/list?type=${safeType}&now_page=${safePage}`);
      const data = await res.json();
      setNotices(data.list || []);
      setNowPage(data.now_page);
      setTotalCount(data.total);
      setRecordPerPage(data.record_per_page);
    } catch (error) {
      console.error('❌ 공지/질문 목록 불러오기 실패', error);
    }
  };

  useEffect(() => {
    const page = Number(nowPage);
    if (!page || isNaN(page)) return;

    fetchNotices(page, type);
  }, [nowPage, type]);

  const totalPage = Math.ceil(totalCount / recordPerPage);

  return (
    <div className="notice-container">
      {/* 사이드바 */}
      <div className="notice-sidebar">
        <h3>📌 안내</h3>

        <hr />
        <ul>
          <li><button className="notice-link" onClick={() => setType('공지')}>공지사항</button></li>
          <li><button className="notice-link" onClick={() => setType('질문')}>질문게시판</button></li>
        </ul>
      </div>

      {/* 본문 */}
      <div className="notice-content">
        {/* 타이틀 + 글쓰기 버튼을 하나의 줄로 정렬 */}
        <div className="notice-header">
          <h2 className="notice-title">
            {type === '공지' ? '공지사항' : '질문게시판'}
          </h2>

          {loginUser?.grade === 0 && (
            <button className="notice-btn-sm" onClick={() => navigate('/notice/create')}>
              글쓰기
            </button>
          )}
        </div>

        <table className="notice-table">
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.notice_no}>
                <td>{notice.notice_no}</td>
                <td>
                  <Link to={`/notice/${notice.notice_no}`} className="notice-link">
                    {notice.title}
                  </Link>
                </td>
                <td>{notice.user_name}</td>
                <td>{new Date(notice.wdate).toLocaleDateString()}</td>
                <td>{notice.viewcnt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이징 */}
        <div className="notice-pagination">
          <button
            className="notice-btn"
            onClick={() => setNowPage(nowPage - 1)}
            disabled={nowPage === 1}
          >
            ◀
          </button>
          <span>{nowPage} / {totalPage}</span>
          <button
            className="notice-btn"
            onClick={() => setNowPage(nowPage + 1)}
            disabled={nowPage === totalPage}
          >
            ▶
          </button>
          <span>전체 {totalCount}건</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeList;
