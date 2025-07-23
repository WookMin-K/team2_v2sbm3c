import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../pages/Login';
import { useLoginContext } from '../contexts/LoginContext'; // ✅ 전역 로그인 Context 불러오기
import ChatbotWidget from './ChatbotWidget';

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

  // 로그아웃
  const handleLogoutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      // navigate('/');  // 로그아웃 후 홈으로
    }
  };

  // 로그인성공 콜백
  const handleLoginSuccess = () => {
    // 1) 모달 닫기
    setIsLoginOpen(false);

    // 2) redirectAfterLogin 처리
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl);
      return;
    }

    // 3) 보호된 페이지가 아니라면, 현재 페이지 그대로 유지
    navigate(location.pathname + location.search, { replace: true });
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
              <button onClick={() => navigate('/request/create')}>문의사항</button>
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
                sessionStorage.setItem('fromLogo', 'true');
                navigate('/');
              }}
            />
            <nav className="space-x-8 text-xl font-bold">
              <button onClick={handleStartClick}>일정 생성</button>
              <button onClick={() => navigate('/triplistregion')}>여행지</button>
              <button onClick={() => navigate('/post/list')}>게시판</button>
              <button onClick={() => navigate('/request/create')}>문의사항</button>
            </nav>
          </div>
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <main className='pt-[108px] px-0'>
        <Outlet />
      </main>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={handleSignUpClick}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 🌟 레이아웃을 쓰는 모든 페이지 하단에 항상 렌더링 */}
      <ChatbotWidget />
      
      {/* 하단 문구 */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 text-lg text-gray-500 z-40">
        모두를 위한 여행
      </footer>
    </div>
  );
};

export default Layout;
