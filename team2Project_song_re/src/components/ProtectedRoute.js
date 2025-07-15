import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';

const ProtectedRoute = ({ children }) => {
  const { loginUser } = useLoginContext();
  const location = useLocation();

  // 1. Context 초기화 중이면 렌더링 지연
  if (loginUser === null) {
    return null; // 또는 로딩 스피너 출력 가능
  }

  // 2. 로그인 안 된 상태 → 차단 + 리다이렉트
  if (!loginUser) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    console.log("🔒 ProtectedRoute → 접근 차단됨. 로그인 필요:", location.pathname);
    return <Navigate to="/" replace state={{ fromProtected: true }} />;
  }

  // 3. 로그인 되어 있으면 원래 컴포넌트 렌더
  return children;
};

export default ProtectedRoute;
