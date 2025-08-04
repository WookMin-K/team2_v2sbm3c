import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import axios from 'axios';
import deleteicon from '../pages/icon/delete.png';
function PostUpdate() {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: ''
  });

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostDetail(postNo);
      if (data) setPost(data.post);
    };
    fetchPost();
  }, [postNo]);

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

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate(-1);
    }
  };

  // 이미지 삭제
  const handleDeleteImage = async () => {
    if (window.confirm("이미지를 삭제하시겠습니까?")) {
      try {
        const res = await axios.delete(`http://121.78.128.95:9093/post/delete/image/${postNo}`);
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
        const res = await axios.delete(`http://121.78.128.95:9093/post/delete/file/${postNo}`);
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
      "http://121.78.128.95:9093/post/update",
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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto bg-white px-12 py-12 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-6">게시글 수정</h2>
         <hr className="border-t border-gray-200 my-6" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-8"></div>
              <label className="block text-sm font-medium mb-1">
                제목 <span className="text-red-500">*</span>
              </label>            
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                placeholder="제목"
              />
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                내용 <span className="text-red-500">*</span>
              </label>              
              <textarea
                name="content"
                value={post.content}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded resize-none"
                placeholder="내용"
              />
              </div>

            <label className="block mb-1 font-semibold">현재 이미지</label>
            {post.image_org ? (
              <div className="flex items-center justify-start mb-2 text-sm text-gray-600 space-x-2">
                <span>{post.image_org}</span>
                <button type="button" onClick={handleDeleteImage} className="text-red-500 text-1.8xl leading-none">
                  <img src={deleteicon} className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mb-2 text-sm text-gray-400">등록된 이미지 없음</div>
            )}
            <div className="flex mb-6">
            <input
              id="img-input"  
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
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

            <label className="block mb-1 font-semibold">현재 파일</label>
            {post.file_org ? (
              <div className="flex items-center justify-start mb-2 text-sm text-gray-600 space-x-2">
                <span>{post.file_org}</span>
                <button type="button" onClick={handleDeleteFile} className="text-red-500 text-1.8xl leading-none">
                  <img src={deleteicon} className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mb-2 text-sm text-gray-400">등록된 파일 없음</div>
            )}

            <div className="flex mb-6">
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-l">
                {file ? file.name : '파일을 선택해 주세요.'}
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('file-input').click()}
                className="px-4 bg-white border border-l-0 border-gray-300 rounded-r hover:bg-gray-50"
              >
                찾아보기
              </button>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                수정
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

export default PostUpdate;