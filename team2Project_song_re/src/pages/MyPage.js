import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';
import './MyPage.css';

axios.defaults.withCredentials = true;
const DEFAULT_PROFILE = '/icon/user2.png';

const gradeIcons = {
  0: '/icon/admin.png',     // 관리자
  1: '/icon/yellow.png',    // 일반회원
  2: '/icon/green.png',     // 활동 회원
  3: '/icon/red.png',       // 우수 회원
  4: '/icon/black.png',     // VIP 회원
};

const MyPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginContext();
  const [loadedUser, setLoadedUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showPwdFields, setShowPwdFields] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewPwdConfirm, setShowNewPwdConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  // 1) 페이지 로드 시 사용자 정보 및 프로필 URL 불러오기
  useEffect(() => {
    if (!loginUser?.user_id) return;
    axios.get(`/users/${loginUser.user_id}`)
      .then(res => {
        const data = res.data;
        // 서버가 반환하는 필드 중 camelCase 또는 snake_case 프로필 URL 매핑
        const profileUrl = data.profileUrl ?? data.profile_url ?? null;
        setLoadedUser({ ...data, profileUrl });
      })
      .catch(err => {
        console.error('사용자 정보 불러오기 실패:', err);
        alert('사용자 정보를 불러올 수 없습니다.');
      });
  }, [loginUser]);

  if (!loginUser || !loadedUser) {
    return <div className="text-center mt-20">로딩 중...</div>;
  }

  const isAdmin = loadedUser.grade === 0;

  // 2) 필드 저장
  const handleSave = async () => {
    if (!editField) return;
    const fieldMap = { name: 'name', email: 'email', phone: 'phone' };
    try {
      await axios.put(`/users/${loadedUser.user_id}`, {
        user_id: loadedUser.user_id,
        [fieldMap[editField]]: tempValue,
      });
      alert('수정 완료');
      setLoadedUser(prev => ({ ...prev, [editField]: tempValue }));
      setEditField(null);
    } catch (err) {
      alert('수정 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  // 3) 비밀번호 변경
  const changePassword = async () => {
    if (newPwd !== newPwdConfirm) {
      return alert('새 비밀번호가 일치하지 않습니다');
    }
    try {
      const { data } = await axios.post('/users/change-password', {
        currentPassword: currentPwd,
        newPassword: newPwd,
        newPasswordConfirm: newPwdConfirm,
      });
      if (data.success) {
        alert('비밀번호 변경 완료');
        setCurrentPwd('');
        setNewPwd('');
        setNewPwdConfirm('');
        setShowPwdFields(false);
      } else {
        alert(data.message);
      }
    } catch {
      alert('비밀번호 변경 실패');
    }
  };

  // 4) 프로필 파일 선택/업로드 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => { setIsModalOpen(false); setSelectedFile(null); };
  const handleFileChange = e => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return alert('파일을 선택하세요.');
    const form = new FormData();
    form.append('profile', selectedFile);
    form.append('user_id', loadedUser.user_id);
    try {
      const res = await axios.post('/users/upload-profile', form);
      if (res.data.status === 'success') {
        // 타임스탬프 쿼리로 캐시 방지
        const newUrl = `${res.data.profileUrl}?t=${new Date().getTime()}`;
        setLoadedUser(prev => ({ ...prev, profileUrl: newUrl }));
        closeModal();
      } else {
        alert(res.data.message || '업로드 실패');
      }
    } catch (err) {
      console.error('업로드 에러:', err);
      alert('업로드 실패');
    }
  };

  // 5) 기본 이미지로 초기화
  const handleReset = async () => {
    if (!window.confirm('기본 이미지로 변경하시겠습니까?')) return;

    try {
      const res = await axios.post('/users/reset-profile', { user_id: loadedUser.user_id });
      if (res.data.status === 'success') {
        // 서버에서도 profile_url 컬럼을 null로 업데이트했으니
        // 바로 프론트 state 만 갱신
        setLoadedUser(prev => ({
          ...prev,
          profileUrl: null,    // ← 이 한 줄이면 충분합니다
        }));
      } else {
        alert('초기화에 실패했습니다.');
      }
    } catch (err) {
      console.error('초기화 에러:', err);
      alert('초기화 오류');
    }
  };

  // 등급 아이콘 & 등급명
  const iconSrc = gradeIcons[loadedUser.grade] || gradeIcons[1];

  return (
    <div className="flex w-screen h-[800px] bg-[#f4f5f7]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#3B3B58]">마이페이지</h2>
          <img
            src={loadedUser.profileUrl || DEFAULT_PROFILE}
            alt="profile"
            className="w-20 h-20 mx-auto"
          />
          <p className="mt-4 font-semibold text-lg">{loadedUser.name}</p>
          <button
            onClick={openModal}
            className="mt-4 bg-[#AFC8E0] hover:bg-[#95B9DD] text-black px-3 py-1 rounded block w-full"
          >
            프로필 이미지 변경
          </button>
          <button
            onClick={handleReset}
            className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded block w-full"
          >
            기본 이미지로 초기화
          </button>
        </div>

        <nav className="mt-6 space-y-4">
          <div className="-mx-6 border-t border-gray-300 my-6" />
          <h3 className="text-xl font-semibold">계정</h3>
          <button onClick={() => navigate('/mypage')} className="flex items-center gap-2 text-lg ml-4">
            <img src="/icon/info.png" alt="내 정보" className="w-6 h-6" />
            내 정보
          </button>

          {isAdmin && (
            <button onClick={() => navigate('/mypage/users')} className="btn-user flex items-center gap-2 text-lg ml-4">
              <span className="icon w-6 h-6" />
              회원 목록
            </button>          
          )}

          {isAdmin && (
            <button onClick={() => navigate('/admin/reports')} className="btn_report flex items-center gap-2 text-lg ml-4">
              <span className="icon w-6 h-6" />
              신고 목록
            </button>
          )}

          <h3 className="text-xl font-semibold">글 관리</h3>
          <button onClick={() => navigate('/mypage/bookmark')} className="btn-star flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            즐겨찾기
          </button>

          <button onClick={() => navigate('/mypage/postlist')} className="btn-post flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            내 게시글
          </button>

          <button onClick={() => navigate('/mypage/mytravel')} className="btn_plane flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            내 여행 일정
          </button>
          
          <button onClick={() => navigate('/request/list')} className="btn_inquiry flex items-center gap-2 text-lg ml-4">
            <span className="icon w-6 h-6" />
            내 문의
          </button>



        </nav>
      </aside>

      {/* 오른쪽 정보 영역 */}
      <section className="flex-1 flex justify-center items-start mt-6">
        <div className="w-full max-w-[1180px] bg-white p-6 rounded shadow">
          <h2 className="text-3xl font-bold mb-10 ml-1">내 정보</h2>

          {/* 등급 아이콘 & 등급명 */}
          <div className="flex items-center ml-6 mb-4 space-x-2">
            <img
              src={iconSrc}
              alt={`grade-${loadedUser.grade}`}
              className="w-12 h-12"
            />
            <span className="text-lg font-medium">
              {(() => {
                switch (loadedUser.grade) {
                  case 0: return '관리자';
                  case 1: return '일반 회원';
                  case 2: return '활동 회원';
                  case 3: return '우수 회원';
                  case 4: return 'VIP 회원';
                  default: return '회원';
                }
              })()}
            </span>
          </div>

          <div className="py-4 border-b max-w-[1070px] mx-auto relative">
            <div className="text-xl font-medium">아이디</div>
            <div className="text-md mt-1 text-gray-700">{loadedUser.user_id}</div>
          </div>

          {['name', 'email', 'phone'].map(field => (
            <div key={field} className="border-b py-3 max-w-[1070px] mx-auto relative">
              <div className="flex flex-col">
                <span className="text-xl font-medium">
                  {field === 'name' ? '이름' : field === 'email' ? '이메일' : '전화번호'}
                </span>

                {editField === field ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                    className="mt-1 border px-2 py-1 rounded w-[280px]"
                  />
                ) : (
                  <span className="text-md mt-1 text-gray-700">{loadedUser[field] || ''}</span>
                )}
              </div>

              {editField === field ? (
                <div className="mt-3 text-left">
                  <button
                    onClick={handleSave}
                    disabled={!tempValue.trim()}
                    className={`px-4 py-1 rounded mr-2 ${
                      tempValue.trim()
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    저장
                  </button>
                  <button onClick={() => setEditField(null)} className="bg-gray-400 text-white px-4 py-1 rounded">
                    취소
                  </button>
                </div>
              ) : (
                <button onClick={() => { setEditField(field); setTempValue(loadedUser[field]); }} className="absolute top-1/2 -translate-y-1/2 right-6">
                  <img src="/icon/edit.png" alt="수정" className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <div className="text-left mt-6 pl-8">
            <button
              onClick={() => setShowPwdFields(!showPwdFields)}
              className="bg-[#AFC8E0] hover:bg-[#96B6D7] text-black px-4 py-2 rounded"
            >
              {showPwdFields ? '비밀번호 변경 취소' : '비밀번호 변경'}
            </button>
          </div>

          {showPwdFields && (
            <div className="mt-4 border-t pt-6 max-w-[1070px] mx-auto">
              <div className="grid grid-cols-3 gap-x-10 gap-y-2">
                {[
                  ['현재 비밀번호', currentPwd, setCurrentPwd, showCurrentPwd, setShowCurrentPwd],
                  ['새 비밀번호', newPwd, setNewPwd, showNewPwd, setShowNewPwd],
                  ['새 비밀번호 확인', newPwdConfirm, setNewPwdConfirm, showNewPwdConfirm, setShowNewPwdConfirm]
                ].map(([label, value, setter, show, toggle], idx) => (
                  <div key={idx} className="flex flex-col relative">
                    <label className="text-sm font-medium mb-1">{label}</label>
                    <input
                      type={show ? 'text' : 'password'}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      className="border rounded px-3 py-2 pr-10"
                    />
                    <button type="button" className="absolute right-3 bottom-3 text-sm" onClick={() => toggle(!show)}>
                      {show ? '🔓' : '🔒'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-right mt-4">
                <button onClick={changePassword} className="bg-[#AFC8E0] hover:bg-[#96B6D7] text-black px-4 py-2 rounded mr-2">
                  변경
                </button>
                <button onClick={() => setShowPwdFields(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 모달 */}  
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {/* modal-box에 flex-col, items-center, p-6, w-96 추가 */}
          <div className="bg-white modal-box">
            <h3 className="text-2xl font-bold mb-6">프로필 이미지 변경</h3>
          <img
            src={loadedUser.profileUrl || DEFAULT_PROFILE}
            alt="profile"
            className="w-80 h-80 mx-auto mb-8"
          />
            {/* 선택된 파일이 있으면 미리보기 */}
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="미리보기"
                className="w-80 h-80 object-cover rounded mb-8"
              />
            )}

            {/* 숨긴 파일 입력 */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* 파일선택 레이블 (버튼처럼) */}
            <label
              htmlFor="fileInput"
              className="px-4 py-2 bg-[#AFC8E0] hover:bg-[#96B6D7] text-blue-700 rounded cursor-pointer"
            >
              파일 선택
            </label>

            {/* 버튼 그룹을 맨 아래로 밀기 위해 mt-auto */}
            <div className="mt-auto flex space-x-4">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-[#AFC8E0] hover:bg-[#96B6D7] text-white rounded"
              >
                업로드
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
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
