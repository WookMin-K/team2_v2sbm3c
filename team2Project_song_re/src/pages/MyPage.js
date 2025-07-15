import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useLoginContext } from '../contexts/LoginContext'; // ✅ 팀 코드엔 없었던 부분

const MyPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginContext(); // ✅ context로부터 로그인 유저

  const [userInfo, setUserInfo] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');

  // ✅ 로그인 유저 상태 확인 로그
  useEffect(() => {
    console.log('📍 MyPage에서 loginUser 확인:', loginUser);
  }, [loginUser]);

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const userId = loginUser?.user_id || sessionStorage.getItem('userId');
    if (userId) {
      axios.get(`/users/${userId}`)
        .then(res => {
          console.log("✅ 사용자 정보 불러옴:", res.data);
          setUserInfo(res.data);
        })
        .catch(err => console.error('❌ 사용자 정보 불러오기 실패:', err));
    }
  }, [loginUser]);

  // ✅ 프로필 수정 저장
  const handleSave = () => {
    const updateData = {
      user_id: userInfo.user_id,
      [editField]: tempValue,
    };

    axios.put(`/users/${userInfo.user_id}`, updateData, { withCredentials: true })
      .then(() => {
        alert('✅ 수정 완료');
        setUserInfo({ ...userInfo, [editField]: tempValue });
        setEditField(null);
      })
      .catch(() => alert('❌ 수정 실패'));
  };

  // ✅ 비밀번호 변경 처리
  const handlePasswordChange = () => {
    if (newPwd !== newPwdConfirm) {
      alert('❗ 새 비밀번호가 일치하지 않습니다');
      return;
    }

    const data = {
      currentPassword: currentPwd,
      newPassword: newPwd,
      newPasswordConfirm: newPwdConfirm
    };

    axios.post('/users/change-password', data, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          alert('✅ 비밀번호 변경 완료');
          setShowPasswordModal(false);
          setCurrentPwd('');
          setNewPwd('');
          setNewPwdConfirm('');
        } else {
          alert('❌ ' + res.data.message);
        }
      })
      .catch(err => {
        console.error('❌ 서버 요청 실패:', err);
        alert('❌ 비밀번호 변경 중 오류가 발생했습니다');
      });
  };

  // ✅ 로그인 상태 없을 때
  if (!loginUser && !sessionStorage.getItem('userId')) {
    return <div className="text-center mt-20">로그인이 필요합니다.</div>;
  }

  if (!userInfo) return <div className="text-center mt-20">로딩 중...</div>;

  return (
    <div className="flex w-screen min-h-screen bg-[#f4f5f7]">
      {/* 사이드바 */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">마이페이지</h2>
          <img src="/logo192.png" alt="profile" className="w-20 h-20 mx-auto" />
          <p className="mt-2 font-bold text-lg">{userInfo.name}</p>
        </div>
        <nav className="mt-10 space-y-4">
          {/* <button onClick={() => navigate('/mypage')} className="block w-full text-left">👤 내 정보</button> */}
          <button onClick={() => navigate('/mypage/bookmark')} className="block w-full text-left">⭐ 즐겨찾기</button>
          <button onClick={() => navigate('/mypage/posts')} className="block w-full text-left">📝 내 게시글</button>
          <button onClick={() => navigate('/mypage/mytravel')} className="block w-full text-left">✈️ 내 여행 일정</button>
        </nav>
      </aside>

      {/* 본문 */}
      <section className="flex-1 p-10">
        <h2 className="text-2xl font-bold mb-6">내 정보</h2>
        <div className="bg-white p-6 rounded shadow-md w-full space-y-6">
          
          {/* 아이디 */}
          <div className="border-b pb-4 flex justify-between items-center">
            <span className="font-medium">아이디</span>
            <span>{userInfo.user_id}</span>
          </div>

          {/* 비밀번호 변경 버튼 */}
          <div className="text-right mt-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              비밀번호 변경
            </button>
          </div>

          {/* 수정 가능한 필드 */}
          {['name', 'email', 'phone'].map((field) => (
            <div key={field} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {field === 'name' ? '이름' : field === 'email' ? '이메일' : '전화번호'}
                </span>
                <div className="flex items-center gap-2">
                  {editField === field ? (
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{userInfo[field]}</span>
                  )}
                  <button
                    onClick={() => {
                      setEditField(field);
                      setTempValue(userInfo[field]);
                    }}
                    className="text-gray-500 hover:text-black"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </div>

              {editField === field && (
                <div className="mt-3 text-right">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditField(null)}
                    className="bg-gray-400 text-white px-4 py-1 rounded"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h3 className="text-lg font-bold mb-4">비밀번호 변경</h3>

            <label className="block mb-2">현재 비밀번호</label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2">새 비밀번호</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2">새 비밀번호 확인</label>
            <input
              type="password"
              value={newPwdConfirm}
              onChange={(e) => setNewPwdConfirm(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <div className="text-right mt-4">
              <button
                onClick={handlePasswordChange}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                변경
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
