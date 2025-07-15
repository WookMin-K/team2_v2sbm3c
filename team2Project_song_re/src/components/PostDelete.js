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
    try {
    //await axios.delete(`http://192.168.12.142:9093/post/delete/${postNo}`);
    await axios.delete(`http://localhost:9093/post/delete/${postNo}`);

      navigate('/post/list');
    } catch (error) {
      console.error('삭제 실패:', error);
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
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">삭제</button>
        <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">취소</button>
      </div>
    </div>
  );
}

export default PostDelete;
