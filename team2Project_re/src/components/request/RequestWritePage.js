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

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate('/post/list');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto bg-white px-12 py-12 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-6">문의사항 등록</h2>
         <hr className="border-t border-gray-200 my-6" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-8">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-[930px] p-3 bg-gray-100 border border-gray-300 rounded"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded resize-none"
                placeholder="문의 내용을 입력해 주세요."
                required
              />
            </div>
          </div>  
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              등록
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestWritePage;
