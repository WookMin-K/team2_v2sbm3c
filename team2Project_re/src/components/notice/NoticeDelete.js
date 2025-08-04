import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

function NoticeDelete() {
  const { loginUser } = useLoginContext();
  const { notice_no } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!loginUser || loginUser.grade !== 0) {
      alert("관리자만 삭제할 수 있습니다.");
      navigate("/notice");
      return;
    }

    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://121.78.128.95:9093/notice/read/${notice_no}`);
        const data = await res.json();
        if (data.notice) setNotice(data.notice);
      } catch (error) {
        console.error('공지/질문 정보 불러오기 실패:', error);
      }
    };

    fetchNotice();
  }, [notice_no, loginUser, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await axios.delete(`http://121.78.128.95:9093/notice/delete/${notice_no}`);

      if (res.status === 200 && res.data === "success") {
        alert("✅ 삭제되었습니다.");
        navigate('/notice');
      } else {
        alert("❌ 삭제 실패: " + res.data);
      }
    } catch (error) {
      console.error('❌ 삭제 실패:', error);
      alert('❌ 서버 오류로 삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(`/notice/${notice_no}`);
  };

  if (!notice) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">공지/질문 삭제</h2>
      <p className="mb-4">이 {notice.type}을 삭제하시겠습니까?</p>
      <p className="text-lg font-semibold mb-6">{notice.title}</p>
      <div className="flex justify-center gap-4">
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">삭제</button>
        <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">취소</button>
      </div>
    </div>
  );
}

export default NoticeDelete;
