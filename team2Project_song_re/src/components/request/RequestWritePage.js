import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

const RequestWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ✅ 로그인한 사용자 정보 가져오기 (user_no 포함)
  const { loginUser } = useLoginContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginUser) {
      alert('로그인이 필요합니다!');
      return;
    }

    try {
      // ✅ 서버로 POST 요청
      await axios.post('/request/create', {
        user_no: loginUser.user_no,
        title,
        content
      });

      alert('문의가 등록되었습니다! 😊');
      navigate('/request/list');
    } catch (error) {
      console.error('등록 실패', error);
      alert('❌ 문의 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2e3a4e]">문의사항 등록</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">제목</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="문의 제목을 입력해주세요"
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-700">내용</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded h-48 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="문의 내용을 입력해주세요"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full text-lg font-semibold transition-colors"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestWritePage;
