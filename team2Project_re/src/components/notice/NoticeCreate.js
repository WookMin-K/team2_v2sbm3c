import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

const NoticeCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('공지');
  // const [files, setFiles] = useState([]); // 최대 2개
  const [files, setFiles] = useState(null);
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const navigate = useNavigate();

  const { loginUser } = useLoginContext();

  useEffect(() => {
    if (!loginUser || Number(loginUser.grade) !== 0) {
      alert('관리자만 글을 작성할 수 있습니다.');
      navigate('/notice');
    }
  }, [loginUser, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_SIZE) {
      alert('파일은 최대 50MB까지 업로드 가능합니다.');
      e.target.value = null;
      return;
    }
    setFiles(file);
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate('/notice');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append('title', title);
      payload.append('content', content);
      payload.append('type', type);
      payload.append('user_no', loginUser.user_no);
      if (files) payload.append('files', files);


      // 질문 번호가 있다면 추가 (현재는 null)
      const question_id = null;
      if (question_id !== null && question_id !== undefined) {
        payload.append('question_id', question_id);
      }

      // files.forEach((file) => {
      //   payload.append('files', file);
      // });

      const res = await axios.post(
        'http://192.168.12.142:9093/notice/create', // ⛳ API 주소 주의!
        //'http://192.168.12.142:9093';
        payload
      );

      if (res.status === 200 && res.data === 'success') {
        alert('✅ 공지/질문이 등록되었습니다.');
        navigate('/notice');
      } else {
        alert('❌ 등록 실패: ' + res.data);
      }
    } catch (err) {
      console.error('등록 중 오류 발생:', err);
      alert('❌ 서버 오류로 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto bg-white px-12 py-12 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-6">공지사항 등록</h2>
         <hr className="border-t border-gray-200 my-6" />
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                등록 종류
              </label>
              <select
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="공지">공지사항</option>
                <option value="질문">질문</option>
              </select>
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
                placeholder="내용을 입력해 주세요."
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                일반 파일 첨부
              </label>
              <div className="flex">
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-l">
                  {files ? files.name : '파일을 선택해 주세요.'}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('file-input').click()}
                  className="px-4 bg-white border border-l-0 border-gray-300 rounded-r hover:bg-gray-50"
                >
                  찾아보기
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                * 첨부 파일은 jpg, png, gif, hwp, pdf, ppt, pptx, xls, xlsx, zip 파일만 등록 가능합니다. (최대 : 50MB)
              </p>
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
        </div>  
      </form>
    </div>
    </div>
  );
};

export default NoticeCreate;
