import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../pages/Login';
import { useLoginContext } from '../contexts/LoginContext';
import VSQuestionModal from '../components/recommend/VSQuestionModal'; // ✅ 추가

const MainPage = () => {
  const [stage, setStage] = useState(0);
  const mainRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLoggedIn,
    loginUser,
    login,
    logout,
    isLoginOpen,
    setIsLoginOpen
  } = useLoginContext();

  const userName = loginUser?.name;
  const [showRecommend, setShowRecommend] = useState(false); // ✅ 팝업 상태 추가

  const handleLoginSuccessMain = () => {
    setStage(2);
    setIsLoginOpen(false);

    const prevPath = sessionStorage.getItem('postLogoutPath');
    if (prevPath) {
      sessionStorage.removeItem('postLogoutPath');
      if (window.confirm('로그인 후 이전 페이지로 돌아가시겠습니까?')) {
        navigate(prevPath);
        return;
      }
    }

    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl);
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      sessionStorage.setItem('postLogoutPath', location.pathname);
      logout();
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.deltaY > 0 && stage < 2) {
        setStage((prev) => prev + 1);
      } else if (e.deltaY < 0 && stage > 0) {
        setStage((prev) => prev - 1);
      }
    };
    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [stage]);

  useEffect(() => {
    if (sessionStorage.getItem('fromLogo') === 'true') {
      setStage(2);
      sessionStorage.removeItem('fromLogo');
    } else if (location.state?.fromProtected) {
      setStage(2);
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      setStage(0);
    }
  }, [location.state, location.pathname, navigate]);

  const handleSignUpClick = () => {
    setIsLoginOpen(false);
    navigate('/users/signup');
  };

  const handleStartClick = () => {
    if (isLoggedIn) {
      navigate('/schedule');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/schedule');
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {(stage === 0 || stage === 1) && (
        <div className={`w-screen h-screen transition-colors duration-[1500ms] ease-in-out ${stage === 1 ? 'bg-[#F4F5F7]' : 'bg-black/40'} relative`}>
          {stage === 0 && (
            <video className="absolute top-0 left-0 w-full h-full object-cover -z-10" src="/video/intro4.mp4" autoPlay muted loop playsInline />
          )}

          <div className={`absolute z-30 transition-all duration-[1500ms] ease-in-out ${stage === 1 ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[2]' : 'top-6 left-1/2 transform -translate-x-1/2 scale-100'}`}>
            <img src="/logo.png" alt="logo" className="w-[50px] md:w-[90px]" />
          </div>

          {stage === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white">
              <p className="text-3xl md:text-3xl font-bold">모두를 위한 여행</p>
            </div>
          )}
        </div>
      )}

      {stage === 2 && (
        <div ref={mainRef} className="w-screen h-screen bg-[#F4F5F7] flex flex-col items-center justify-start px-6 pt-6 animate-fade-in">
          <header className="w-screen shadow fixed top-0 left-0 z-50">
            <div className="w-full h-10 bg-[#2e3a4e] text-white text-sm flex justify-between items-center px-10 relative overflow-visible">
              <img src="/logo_white.png" alt="trAveI 로고" className="h-12 absolute left-1/2 -translate-x-1/2" />
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
                    <button onClick={() => navigate('/users/signup')}>회원가입</button>
                  </>
                )}
                <span className="menu_divide">│</span>
                <button onClick={() => navigate('/notice')}>공지사항</button>
              </div>
            </div>

            <div className="w-full bg-[#F4F5F7] text-[#3B3B58] py-4 flex justify-between items-center px-10">
              <img src="/logo.png" alt="logo" className="h-8 cursor-pointer" onClick={() => {
                sessionStorage.setItem('fromLogo', 'true');
                navigate('/');
              }} />
              <nav className="space-x-8 text-xl font-bold">
                <button onClick={handleStartClick}>일정 생성</button>
                <button onClick={() => navigate('/triplistregion')}>여행지</button>
                <button onClick={() => navigate('/post/list')}>게시판</button>
              </nav>
            </div>
          </header>

          <main className="flex w-full max-w-7xl min-h-[calc(115vh-104px)] items-center justify-center gap-20">
            <div className="text-left flex flex-col justify-center">
              <p className="text-5xl md:text-5xl font-bold leading-snug mb-10">
                당신만을 위한<br />여행 플래너
              </p>

              {/* ✅ AI 추천 팝업 트리거 버튼 */}
              <button onClick={() => setShowRecommend(true)} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full text-xl w-[260px] mb-6">
                AI 여행 추천 받기 ✨
              </button>

              {/* ✅ 추천 모달 */}
              {showRecommend && (
                <VSQuestionModal onClose={() => setShowRecommend(false)} />
              )}

              <button onClick={handleStartClick} className="bg-[#2e3a4e] text-white px-6 py-3 rounded shadow text-2xl w-[260px] flex items-center justify-center">
                <img src="/logo_white.png" alt="trAveI 로고" className="h-[75px] object-contain mr-1" />
                <span>시작하기</span>
              </button>
            </div>
            <div className="bg-gray-200 w-[700px] h-[420px] shadow-inner overflow-hidden">
              <video className="w-full h-full object-cover" src="/video/intro4.mp4" autoPlay muted loop playsInline />
            </div>
          </main>

          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSignUpClick={handleSignUpClick}
            onLoginSuccess={handleLoginSuccessMain}
          />

          <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 text-lg text-gray-500 z-40">
            모두를 위한 여행
          </footer>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MainPage;
