import React, { useEffect } from 'react';
import axios from 'axios';

const OAuth2RedirectHandler = () => {
  useEffect(() => {
    // 1) 백엔드에서 로그인된 유저 정보 가져오기
    axios.get('/users/me', { withCredentials: true })
      .then(res => {
        const user = res.data;
        if (user && user.user_no) {
          // 2) 부모창에 로그인 성공 메시지와 페이로드 전달
          window.opener.postMessage(
            { type: 'OAUTH2_LOGIN_SUCCESS', payload: {
                user_no: user.user_no,
                name:    user.name,
                user_id: user.user_id,
                grade:   Number(user.grade),
              }
            },
            window.location.origin
          );
        } else {
          window.opener.postMessage(
            { type: 'OAUTH2_LOGIN_FAILURE' },
            window.location.origin
          );
        }
      })
      .catch(() => {
        window.opener.postMessage(
          { type: 'OAUTH2_LOGIN_FAILURE' },
          window.location.origin
        );
      })
      .finally(() => {
        // 3) 팝업 창 닫기
        window.close();
      });
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
