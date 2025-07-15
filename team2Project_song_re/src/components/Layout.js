import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../pages/Login';
import { useLoginContext } from '../contexts/LoginContext'; // ✅ 전역 로그인 Context 불러오기

// ProtectedRoute로 감싼 경로 목록
const protectedPaths = ['/mypage', '/schedule', '/post/create'];


  // 현재 경로가 Protected인지 체크
function isProtected(pathname) {
  return protectedPaths.some(p => pathname.startsWith(p));
}

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUpPage = location.pathname === '/users/signup';
  const isSchedulePage = location.pathname.startsWith('/schedule');



  const {
    isLoggedIn,
    userName,
    login,
    logout,
    isLoginOpen,
    setIsLoginOpen
  } = useLoginContext(); // ✅ Context 값 구조 분해

  // 회원가입 페이지로 이동
  const handleSignUpClick = () => {
    setIsLoginOpen(false);
    navigate('/users/signup');
  };

  // 일정 생성 버튼 클릭 시 로그인 여부 체크
  const handleStartClick = () => {
    if (isLoggedIn) {
      navigate('/schedule');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/schedule');
      setIsLoginOpen(true);
    }
  };

  // Layout 전용 로그아웃 핸들러
    const handleLogoutClick = () => {
    // ProtectedRoute 페이지라면
    if (isProtected(location.pathname)) {
      // 1) 물어보고
      if (!window.confirm('로그아웃하시면 메인페이지로 이동합니다. 계속하시겠습니까?')) {
        return; 
      }
      // 2) 로그아웃 전에 현재 경로만 저장
      sessionStorage.setItem('postLogoutPath', location.pathname);
      sessionStorage.setItem('postLogoutUser', userName);
      logout();
      navigate('/');
      return;
    }

    // 일반 페이지라면: 단순 로그아웃만
      logout();
    };
    
  // 로그인 성공 콜백
  const handleLoginSuccess = ({ name: loginName, no, grade }) => {
    // 1) Context 업데이트
    login({ name: loginName, no, grade });

    // 1) 만약 로그아웃 당시 ProtectedRoute 경로가 남아 있으면
    const prevPath = sessionStorage.getItem('postLogoutPath');
    const prevUser = sessionStorage.getItem('postLogoutUser');
    
    if (prevPath && prevUser === loginName) {
      sessionStorage.removeItem('postLogoutPath');
      sessionStorage.removeItem('postLogoutUser');
      // 같은 사용자라면 물어보고, 아니면 그냥 닫기
      if (window.confirm('로그인 후 이전 페이지로 돌아가시겠습니까?')) {
        navigate(prevPath);
        return;
      }
    }

    // 3) redirectAfterLogin 처리 (기존 로직)
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl);
      return;
    }

    // 4) 그 외엔 모달 닫고 현재 페이지 유지
    setIsLoginOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] flex flex-col animate-slide-up">
      {isSignUpPage ? (
        <header className="w-screen shadow fixed top-0 left-0 z-50">
          {/* 회원가입 전용 상단 바 */}
          <div className="w-full h-10 bg-[#2e3a4e] text-white text-sm flex justify-between items-center px-10 relative overflow-visible">
            <img
              src="/logo_white.png"
              alt="trAveI 로고"
              className="h-12 absolute left-1/2 -translate-x-1/2"
            />
            <div className="space-x-4 text-base ml-auto">
              <button onClick={() => navigate('/')}>홈</button>
              <span className="menu_divide">│</span>
              <button onClick={() => navigate('/notice')}>공지사항</button>
            </div>
          </div>

          {/* 하단 바 */}
          <div className="w-full bg-[#F4F5F7] text-[#3B3B58] py-4 flex justify-between items-center px-10">
            <img
              src="/logo.png"
              alt="logo"
              className="h-8 cursor-pointer"
              onClick={() => {
                navigate('/');
              }}
            />
            <nav className="space-x-8 text-xl font-bold">
              <button onClick={handleStartClick}>일정 생성</button>
              <button onClick={() => navigate('/triplistregion')}>여행지</button>
              <button onClick={() => navigate('/post/list')}>게시판</button>
            </nav>
          </div>
        </header>
      ) : (
        <header className="w-screen shadow fixed top-0 left-0 z-50">
          {/* 상단 바 */}
          <div className="w-full h-10 bg-[#2e3a4e] text-white text-sm flex justify-between items-center px-10 relative overflow-visible">
            <img
              src="/logo_white.png"
              alt="trAveI 로고"
              className="h-12 absolute left-1/2 -translate-x-1/2"
            />
            <div className="space-x-4 text-base ml-auto">
              {isLoggedIn ? (
                <>
                  <span>{userName} 님</span>
                  <span className="menu_divide">│</span>
                  <button onClick={handleLogoutClick}>로그아웃</button>
                  <span className="menu_divide">│</span>
                  <button onClick={() => navigate('/mypage')}>마이페이지</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsLoginOpen(true)}>로그인</button>
                  <span className="menu_divide">│</span>
                  <button onClick={handleSignUpClick}>회원가입</button>
                </>
              )}
              <span className="menu_divide">│</span>
              <button onClick={() => navigate('/notice')}>공지사항</button>
            </div>
          </div>

          {/* 하단 바 */}
          <div className="w-full bg-[#F4F5F7] text-[#3B3B58] py-4 flex justify-between items-center px-10">
            <img
              src="/logo.png"
              alt="logo"
              className="h-8 cursor-pointer"
              onClick={() => {
                navigate('/');
              }}
            />
            <nav className="space-x-8 text-xl font-bold">
              <button onClick={handleStartClick}>일정 생성</button>
              <button onClick={() => navigate('/triplistregion')}>여행지</button>
              <button onClick={() => navigate('/post/list')}>게시판</button>
            </nav>
          </div>
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <main className={`${isSchedulePage ? 'pt-24' : 'pt-[120px]'} flex-1 w-full px-6`}>
        <Outlet />
      </main>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={handleSignUpClick}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 하단 문구 */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 text-lg text-gray-500 z-40">
        모두를 위한 여행
      </footer>
    </div>
  );
};

export default Layout;
