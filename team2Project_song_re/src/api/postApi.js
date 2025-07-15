// 📁 src/api/postApi.js
// s

// 백엔드 API 서버 주소
// const BASE_URL = 'http://localhost:9093/post';

/** 게시글 전체 목록 조회 (map 에러 방지 포함) */
export const getPostList = async () => {
  const res = await fetch('/post/list');
  return await res.json();
};

export const getPostDetail = async (postNo) => {
  const res = await fetch(`/post/read/${postNo}`);
  return await res.json();
};

export const createPost = async (postData) => {
  const res = await fetch('/post/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return await res.json();
};

export const updatePost = async (payload) => {
  const res = await fetch('/post/update', {
    method: 'POST',
    body: payload, // FormData를 그대로 보냄
  });

  return await res.json();
};

export const deletePost = async (postNo) => {
  const res = await fetch(`/post/delete/${postNo}`, {
    method: 'DELETE',
  });
  return await res.json();
};

// 📌 페이지 기반 게시글 목록 조회
export const getPostListPaged = async (page = 1, type = 'all', keyword = '') => {
  const res = await fetch(`/post/list?page=${page}&type=${type}&keyword=${keyword}`);
  return await res.json();
};
