import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  const navigate = useNavigate(); // 페이지 이동을 위한 함수 생성

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 인풋 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 가입 버튼 클릭 처리
  const handleSubmit = async () => {

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
    console.log('보내는 URL:', '/users/create');
    try {

      const response = await fetch('/users/create', {

        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(formData),
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

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="bg-white shadow-lg p-10 w-full max-w-3xl rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

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
                className="w-full border px-3 py-2 rounded"
                placeholder="비밀번호"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '숨기기' : '보기'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">연락처</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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
                {showPasswordConfirm ? '숨기기' : '보기'}
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
              className="w-full border px-3 py-2 rounded"
              placeholder="홍길동"
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <button onClick={handleSubmit} className="SignUp-button">
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


// import React, { useState } from 'react';
// import './Login.css';
// import axios from 'axios';
// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     user_id: '',
//     password: '',
//     name: '',
//     email: '',
//     phone: '',
//   });

//   const [passwordConfirm, setPasswordConfirm] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

//   // 인풋 변경 처리
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // 가입 버튼 클릭 처리
//   const handleSubmit = async () => {
//     if (formData.password !== passwordConfirm) {
//       alert('❌ 비밀번호가 일치하지 않습니다.');
//       return;
//     }
//     console.log('보내는 URL:', '/users/create');
//     try {

//       const response = await fetch('/users/create', {

//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       console.log(result);
//       if (result.status === 'success') {
//         alert(`✅ ${result.name}님, 회원가입 성공!`);
//       } else if (result.status === 'duplicate') {
//         alert('❌ 이미 존재하는 아이디입니다.');
//       } else {
//         alert('❌ 회원가입 실패. 다시 시도해주세요.');
//       }
//     } catch (error) {
//       console.error('에러 발생:', error);
//       alert('❌ 서버 연결 실패');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-start">
//       <div className="bg-white shadow-lg p-10 w-full max-w-3xl rounded-lg">
//         <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">아이디</label>
//             <input
//               type="text"
//               name="user_id"
//               value={formData.user_id}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               placeholder="아이디"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">이메일</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               placeholder="이메일"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">비밀번호</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded"
//                 placeholder="비밀번호"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? '숨기기' : '보기'}
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">연락처</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               placeholder="010-1234-5678"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
//             <div className="relative">
//               <input
//                 type={showPasswordConfirm ? 'text' : 'password'}
//                 value={passwordConfirm}
//                 onChange={(e) => setPasswordConfirm(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 placeholder="비밀번호 확인"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
//                 onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
//               >
//                 {showPasswordConfirm ? '숨기기' : '보기'}
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">성명</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               placeholder="홍길동"
//             />
//           </div>
//         </div>

//         <div className="text-center mt-8">
//           <button onClick={handleSubmit} className="SignUp-button">
//             가입하기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


