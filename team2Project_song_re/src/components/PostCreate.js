import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const {userName, userNo, grade} = useLoginContext();
  const [noticeYn, setNoticeYn] = useState('N');
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //      alert('로그인 후 이용 가능합니다.');
  //      sessionStorage.setItem('openLoginModal', 'true');
  //      sessionStorage.setItem('redirectAfterLogin', '/post/create');
  //      navigate('/');
  //      return;
  //    }



  // }, [navigate]);



  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate('/post/list');
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);  // 단일 파일 기준 (다중 파일이면 배열 처리 필요)
  };
  

  const MAX_SIZE = 50 * 1024 * 1024; 

  const handleSubmit = async (e) => {
    e.preventDefault();


        // 1) 클라이언트 사전 검증
  if (image && image.size > MAX_SIZE) {
    alert('이미지 파일 크기가 너무 큽니다. 최대 50MB까지 업로드 가능합니다.');
    return;
  }
  if (files && files.size > MAX_SIZE) {
    alert('첨부 파일 크기가 너무 큽니다. 최대 50MB까지 업로드 가능합니다.');
    return;
  }
  
    // 2) 파일(image/files)이 하나라도 있으면 FormData, 없으면 JSON
    // if (image || files) {
    //   payload = new FormData();
    //   payload.append("title", title);
    //   payload.append("content", content);
    //   payload.append("user_no", userNo);
    //   payload.append("notice_yn", noticeYn);
    //   if (image) payload.append("image", image);
    //   if (files) payload.append("files", files);

    //   headers = {};
    // } else {
    //   payload = {
    //     title,
    //     content,
    //     user_no: userNo,
    //     notice_yn: noticeYn,
    //   };
    //   headers = { 'Content-Type': 'application/json' };
    // }
       // — 무조건 FormData 로만 보냅니다
    const payload = new FormData();
    payload.append("title", title);
    payload.append("content", content);
    payload.append("user_no", userNo);
    payload.append("notice_yn", noticeYn);
    if (image) payload.append("image", image);
    if (files) payload.append("files", files);

    try {
     // 헤더 옵션 없이 보내면 axios가 multipart/form-data; boundary=… 까지 자동 처리해 줍니다
     const response = await axios.post(
       //'http://192.168.12.142:9093/post/create',
       'http://localhost:9093/post/create',
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
            <select value={noticeYn} onChange={(e) => setNoticeYn(e.target.value)}>
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