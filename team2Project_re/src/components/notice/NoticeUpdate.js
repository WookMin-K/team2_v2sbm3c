import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

function NoticeUpdate() {
  const { loginUser } = useLoginContext();
  const { notice_no } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState({
    title: '',
    content: '',
    type: '공지'
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!loginUser || loginUser.grade !== 0) {
      alert("관리자만 수정할 수 있습니다.");
      navigate('/notice');
      return;
    }

    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://121.78.128.95:9093/notice/read/${notice_no}`);
        if (!res.ok) throw new Error('불러오기 실패');
        const data = await res.json();
        if (data && data.notice) setNotice(data.notice);
      } catch (error) {
        console.error('❌ 공지사항 불러오기 실패:', error);
        alert('공지 정보를 불러올 수 없습니다.');
        navigate('/notice');
      }
    };

    fetchNotice();
  }, [notice_no, loginUser, navigate]);

  const handleChange = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files].slice(0, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('notice_no', notice_no);
      formData.append('title', notice.title);
      formData.append('content', notice.content);
      formData.append('type', notice.type);
      formData.append('user_no', loginUser.user_no);

      if (notice.question_id) {
        formData.append('question_id', notice.question_id);
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await axios.post(
        'http://121.78.128.95:9093/notice/update',
        formData
      );

      if (res.status === 200 && res.data === 'success') {
        alert("✅ 수정이 완료되었습니다.");
        navigate(`/notice/${notice_no}`);
      } else {
        alert('❌ 수정 실패: ' + res.data);
      }
    } catch (error) {
      console.error('❌ 공지/질문 수정 실패:', error);
      alert('서버 오류로 수정에 실패했습니다.');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">공지/질문 수정</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={notice.title}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
          placeholder="제목"
        />
        <textarea
          name="content"
          value={notice.content}
          onChange={handleChange}
          rows={10}
          className="w-full border p-2 mb-4"
          placeholder="내용"
        />
        <select
          name="type"
          value={notice.type}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        >
          <option value="공지">공지사항</option>
          <option value="질문">질문</option>
        </select>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.pdf,.xml,.csv,.zip,.docx,.xlsx"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">수정 완료</button>
      </form>
    </div>
  );
}

export default NoticeUpdate;
