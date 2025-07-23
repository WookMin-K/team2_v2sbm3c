import React, { useEffect } from 'react';

const OAuth2RedirectHandler = () => {
  useEffect(() => {
    // 부모창에 메시지 보내기
    window.opener.postMessage('OAUTH2_SIGNUP_SUCCESS', window.location.origin);
    // 팝업 창 닫기
    window.close();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
      }}
    >
      로그인 처리 중입니다...
    </div>
  );
};

export default OAuth2RedirectHandler;
