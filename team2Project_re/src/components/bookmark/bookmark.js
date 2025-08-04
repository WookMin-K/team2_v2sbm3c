// 📁 src/api/bookmark.js
import axios from 'axios';

const API = 'http://121.78.128.95:9093/bookmark';
//const API = 'http://localhost:9093';

// ✅ 즐겨찾기 등록
export const createBookmark = ({ user_no, trip_no, post_no }) => {
  const payload = trip_no
    ? { user_no, trip_no, type: 'trip' }
    : { user_no, post_no, type: 'post' };

  return axios.post(`${API}/create`, payload).then(res => res.data);
};

// ✅ 즐겨찾기 삭제
export const deleteBookmark = ({ user_no, trip_no, post_no }) => {
  const payload = trip_no ? { user_no, trip_no } : { user_no, post_no };

  return axios.post(`${API}/delete`, payload).then(res => res.data);
};

// ✅ 중복 여부 체크
export const checkBookmark = ({ user_no, trip_no, post_no }) => {
  const payload = trip_no ? { user_no, trip_no } : { user_no, post_no };

  return axios.post(`${API}/check`, payload).then(res => res.data);
};
