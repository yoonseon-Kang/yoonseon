import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

// const formVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0
//   },
//   transition: {
//     duration: 0.5
//   }
// };

// const inputVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: {
//     opacity: 1,
//     x: 0
//   },
//   transition: {
//     duration: 0.3
//   }
// };

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google 로그인 성공:', credentialResponse);
    setIsLoading(true);
    setError(null);

    try {
      // Google 토큰을 localStorage에 저장
      if (credentialResponse.credential) {
        localStorage.setItem('google_credential', credentialResponse.credential);
        localStorage.setItem('isLoggedIn', 'true');
      }

      // TODO: 백엔드로 토큰을 전송하고 사용자 정보를 받아오는 API 호출
      // const response = await api.post('/auth/google', { credential: credentialResponse.credential });

      // 새로운 사용자인 경우 추가 정보 입력 페이지로 이동
      navigate('/additional-info');

      // 기존 사용자인 경우 홈으로 이동
      // navigate('/home');
    } catch (error) {
      console.error('Google 로그인 처리 실패:', error);
      setError('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log('Google 로그인 실패');
    setError('구글 로그인 실패. 구글 계정이 없거나 로그인에 실패했습니다.');
  };
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 에러 메시지 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600 text-center">{error}</p>
        </motion.div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            로그인 처리 중...
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center"
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="signin_with"
          locale="ko"
        />
      </motion.div>
    </motion.div>
  );
};