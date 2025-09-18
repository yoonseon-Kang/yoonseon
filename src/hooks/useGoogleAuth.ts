import { useState, useEffect } from 'react';

interface GoogleUserInfo {
  name?: string;
  email?: string;
  picture?: string;
}

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState<GoogleUserInfo>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // localStorage에서 Google 토큰 확인
    const googleCredential = localStorage.getItem('google_credential');
    if (googleCredential) {
      try {
        // JWT 토큰을 디코딩하여 사용자 정보 추출 (UTF-8 지원)
        const base64Payload = googleCredential.split('.')[1];
        // base64 패딩 추가 (필요시)
        const paddedBase64 = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4);
        // UTF-8 디코딩을 위한 방법
        const binaryString = atob(paddedBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decodedString = new TextDecoder('utf-8').decode(bytes);
        const payload = JSON.parse(decodedString);

        console.log('디코딩된 Google 사용자 정보:', payload);

        setUserInfo({
          name: payload.name,
          email: payload.email,
          picture: payload.picture
        });
      } catch (error) {
        console.error('Google 토큰 디코딩 실패:', error);
        // 토큰이 유효하지 않은 경우 기본값 설정
        setUserInfo({
          name: '홍길동',
          email: 'hongkildong@gmail.com'
        });
      }
    } else {
      // 토큰이 없는 경우 기본값 설정
      setUserInfo({
        name: '홍길동',
        email: 'hongkildong@gmail.com'
      });
    }
  }, []);

  return { userInfo, isLoading };
};