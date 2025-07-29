// src/components/admin/AdminReportList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminReportList = () => {
  // 1) 탭 상태: 'post' 또는 'reply'
  const [tab, setTab] = useState('post');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2) 탭이 바뀔 때마다 API 호출
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

  if (loading) return <div className="p-8">로딩 중…</div>;
  if (reports.length === 0) {
    return <div className="p-8">등록된 {tab === 'post' ? '게시글' : '댓글'} 신고 내역이 없습니다.</div>;
  }

  return (
    <div className="p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">신고 관리</h2>

      {/* 3) 탭 버튼 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTab('post')}
          className={`px-4 py-2 rounded ${tab === 'post' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          게시글 신고
        </button>
        <button
          onClick={() => setTab('reply')}
          className={`px-4 py-2 rounded ${tab === 'reply' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          댓글 신고
        </button>
      </div>

      {/* 4) 리스트 테이블 */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {(tab === 'post'
              ? ['신고번호','게시글번호','신고자','사유','날짜','처리상태']
              : ['신고번호','댓글번호','신고자','사유','날짜','처리상태']
            ).map(h => (
              <th key={h} className="border px-4 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.report_no} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{r.report_no}</td>
              <td className="border px-4 py-2">
                {tab === 'post' ? (
                  <Link
                    to={`/post/read/${r.post_no}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {r.post_no}
                  </Link>
                ) : (
                  <Link
                    to={`/post/read/${r.post_no}#reply-${r.reply_no}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {r.reply_no}
                  </Link>
                )}
              </td>

              <td className="border px-4 py-2">{r.user_no}</td>
              <td className="border px-4 py-2">{r.reason}</td>
              <td className="border px-4 py-2">
                {new Date(r.report_date).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                {r.status === 'N' ? '미처리' : '처리완료'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReportList;
