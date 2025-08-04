import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';

const Login = ({ isOpen, onClose, onSignUpClick, onLoginSuccess }) => {
  const { login } = useLoginContext();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 관리자 테스트 계정 (클릭 시 입력값 자동 입력)
  const TEST_ACCOUNT = {
    user_id: 'admin01',
    password: '1234'
  };

  // 저장된 아이디 자동 입력
  useEffect(() => {
    const savedId = localStorage.getItem('savedUserId');
    if (savedId) {
      setUserId(savedId);
      setRememberId(true);
    }
  }, []);

  // SNS Oauth2 팝업에서 로그인 성공 시 처리
  useEffect(() => {
    const handleMessage = (e) => {
      // 출처 검사
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'OAUTH2_LOGIN_SUCCESS') {
        const { user_no, user_id, name, grade } = e.data.payload;
        // 1) 컨텍스트에 로그인 상태 저장
        login({ user_no, user_id, name, grade });
        // 2) 부모 컴포넌트 콜백 (필요에 따라 화면 이동 등)
        onLoginSuccess?.(e.data.payload);
        onClose();
      } else if (e.data === 'OAUTH2_LOGIN_FAILURE') {
        alert('소셜 로그인 실패');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, onClose, onLoginSuccess]);

  if (!isOpen) return null;

  

  // 일반(아이디/비밀번호) 로그인
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('/users/login', {
        user_id: userId,
        password: password
      },{
        headers: {'Content-Type': 'application/json'},
        withCredentials: true, 
      });

      // 로그인 성공 시
      if (res.data.status === 'success' && res.data.user) {
        const user = res.data.user;
        login({
          user_no: user.user_no,
          name: user.name,
          user_id: user.user_id,
          grade: Number(user.grade),
        });
        // payload도 일치시켜 전달
        const payload = {
          name: user.name,
          no: user.user_no,
          grade: Number(user.grade),
        };

        // 아이디 저장
        if (rememberId) {
          localStorage.setItem('savedUserId', userId);
        } else {
          localStorage.removeItem('savedUserId');
        }

        alert(`${user.name}님 환영합니다!`);
        onLoginSuccess?.(payload);
        onClose();
      } else {
        setError(res.data.message || '로그인 실패');
      }
    } catch (err) {
      setError(err.response?.data?.message || '서버 오류가 발생했습니다.');
      console.error('❌ 서버 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜로그인 버튼
  const handleSocialLogin = (provider) => {
    let url = `http://121.78.128.95:9093/oauth2/authorization/${provider}`;
    if (provider === 'google') url += '?prompt=select_account';
    if (provider === 'naver') url += '?auth_type=reprompt';
    if (provider === 'kakao') url += '?prompt=login';
    window.open(url, '_blank', 'width=500,height=600,left=200,top=100');
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {isLoading && (
          <div className="login-loading-overlay">
            <div className="login-loading-text">로그인 처리 중입니다...</div>
          </div>
        )}

        <button className="login-close" onClick={onClose}>×</button>
        <h2 className="login-title">로그인</h2>

        {/* 아이디 입력 */}
        <input
          type="text"
          placeholder="아이디"
          className="login-input"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              document.getElementById('password').focus();
            }
          }}
        />

        {/* 아이디 저장 */}
        <div className="login-save-row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberId}
              onChange={(e) => setRememberId(e.target.checked)}
            />
            아이디 저장
          </label>
        </div>

        {/* 비밀번호 입력 */}
        <input
          id="password"
          type="password"
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        />

        {/* 로그인 버튼 */}
        <button className="login-button" onClick={handleLogin}>로그인</button>

        {/* 관리자 테스트 계정 */}
        <button
          className="login-test-btn"
          onClick={() => {
            setUserId(TEST_ACCOUNT.user_id);
            setPassword(TEST_ACCOUNT.password);
          }}
        >
          관리자 테스트 계정
        </button>

        {/* SNS(소셜) 로그인 */}
        <div className="social-login" style={{ flexDirection: 'row' }}>
          {/* 네이버 */}
          <button
            type="button"
            className="naver-login-btn"
            onClick={() => handleSocialLogin('naver')}
          >
            <img src="/images/Naver_btn.png" alt="네이버 로그인" className="w-14" />
          </button>
          {/* 카카오 */}
          <button
            type="button"
            className="kakao-login-btn"
            onClick={() => handleSocialLogin('kakao')}
          >
            <img src="/images/Kakao_btn.png" alt="카카오 로그인" className="w-14" />
          </button>
          {/* 구글 */}
          <button
            className="gsi-material-button"
            onClick={() => handleSocialLogin('google')}
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <img src="/images/Google_btn.png" alt="Google" />
              </div>
            </div>
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="login-error">{error}</div>}

        {/* 하단 버튼 */}
        <div className="login-bottom-row">
          <button className="login-sub-btn" onClick={onSignUpClick}>회원가입</button>
          <span style={{ margin: '0 8px' }}>|</span>
          <button className="login-sub-btn">아이디 찾기</button>
          <span style={{ margin: '0 8px' }}>|</span>
          <button className="login-sub-btn">비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
