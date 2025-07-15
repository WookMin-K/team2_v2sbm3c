import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMyPostListPaged } from '../api/postApi';

export default function MyPostListPage() {
  const [posts,         setPosts]         = useState([]);
  const [totalCount,    setTotalCount]    = useState(0);  
  const [recordPerPage, setRecordPerPage] = useState(10);  

  // ① useSearchParams 로 ?page= 값을 읽고
  const [searchParams, setSearchParams] = useSearchParams();
  const nowPage = parseInt(searchParams.get('page') || '1', 10);

  // 1) URL의 ?page= 파라미터 읽어서 데이터 요청

  // ② nowPage가 바뀔 때마다 다시 호출
  useEffect(() => {
    getMyPostListPaged(nowPage)
      .then(data => {
        setPosts(data.list);
        setTotalCount(data.total);               
        setRecordPerPage(data.record_per_page);  
      })
      .catch(console.error);
  }, [nowPage]);

  const totalPages = Math.ceil(totalCount / recordPerPage);

  return (
    <div className="w-full p-6">
      {/* 페이지 헤더 */}
      <h2 className="text-2xl font-bold mb-4">✏️ 내가 쓴 게시글</h2>

      {/* 총 건수 */}
      <p className="text-sm text-gray-600 mb-4">
        전체 {totalCount}건
      </p>

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
          onClick={() => setSearchParams({ page: nowPage - 1 })}
          disabled={nowPage === 1}
        >◀</button>

        <span>{nowPage} / {totalPages}</span>

        <button
          onClick={() => setSearchParams({ page: nowPage + 1 })}
          disabled={nowPage === totalPages}
        >▶</button>
      </div>
    </div>
  );
}
