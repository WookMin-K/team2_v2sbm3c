import { useNavigate, useParams } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PostDelete() {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostDetail(postNo);
      if (data) setPost(data.post);
    };
    fetchPost();
  }, [postNo]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await axios.delete(`/post/delete/${postNo}`);  // axios.delete 로 변경
      const data = res.data;

      switch (data.result) {
        case 'loginRequired':
          alert('로그인이 필요합니다.');
          return;
        case 'notFound':
          alert('삭제할 대상이 없습니다.');
          return;
        case 'forbidden':
          alert('권한이 없습니다.');
          return;
        case 'success':
          alert('삭제되었습니다.');
          navigate('/post/list');
          return;
        default:
          alert('삭제 실패');
      }
    }
    catch (err) {
      console.error(err);
      alert('서버 오류로 삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(`/post/read/${postNo}`);
  };

  if (!post) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">게시글 삭제</h2>
      <p className="mb-4">이 게시글을 삭제하시겠습니까?</p>
      <p className="text-lg font-semibold mb-6">{post.title}</p>
      <div className="flex justify-center gap-4">
        {/* postNo를 handleDelete 내부에서 바로 사용하므로 인자 없이 호출 */}
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
          삭제
        </button>
        <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">
          취소
        </button>
      </div>
    </div>
  );
}

export default PostDelete;
