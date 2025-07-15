import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

const NoticeCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('공지');
  const [files, setFiles] = useState([]); // 최대 2개
  const navigate = useNavigate();

  const { loginUser } = useLoginContext();

  useEffect(() => {
    if (!loginUser || Number(loginUser.grade) !== 0) {
      alert('관리자만 글을 작성할 수 있습니다.');
      navigate('/notice');
    }
  }, [loginUser, navigate]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files].slice(0, 2)); // 최대 2개까지 유지
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate('/notice');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('type', type);
      formData.append('user_no', loginUser.user_no);

      // 질문 번호가 있다면 추가 (현재는 null)
      const question_id = null;
      if (question_id !== null && question_id !== undefined) {
        formData.append('question_id', question_id);
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await axios.post(
        'http://localhost:9093/notice/create', // ⛳ API 주소 주의!
        //'http://192.168.12.142:9093';
        formData
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
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>공지/질문 등록</h2>
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
          <label>종류: </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="공지">공지사항</option>
            <option value="질문">질문</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>파일 업로드 (최대 2개): </label>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.pdf,.xml,.csv,.zip,.docx,.xlsx"
            onChange={handleFileChange}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit">등록</button>
          <button type="button" onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default NoticeCreate;
