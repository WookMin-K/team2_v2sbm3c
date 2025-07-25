import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from '../contexts/LoginContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  const navigate = useNavigate(); // 페이지 이동을 위한 함수 생성
  const { login } = useLoginContext(); // 로그인 상태 업데이트

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 팝업에서 소셜 로그인 성공 시 메시지 수신
  useEffect(() => {
    const handleMessage = (e) => {
      // 출처 검사
      if (e.origin !== window.location.origin) return;

      if (e.data?.type === 'OAUTH2_LOGIN_SUCCESS') {
        const { user_no, user_id, name, grade } = e.data.payload;
        // 1) Context에 로그인 정보 저장
        login({ user_no, user_id, name, grade });
        // 2) 메인 페이지로 바로 이동
        navigate('/');
      }
      else if (e.data?.type === 'OAUTH2_LOGIN_FAILURE') {
        alert('소셜 회원가입(로그인)에 실패했습니다.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, navigate]);

  // 인풋 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 가입 버튼 클릭 처리
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // 필수 항목 누락 시 안내
    if (!formData.user_id.trim()) {
    alert('🛑 아이디를 입력해주세요.');
    return;
    }
    if (!formData.password.trim()) {
      alert('🛑 비밀번호를 입력해주세요.');
      return;
    }
    if (!passwordConfirm.trim()) {
      alert('🛑 비밀번호 확인을 입력해주세요.');
      return;
    }
    if (!formData.email.trim()) {
      alert('🛑 이메일을 입력해주세요.');
      return;
    }
    if (!formData.name.trim()) {
      alert('🛑 이름을 입력해주세요.');
      return;
    }

    // 비밀번호 일치 여부 확인
    if (formData.password !== passwordConfirm) {
      alert('❌ 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 3) 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('유효한 이메일 주소를 입력해주세요. (예: abc@def.com)');
      return;
    }

    // 4) 비밀번호 복잡도 검증
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!pwdRegex.test(formData.password)) {
      alert(
        '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.'
      );
      return;
    }

    // 5) 연락처 형식 검증 (010-0000-0000)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('연락처는 010-0000-0000 형식으로 입력해주세요.');
      return;
    }

    // 6) 성명 최소 길이 검증
    if (formData.name.trim().length < 2) {
      alert('성명은 2자 이상 입력해주세요.');
      return;
    }

    console.log('보내는 URL:', '/users/create');

    // 검증 모두 통과했으면 서버에 전송
    try {
      const response = await fetch('/users/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
      throw new Error('❌ 서버에서 응답을 받지 못했습니다.');
    }

      const result = await response.json();
      console.log(result);
      if (result.status === 'success') {
        alert(`✅ ${result.name}님, 회원가입 성공!`);
        navigate('/');
      } else if (result.status === 'duplicate') {
        alert('❌ 이미 존재하는 아이디입니다.');
      } else if (result.status === 'email_duplicate') {
        alert('❌ 이미 사용 중인 이메일입니다.');
      } else {
        alert('❌ 회원가입 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      alert('❌ 서버 연결 실패');
    }
  };

  const handleSocialLogin = (provider) => {
    let url = `http://192.168.12.142:9093/oauth2/authorization/${provider}`;

    if (provider === 'google') {
      url += '?prompt=select_account';
    } else if (provider === 'naver') {
      url += '?auth_type=reprompt';
    } else if (provider === 'kakao') {
      url += '?prompt=login';
    }

    window.open(url, '_blank', 'width=500,height=600,left=200,top=100');
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0,11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return digits.replace(/(\d{3})(\d+)/, '$1-$2');
    return digits.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 mt-10">
      <div className="bg-white p-14 rounded-lg shadow-md w-[800px]">
        <h2 className="text-2xl font-bold text-center mb-10">회원가입</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">아이디</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="아이디"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="이메일"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
                title="영문 대소문자 · 숫자 · 특수문자 포함, 최소 8자 이상이어야 합니다."
                required
                className="w-full border px-3 py-2 rounded"
                placeholder="비밀번호"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">연락처</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: formatPhone(e.target.value) })
              }
              pattern="^010-\d{4}-\d{4}$"
              title="010-0000-0000 형식으로 입력해 주세요."
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="010-1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? '🔓' : '🔒'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">성명</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength={2}
              title="2자 이상 입력해 주세요."
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="홍길동"
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <form onSubmit={handleSubmit}>
            <button type="submit" className="signup-submit-btn">
              가입하기
            </button>
          </form>
        </div>

        {/* 소셜 로그인 버튼 */}
        {/* <div className="mt-4">
          <div className="social-login">
            <button
              type="button"
              className="signup-social-btn naver"
              onClick={() => handleSocialLogin('naver')}
            >
              <img src="/images/Naver_btn.png" alt="네이버 회원가입" />
              네이버 계정으로 가입하기
            </button> */}

            {/* <button
              type="button"
              className="signup-social-btn kakao"
              onClick={() => handleSocialLogin('kakao')}
            >
              <img src="/images/Kakao_btn.png" alt="카카오 회원가입" />
              카카오 계정으로 가입하기
            </button> */}

            {/* 구글 */}
            {/* <button
              type="button"
              className="signup-social-btn google"
              onClick={() => handleSocialLogin('google')}
            >
              <img src="/images/Google_btn.png" alt="구글 회원가입" />
              Google 계정으로 가입하기
            </button> */}
          {/* </div>
        </div> */}
      </div>
    </div>
  );
};

export default SignUp;
