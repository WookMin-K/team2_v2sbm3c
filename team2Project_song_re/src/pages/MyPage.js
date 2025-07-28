import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';
import MegaMenu from '../components/MegaMenu';
import upIcon from '../pages/icon/up.png';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import './MyPage.css';

axios.defaults.withCredentials = true;
const DEFAULT_PROFILE = '/icon/user2.png';

const MyPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginContext();
  const [loadedUser, setLoadedUser] = useState(null);
  const [editField, setEditField] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [showPwdFields, setShowPwdFields] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdConfirm, setNewPwdConfirm] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewPwdConfirm, setShowNewPwdConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

   useEffect(() => {
     if (!loginUser?.user_id) return;
     axios.get(`/users/${loginUser.user_id}`)
       .then(res => {
         const data = res.data;
         // 서버가 내려주는 profileUrl (camelCase) 혹은 profile_url (snake_case) 중 하나로 통일
         const profileUrl = data.profileUrl ?? data.profile_url ?? null;
         setLoadedUser({ ...data, profileUrl });
       })
       .catch(err => {
         console.error('사용자 정보 불러오기 실패:', err);
         alert('사용자 정보를 불러올 수 없습니다.');
       });
   }, [loginUser]);

    const onCropComplete = useCallback((_, areaPixels) => {
      setCroppedAreaPixels(areaPixels);
    }, []);
   
    const showCroppedImage = useCallback(async () => {
      try {
        const croppedBlob = await getCroppedImg(
          URL.createObjectURL(selectedFile),
          croppedAreaPixels
        );
        // blob → File 로 변환
        const croppedFile = new File([croppedBlob], selectedFile.name, {
          type: selectedFile.type,
        });
        // 여기서 croppedFile 을 업로드 폼에 넣고 handleUpload 호출
        setSelectedFile(croppedFile);
      } catch (e) {
        console.error(e);
      }
    }, [croppedAreaPixels, selectedFile]);
  
  
    // **로딩 처리: loginUser 또는 loadedUser가 없으면 렌더 중단**
    if (!loginUser || !loadedUser) {
      return <div className="text-center mt-20">로딩 중...</div>;
    }
   
    const isAdmin = loadedUser.grade === 0;
  
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
  
  const handleMenuToggle = () => setMenuOpen(o => !o);

  // 4) 프로필 파일 선택/업로드 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => { setIsModalOpen(false); setSelectedFile(null); };
  const handleFileChange = e => setSelectedFile(e.target.files[0]);

    const handleUpload = async () => {
      if (!selectedFile) return alert('파일을 선택하세요.');
      const form = new FormData();
      form.append('profile', selectedFile);
      form.append('user_id', loadedUser.user_id);  // 서버 저장용 userId

      try {
        // 1) 서버가 리턴해주는 URL을 받아오고
        const res = await axios.post('/users/upload-profile', form);
        // 2) 캐시 방지를 위해 timestamp만 덧붙여 그대로 사용
        const newUrl = res.data.profileUrl + '?t=' + Date.now();
        setLoadedUser(prev => ({ ...prev, profileUrl: newUrl }));
        closeModal();
      } catch (err) {
        console.error('업로드 에러:', err);
        alert('업로드 실패');
      }
    };
    const handleReset = async () => {
      if (!window.confirm('기본 이미지로 변경하시겠습니까?')) return;

      try {
        // 서버에 reset 요청
        const { data } = await axios.post('/users/reset-profile', {
          user_id: loadedUser.user_id
        });
        if (data.status === 'success') {
          // state 리셋
          setLoadedUser(prev => ({ ...prev, profileUrl: null }));
        } else {
          alert('초기화 실패: ' + (data.message || ''));
        }
      } catch (err) {
        console.error('초기화 에러:', err);
        alert('초기화 오류');
      }
    };

  const gradeIcons = {
    0: '/icon/admin.png',
    1: '/icon/yellow.png',
    2: '/icon/green.png',
    3: '/icon/red.png',
    4: '/icon/black.png',
  };
  const iconSrc = gradeIcons[loadedUser.grade] || gradeIcons[1];
  const gradeText = {
    0: '관리자',
    1: '일반 회원',
    2: '활동 회원',
    3: '우수 회원',
    4: 'VIP 회원'
  }[loadedUser.grade] || '회원';

  const infoFields = [
    ['아이디', loadedUser.user_id, null],
    ['등급', loadedUser.grade, null],
    ['이름', loadedUser.name, 'name'],
    ['이메일', loadedUser.email, 'email'],
    ['전화번호', loadedUser.phone, 'phone'],
  ];

  return (
    <div className="flex w-screen h-[807px] bg-[#ffffff]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-24 bg-[#2e3a4e] flex flex-col justify-between items-center pt-4 pb-0 shadow-md">

        <button
          className="ham_btn mb-4 focus:outline-none"
          onClick={handleMenuToggle}>
          <div className="line" />
          <div className="line" />
          <div className="line" />  
        </button>
        <MegaMenu open={menuOpen} onClose={handleMenuToggle} />
        
        <hr className="w-24 border-gray-600 mb-4" />

        <nav className="flex-1 flex flex-col items-center justify-end space-y-6">

          <div className="relative group w-full">
           <button onClick={() => navigate('/mypage')} className="btn-underline w-full flex flex-col items-center py-2">
             <img src="/icon/info_white.png" alt="내 정보" className="w-7 h-7" />
             <span className="text-white text-sm mt-2">내 정보</span>
           </button>
          </div>
           {isAdmin && (
            <button onClick={() => navigate('/mypage/users')} className="btn_user btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">회원 목록</span>
            </button>          
          )}

          {isAdmin && (
            <button onClick={() => navigate('/admin/reports')} className="btn_report btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">신고 목록</span>
            </button>
          )}

          <button onClick={() => navigate('/mypage/bookmark')} className="btn-star btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">즐겨찾기</span>
          </button>

          <button onClick={() => navigate('/mypage/postlist')} className="btn-post btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 게시글</span>
          </button>

          <button onClick={() => navigate('/mypage/mytravel')} className="btn_plane btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 여행 일정</span>
          </button>
          
          {/* 관리자는 '문의 목록', 일반 회원은 '내 문의' */}
          <button
            onClick={() => navigate('/request/list')}
            className="btn_inquiry btn-underline w-full flex flex-col items-center py-2"
          >
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">
              {isAdmin ? '문의 목록' : '내 문의'}
            </span>
          </button>
          
          <span className="mb-2"></span>
        </nav>
        <button
          onClick={() => scrollRef.current.scrollTo({ top: 0, behavior: 'smooth'})}
          className="w-full p-6 flex justify-center bg-blue-300 transition-colors group">
          <img src={upIcon} alt="위로가기" 
          className="w-5 h-5 transform transition-transform duration-200 ease-in-out
                     group-hover:-translate-y-1" />
        </button>
      </aside>

      {/* ── 본문 ── */}  
      <section ref={scrollRef} className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40">
       <h2 className="text-3xl text-center font-bold mb-4">내 정보</h2>
        <div className="border-t border-gray-300 my-14" />

        {/* 👇 좌우 2컬럼 레이아웃 */}
        <div className="w-full max-w-6xl mx-auto flex gap-16">
          {/* 좌측: 프로필(사진 + 버튼) */}
          <div className="flex-none w-60 flex flex-col items-center mt-20 ">
            <img
              src={loadedUser.profileUrl || DEFAULT_PROFILE}
              alt="프로필"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <button
              onClick={openModal}
              className="mb-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              프로필 이미지 변경
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              기본 이미지로 초기화
            </button>
          </div>

          {/* 우측: 내 정보 + 비밀번호 변경 */}
          <div className="flex-1 pl-8">
            {/* 등급 아이콘 */}
            <div className="flex items-center mb-6 space-x-2">
              <img src={iconSrc} alt="" className="w-8 h-8" />
              <span className="text-xl font-medium">{gradeText}</span>
            </div>

            <div className="flex flex-col border-t border-b divide-y divide-gray-200">
              {infoFields.map(([label, value, fieldKey]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-4 hover:bg-gray-50 transition"
                >
                  <span className="text-gray-500 w-1/4">{label}</span>
                  <div className="flex-1 flex items-center justify-between">
                    {fieldKey && editField === fieldKey ? (
                      <input
                        type="text"
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                      />
                    ) : (
                      <span className="text-gray-900">
                        {label === '등급' ? gradeText : value}
                      </span>
                    )}

                    {fieldKey && (
                      editField === fieldKey ? (
                        <div className="space-x-2">
                          <button
                            onClick={handleSave}
                            disabled={!tempValue.trim()}
                            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditField('')}
                            className="px-3 py-1 bg-gray-400 text-white rounded"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditField(fieldKey);
                            setTempValue(value);
                          }}
                          className="p-1"
                        >
                          <img src="/icon/edit.png" alt="수정" className="w-5 h-5" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 비밀번호 변경 버튼 */}
            <div className="mt-6">
              <button
                onClick={() => setShowPwdFields(f => !f)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                {showPwdFields ? '변경 취소' : '비밀번호 변경'}
              </button>
            </div>

            {/* 비밀번호 폼 */}
            {showPwdFields && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  ['현재 비밀번호', currentPwd, setCurrentPwd, showCurrentPwd, setShowCurrentPwd],
                  ['새 비밀번호', newPwd, setNewPwd, showNewPwd, setShowNewPwd],
                  ['새 비밀번호 확인', newPwdConfirm, setNewPwdConfirm, showNewPwdConfirm, setShowNewPwdConfirm],
                ].map(([label, val, setter, visible, toggle], idx) => (
                  <div key={idx} className="relative">
                    <label className="block mb-1 text-sm">{label}</label>
                    <input
                      type={visible ? 'text' : 'password'}
                      value={val}
                      onChange={e => setter(e.target.value)}
                      className="border rounded px-3 py-2 pr-10 w-full"
                    />
                    <button
                      onClick={() => toggle(!visible)}
                      className="absolute right-3 bottom-3 text-sm"
                    >
                      {visible ? '🔓' : '🔒'}
                    </button>
                  </div>
                ))}
                <div className="col-span-3 text-right">
                  <button
                    onClick={changePassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 프로필 크롭 & 업로드 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
              {/* 헤더 */}
              <h3 className="text-2xl font-semibold mb-4 text-center">프로필 이미지 변경</h3>

              {/* 크롭 영역: 원형 마스크 + overflow-hidden */}
               <div className="relative w-80 h-80 bg-gray-200 overflow-hidden rounded-md mx-auto">
                <Cropper
                  image={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"     // ← 원형으로
                  showGrid={false}      // ← 격자선 제거
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* zoom 슬라이더 */}
              <div className="mt-4 px-4">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={e => setZoom(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* 파일 선택 & 크롭 확정 버튼 */}
              <div className="mt-6 flex justify-between px-4">
 
                {selectedFile && (
                  <button
                    onClick={showCroppedImage}
                    className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    자르기
                  </button>
                )}
              </div>

              {/* 업로드 / 취소 */}
              <div className="mt-4 flex justify-end space-x-2 px-4">
                <label
                  htmlFor="fileInput"
                  className="mr-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition"
                >
                  파일 선택
                </label>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  업로드
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                >
                  취소
                </button>
              </div>

              {/* 숨겨진 파일 인풋 */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyPage;