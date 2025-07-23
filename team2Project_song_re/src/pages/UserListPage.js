import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserListPage = () => {
  const [users, setUserList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/users/api/list')
      .then((res) => {
        if (res.data.status === 'unauthorized') {
          setError(res.data.message);
        } else {
          setUserList(res.data);
        }
      })
      .catch((err) => {
        console.error("❌ 회원 목록 요청 실패", err);
        setError('회원 목록을 불러오는 데 실패했습니다.');
      });
  }, []);

  if (error) {
    return (
      <div className="p-10 text-red-500 text-xl">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">회원 목록</h2>

      {users.length === 0 ? (
        <div className="text-gray-600">표시할 회원이 없습니다.</div>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="py-2 px-4 border">아이디</th>
              <th className="py-2 px-4 border">이름</th>
              <th className="py-2 px-4 border">이메일</th>
              <th className="py-2 px-4 border">등급</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{user.user_id}</td>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.grade === 0 ? '관리자' : '일반회원'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserListPage;