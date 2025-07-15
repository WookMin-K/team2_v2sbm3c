import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoginContext } from '../../contexts/LoginContext';
import './Notice.css';

const NoticeDetail = () => {
  const { loginUser } = useLoginContext();
  const { notice_no } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://localhost:9093/notice/read/${notice_no}`);
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
    <div className="notice-container">
      {/* 사이드바 */}
      <div className="notice-sidebar">
        <h3>📢 공지사항</h3>
        <ul>
          <li><button className="notice-link" onClick={() => navigate('/notice')}>공지사항 목록</button></li>
        </ul>
      </div>

      {/* 본문 */}
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
          const fileUrl = `http://localhost:9093/uploads/notice/${saved}`;

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
    </div>
  );
};

export default NoticeDetail;
