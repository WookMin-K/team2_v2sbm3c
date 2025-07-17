import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, setIsLoginOpen } = useLoginContext();
  const location = useLocation();

// ↓ 로그인 상태가 false라면 바로 모달 띄우기
useEffect(() => {
  if (!isLoggedIn) {
    alert("로그인이 필요한 페이지입니다!");
    // 로그인 모달을 열고
    setIsLoginOpen(true);
    // 로그인 후 리다이렉트할 경로를 저장
    sessionStorage.setItem(
      'redirectAfterLogin',
      location.pathname + location.search
    );
  }
}, [isLoggedIn, location, setIsLoginOpen]);

// 로그인 전에는 아무것도 렌더링하지 않음
if (!isLoggedIn) return null;

  // 3. 로그인 되어 있으면 원래 컴포넌트 렌더
  return children;
};

export default ProtectedRoute;
