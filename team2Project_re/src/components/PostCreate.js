// 📁 src/components/PostCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';

export default function PostCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { userName, userNo, grade } = useLoginContext();
  const [notice_yn, setNotice_yn] = useState('N');
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState(null);
  const navigate = useNavigate();
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate('/post/list');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_SIZE) {
      alert('이미지는 최대 50MB까지 업로드 가능합니다.');
      e.target.value = null;
      return;
    }
    setImage(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_SIZE) {
      alert('파일은 최대 50MB까지 업로드 가능합니다.');
      e.target.value = null;
      return;
    }
    setFiles(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', title);
    payload.append('content', content);
    payload.append('user_no', userNo);
    payload.append('notice_yn', notice_yn);
    if (image) payload.append('image', image);
    if (files) payload.append('files', files);

    try {
      const res = await axios.post(
        'http://121.78.128.95:9093/post/create',
        payload
      );
      if (res.status < 300) {
        alert('게시글이 등록되었습니다.');
        navigate('/post/list');
      } else {
        alert('등록 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류로 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto bg-white px-12 py-12 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-6">게시글 등록</h2>
         <hr className="border-t border-gray-200 my-6" />
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-2 gap-8">
            {/* 제목 */}
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

            {/* 작성자(읽기전용) */}
            {/* <div>
              <label className="block text-sm font-medium mb-1">
                작성자
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                value={userName}
                readOnly
              />
            </div> */}

            {/* 공지 여부(관리자만) */}
            {grade === 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  공지 여부
                </label>
                <select
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                  value={notice_yn}
                  onChange={e => setNotice_yn(e.target.value)}
                >
                  <option value="N">일반글</option>
                  <option value="Y">고정글</option>
                </select>
              </div>
            )}

            {/* 빈 칸 채우기용 (필요시) */}
            {grade !== 0 && <div />}

            {/* 내용 (두 칸 합침) */}
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

            {/* 이미지 첨부 (두 칸 합침) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                이미지 첨부
              </label>
              <div className="flex">
                <input
                  id="img-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-l">
                  {image ? image.name : '이미지를 선택해 주세요.'}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('img-input').click()}
                  className="px-4 bg-white border border-l-0 border-gray-300 rounded-r hover:bg-gray-50"
                >
                  찾아보기
                </button>
              </div>
            </div>

            {/* 일반 파일 첨부 (두 칸 합침) */}
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
          </div>

          {/* 버튼 그룹 */}
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
}
