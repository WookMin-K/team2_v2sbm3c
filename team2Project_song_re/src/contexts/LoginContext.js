// contexts/LoginContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  // ✅ loginUser 기반 구조 (건우 방식)
  const [loginUser, setLoginUser] = useState(() => {
    const stored = sessionStorage.getItem('loginUser');
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ 각각의 필드 제공 (팀 방식)
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || '');
  const [userNo, setUserNo] = useState(() => sessionStorage.getItem('userNo') || '');
  const [grade, setGrade] = useState(() => sessionStorage.getItem('grade') || '');

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // ✅ loginUser 또는 필드값 변경 시 sessionStorage 동기화
  useEffect(() => {
    if (loginUser) {
      sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
      sessionStorage.setItem('userName', loginUser.name);
      sessionStorage.setItem('userNo', loginUser.user_no);
      sessionStorage.setItem('grade', loginUser.grade);
      sessionStorage.setItem('isLoggedIn', 'true');

      setUserName(loginUser.name);
      setUserNo(loginUser.user_no);
      setGrade(loginUser.grade);
      setIsLoggedIn(true);
    } else {
      sessionStorage.removeItem('loginUser');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userNo');
      sessionStorage.removeItem('grade');
      sessionStorage.setItem('isLoggedIn', 'false');

      setUserName('');
      setUserNo('');
      setGrade('');
      setIsLoggedIn(false);
    }
  }, [loginUser]);

  const login = (user) => {
    if (!user || typeof user !== 'object') {
      console.warn("⚠️ login() 파라미터는 user 객체여야 합니다:", user);
      return;
    }

    // 예: { user_no: 1, name: '관리자', grade: 0 }
    setLoginUser(user);
  };

  const logout = () => {
    console.log("🚪 로그아웃 실행");
    setLoginUser(null);
    alert('로그아웃 되었습니다!');
  };

  return (
    <LoginContext.Provider
      value={{
        loginUser,         // ✅ 우리 방식
        isLoggedIn,        // ✅ 팀 방식
        userName,
        userNo,
        grade,
        login,
        logout,
        isLoginOpen,
        setIsLoginOpen,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => useContext(LoginContext);
