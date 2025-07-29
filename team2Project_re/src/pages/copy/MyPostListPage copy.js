import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMyPostListPaged } from '../../api/postApi';

export default function MyPostListPage() {
  const [posts,         setPosts]         = useState([]);
  const [totalCount,    setTotalCount]    = useState(0);  
  const [recordPerPage, setRecordPerPage] = useState(10);  

  // 검색 상태
  const [searchParams, setSearchParams] = useSearchParams();
  const nowPage = parseInt(searchParams.get('page') || '1', 10);
  const type       = searchParams.get('type')    || 'all';
  const keyword    = searchParams.get('keyword') || '';

  // 로컬 입력값
  const [localType,    setLocalType]    = useState(type);
  const [localKeyword, setLocalKeyword] = useState(keyword);

  // 데이터 불러오기 (page/type/keyword 바뀌면)
  useEffect(() => {
    getMyPostListPaged(nowPage, type, keyword)
      .then(data => {
        setPosts(data.list);
        setTotalCount(data.total);               
        setRecordPerPage(data.record_per_page);  
      })
      .catch(console.error);
  }, [nowPage, type, keyword]);

  const totalPages = Math.ceil(totalCount / recordPerPage);

  
  // 검색 실행 핸들러
  const handleSearch = () => {
    // 검색 누르면 페이지 1로 리셋
    setSearchParams({
      page:    '1',
      type:    localType,
      keyword: localKeyword.trim(),
    });
  };

  return (
    <div className="w-full p-6">
      {/* 페이지 헤더 */}
      <h2 className="text-2xl font-bold mb-4">✏️ 내가 쓴 게시글</h2>

      {/* 총 건수 */}
      <p className="text-sm text-gray-600 mb-4">
        전체 {totalCount}건
      </p>

      

    {/* 검색 UI */}
      <div className="flex justify-end items-center mb-4 space-x-2">
        <select
          value={localType}
          onChange={e => setLocalType(e.target.value)}
           className="border rounded h-10 px-4 w-40"
        >
          <option value="all">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input
          type="text"
          value={localKeyword}
          onChange={e => setLocalKeyword(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="검색어 입력"
          className="border rounded h-10 px-4 w-64"
        />

          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            검색
          </button>
      </div>

      {/* 게시글 테이블 */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              <th className="px-2 py-1">No</th>
              <th className="px-2 py-1">제목</th>
              <th className="px-2 py-1">작성시간</th>
              <th className="px-2 py-1">작성자</th>
              <th className="px-2 py-1">조회수</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.post_no} className="hover:bg-gray-50">
                <td className="px-2 py-1">
                  {post.notice_yn === 'Y' ? '📌' : post.post_no}
                </td>
                <td className="px-2 py-1">
                  <Link
                    to={`/post/read/${post.post_no}`}
                    className="text-blue-600 hover:underline"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-2 py-1">
                  {new Date(post.created_day).toLocaleDateString()}
                </td>
                <td className="px-2 py-1">{post.name}</td>
                <td className="px-2 py-1">{post.view_cnt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이징 버튼 */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() =>
            setSearchParams({
              page:   Math.max(1, nowPage - 1),
              type,                // ← 기존 검색 조건 유지
              keyword              // ← 기존 검색 키워드 유지
            })
          }
          disabled={nowPage === 1}
        >◀</button>

        <span>{nowPage} / {totalPages}</span>

        <button
          onClick={() =>
            setSearchParams({
              page:    Math.min(totalPages, nowPage + 1),
              type,                    // ← 유지
              keyword                  // ← 유지
            })
          }
          disabled={nowPage === totalPages}
        >▶</button>
      </div>
    </div>
  );
}
