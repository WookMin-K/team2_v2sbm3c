import React, { useEffect, useState, useRef, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';
import './MyPage.css';
import getCroppedImg from '../utils/cropImage';
import Cropper from 'react-easy-crop';

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

  // 등급 아이콘 & 등급명
  const iconSrc = gradeIcons[loadedUser.grade] || gradeIcons[1];

  return (
    <div className="flex w-screen h-[800px] bg-[#f4f5f7]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#3B3B58]">마이페이지</h2>
           <img  // ← 변경: 기본 프로필 처리도 guard 뒤로 이동
            src={loadedUser.profileUrl ?? DEFAULT_PROFILE}
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
        <div className="bg-white modal-box p-6">
          <h3 className="text-2xl font-bold mb-4">프로필 이미지 변경</h3>

          {/* 1. 업로드한 파일이 있으면 크롭퍼 띄우기 */}
          {selectedFile ? (
            <div className="relative w-80 h-80 bg-gray-200">
              <Cropper
                image={URL.createObjectURL(selectedFile)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <div className="w-80 h-80 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">이미지를 선택하세요</span>
            </div>
          )}

          {/* 2. 크롭 영역 확정 버튼 */}
          {selectedFile && (
            <button
              onClick={showCroppedImage}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              영역 선택 완료
            </button>
          )}

          {/* 3. 파일 입력 */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="mt-4 block text-center bg-[#AFC8E0] hover:bg-[#96B6D7] text-white px-4 py-2 rounded cursor-pointer"
          >
            파일 선택
          </label>

          {/* 4. 업로드 / 취소 */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              업로드
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
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