import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../contexts/UserContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0
  },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20
  }
};

const AdditionalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUser();
  const { userInfo: googleUserInfo } = useGoogleAuth();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    birthDate: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 전역 상태에 사용자 정보 저장 (구글 로그인 정보 사용)
      const userInfo = {
        name: googleUserInfo.name || '홍길동',
        email: googleUserInfo.email || 'example@email.com',
        height: formData.height,
        weight: formData.weight,
        birthDate: formData.birthDate,
        address: formData.address,
        guardian: formData.guardianName ? {
          name: formData.guardianName,
          phone: formData.guardianPhone,
          relationship: formData.guardianRelationship
        } : undefined
      };

      setUserInfo(userInfo);
      console.log('추가 정보 저장:', userInfo);
      navigate('/home'); // 홈 페이지로 이동
    } catch (error) {
      console.error('추가 정보 저장 실패:', error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            추가 정보 입력
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            키, 몸무게, 생년월일, 거주지는 필수 입력 사항입니다
          </p>
          <p className="text-sm text-gray-500">
            보호자 정보는 선택적으로 입력하실 수 있습니다
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                생년월일
              </label>
              <Input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                키 (cm)
              </label>
              <Input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="170"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                몸무게 (kg)
              </label>
              <Input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="65"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                거주지
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="서울시 강남구"
                className="mt-1"
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">선택사항</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    보호자 이름
                  </label>
                  <Input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    placeholder="홍길동"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    보호자 연락처
                  </label>
                  <Input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    보호자 관계
                  </label>
                  <select
                    name="guardianRelationship"
                    value={formData.guardianRelationship}
                    onChange={handleChange}
                    className="mt-1 flex h-14 w-full rounded-lg border-2 border-neutral-300 bg-white px-4 py-3 pr-8 text-base text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none bg-no-repeat bg-right"
                    style={{
                      color: formData.guardianRelationship ? 'inherit' : '#a3a3a3',
                      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="">선택하세요</option>
                    <option value="부모">부모</option>
                    <option value="조부모">조부모</option>
                    <option value="친척">친척</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full flex justify-center"
              >
                시작하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdditionalInfoPage;
