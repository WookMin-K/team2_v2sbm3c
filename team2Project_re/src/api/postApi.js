// 📁 src/api/postApi.js
// s

// 백엔드 API 서버 주소
// const BASE_URL = 'http://192.168.12.142:9093/post';

/** 게시글 전체 목록 조회 (map 에러 방지 포함) */

import axios from 'axios';

export const getPostList = async () => {
  const res = await fetch('/post/list', { credentials: 'include' });
  return await res.json();
};

export const getPostDetail = async (postNo) => {
  const res = await fetch(`/post/read/${postNo}`, { credentials: 'include' });
  return await res.json();
};

export const createPost = async (postData) => {
  const res = await fetch('/post/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
    credentials: 'include', // ⭐️
  });
  return await res.json();
};

export const updatePost = async (payload) => {
  const res = await fetch('/post/update', {
    method: 'POST',
    body: payload, // FormData를 그대로 보냄
    credentials: 'include', // ⭐️
  });

  return await res.json();
};

export const deletePost = async (postNo) => {
  const res = await fetch(`/post/delete/${postNo}`, {
    method: 'DELETE',
    credentials: 'include', // ⭐️
  });
  return await res.json();
};

// 📌 페이지 기반 게시글 목록 조회
export const getPostListPaged = async (page = 1, type = 'all', keyword = '') => {
  const res = await fetch(`/post/list?page=${page}&type=${type}&keyword=${keyword}`, {
    credentials: 'include', // ⭐️
  });
  return await res.json();
};

export function getMyPostListPaged(
  page,
  type = 'all',      // 기본 검색 타입
  keyword = ''       // 기본 검색 키워드
) {
  return axios
    .get(`/post/mylist?page=${page}&type=${type}&keyword=${keyword}`, {
     withCredentials: true, // ⭐️ 반드시 추가!
    })
    .then(res => res.data);
};