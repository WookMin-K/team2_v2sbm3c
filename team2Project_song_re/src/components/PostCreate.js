import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const {userName, userNo, grade} = useLoginContext();
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();


       // — 무조건 FormData 로만 보냅니다
    const payload = new FormData();
    payload.append("title", title);
    payload.append("content", content);
    payload.append("user_no", userNo);
    payload.append("notice_yn", notice_yn);
    if (image) payload.append("image", image);
    if (files) payload.append("files", files);

  for (let [k, v] of payload.entries()) {
    console.log(k, v);
  }
    try {
     // 헤더 옵션 없이 보내면 axios가 multipart/form-data; boundary=… 까지 자동 처리해 줍니다
     const response = await axios.post(
      //'http://192.168.12.142:9093/post/create',
       'http://192.168.12.142:9093/post/create',
       payload
      );
      if (response.status === 200 || response.status === 201) {
        alert('게시글이 등록되었습니다.');
        navigate('/post/list');
      } else {
        alert('등록 실패');
      }
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      alert('서버 오류로 등록에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>게시글 등록</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>제목: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>내용: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="5"
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>작성자: </label>
          <input type="text" value={userName} readOnly disabled />
        </div>

        {/* 관리자만 고정글 옵션 표시 */}
        {grade === 0 && (
          <div style={{ marginBottom: '10px' }}>
            <label>공지 여부: </label>
            <select value={notice_yn} onChange={(e) => setNotice_yn(e.target.value)}>
              <option value="N">일반글</option>
              <option value="Y">고정글</option>
            </select>
          </div>
        )}

        <div>
          <label>이미지 첨부:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <label>일반 파일 첨부:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="flex justify-end gap-1 mt-5">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            등록
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;