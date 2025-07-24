import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import axios from 'axios';

function PostUpdate() {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: ''
  });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostDetail(postNo);
      if (data) setPost(data.post);
    };
    fetchPost();
  }, [postNo]);

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  // 컴포넌트 최상단에 추가
  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f && f.size > MAX_SIZE) {
      alert('이미지는 최대 50MB까지 업로드 가능합니다.');
      e.target.value = null;
      return;
    }
    setImage(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.size > MAX_SIZE) {
      alert('파일은 최대 50MB까지 업로드 가능합니다.');
      e.target.value = null;
      return;
    }
    setFile(f);
  };


  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // 이미지 삭제
  const handleDeleteImage = async () => {
    if (window.confirm("이미지를 삭제하시겠습니까?")) {
      try {
        const res = await axios.delete(`http://192.168.12.142:9093/post/delete/image/${postNo}`);
        if (res.data.result === 'success') {
          alert("이미지가 삭제되었습니다.");
          setPost((prev) => ({ ...prev, image_org: null }));
        }
      } catch (e) {
        alert("이미지 삭제 실패");
      }
    }
  };

  // 파일 삭제
  const handleDeleteFile = async () => {
    if (window.confirm("파일을 삭제하시겠습니까?")) {
      try {
        const res = await axios.delete(`http://192.168.12.142:9093/post/delete/file/${postNo}`);
        if (res.data.result === 'success') {
          alert("파일이 삭제되었습니다.");
          setPost((prev) => ({ ...prev, file_org: null }));
        }
      } catch (e) {
        alert("파일 삭제 실패");
      }
    }
  };  

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = new FormData();
  payload.append("post_no", postNo);
  payload.append("title", post.title);
  payload.append("content", post.content);
  payload.append("user_no", post.user_no || 1);
  payload.append("notice_yn", post.notice_yn || 'N');

  // 파일 교체 / 삭제 의도 표시
  if (image)  payload.append("image", image);
  else        payload.append("image", "");
  if (file)   payload.append("files", file);
  else        payload.append("files", "");

  try {
    // multipart/form-data 로 POST
    const res = await axios.post(
      "http://192.168.12.142:9093/post/update",
      payload
      // 헤더는 axios가 자동으로 잡아줍니다
    );
    if (res.data.result === "success") {
      navigate(`/post/read/${postNo}`);
    } else {
      alert("수정 실패");
    }
  } catch (err) {
    console.error(err);
    alert("수정 중 오류가 발생했습니다.");
  }
};

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
          placeholder="제목"
        />
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          rows={10}
          className="w-full border p-2 mb-4"
          placeholder="내용"
        />

        <label className="block mb-1 font-semibold">현재 이미지</label>
        {post.image_org ? (
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>{post.image_org}</span>
            <button type="button" onClick={handleDeleteImage} className="text-red-500 text-xs">🗑 삭제</button>
          </div>
        ) : (
          <div className="mb-2 text-sm text-gray-400">등록된 이미지 없음</div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        <label className="block mb-1 font-semibold">현재 파일</label>
        {post.file_org ? (
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>{post.file_org}</span>
            <button type="button" onClick={handleDeleteFile} className="text-red-500 text-xs">🗑 삭제</button>
          </div>
        ) : (
          <div className="mb-2 text-sm text-gray-400">등록된 파일 없음</div>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">수정 완료</button>
      </form>
    </div>
  );
}

export default PostUpdate;