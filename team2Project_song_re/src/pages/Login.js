import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useLoginContext } from '../contexts/LoginContext';

const Login = ({ isOpen, onClose, onSignUpClick, onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useLoginContext();

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        '/users/login',
        { user_id: userId, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('🔐 로그인 응답:', res.data);

      if (res.data.status === 'success' && res.data.user) {
        const user = res.data.user;

        // ✅ Context login에 맞는 객체
        login({
          user_no: user.user_no,
          name: user.name,
          user_id: user.user_id,
          grade: Number(user.grade),
        });

        // ✅ team props를 위한 payload
        const payload = {
          name: user.name,
          no: user.user_no,
          grade: Number(user.grade),
        };

        alert(`${user.name}님 환영합니다!`);
        onLoginSuccess?.(payload); // null-safe
        onClose();
      } else {
        setError(res.data.message || '로그인 실패');
      }
    } catch (err) {
      console.error('❌ 서버 오류:', err);
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>×</button>

        <h2 className="login-title">로그인</h2>

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

        <input
          id="password"
          type="password"
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />

        <button className="login-button" onClick={handleLogin}>로그인</button>

        {error && <div className="login-error">{error}</div>}

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
