import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../contexts/UserContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

// const pageVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: {
//     opacity: 1,
//     y: 0
//   },
//   transition: {
//     type: "spring",
//     stiffness: 260,
//     damping: 20
//   }
// };

const AdditionalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUser();
  const { userInfo: googleUserInfo } = useGoogleAuth();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    birthDate: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 만 나이 계산 함수
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age.toString();
  };

  // 유효성 검사 함수들
  const validateBirthDate = (date: string) => {
    if (!date) return '생년월일을 선택해주세요';
    return '';
  };

  const validateHeight = (height: string) => {
    if (!height) return '키를 입력해주세요';
    const num = parseFloat(height);
    if (isNaN(num) || num <= 0) return '숫자만 입력하도록 검사';
    return '';
  };

  const validateWeight = (weight: string) => {
    if (!weight) return '몸무게를 입력해주세요';
    const num = parseFloat(weight);
    if (isNaN(num) || num <= 0) return '숫자만 입력하도록 검사';
    return '';
  };

  const validateAge = (age: string) => {
    if (!age) return '나이를 입력해주세요';
    const num = parseInt(age);
    if (isNaN(num) || num <= 0 || num > 150) return '올바른 나이를 입력해주세요 (1-150세)';
    return '';
  };

  const validateAddress = (address: string) => {
    if (!address) return '거주지를 입력해주세요';

    // 시/도와 구/군 형식 검증
    const addressPattern = /^(.+?)(시|도|특별시|광역시|특별자치시|특별자치도)\s+(.+?)(구|군|시)$/;
    const match = address.match(addressPattern);

    if (!match) {
      return '시/도와 구/군 형식으로 입력해주세요 (예: 서울시 강남구)';
    }

    const city = match[1] + match[2];
    const district = match[3] + match[4];

    // 유효하지 않은 조합 검증
    const invalidCombinations = [
      { city: '세종특별자치시', districts: ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '중구', '종로구'] },
      { city: '제주특별자치도', districts: ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '중구', '종로구'] }
    ];

    for (const combo of invalidCombinations) {
      if (city === combo.city && combo.districts.includes(district)) {
        return `${city}에는 ${district}가 없습니다`;
      }
    }

    return '';
  };

  const validateGuardianName = (name: string) => {
    if (name && !/^[가-힣]+$/.test(name)) {
      return '보호자 이름을 입력해주세요';
    }
    return '';
  };

  const validateGuardianPhone = (phone: string) => {
    if (phone && !/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
      return '전화번호에 하이픈(-)을 포함해주세요';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 생년월일이 변경되면 자동으로 나이 계산
    if (name === 'birthDate') {
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        age: calculatedAge
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // 실시간 유효성 검사
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    let error = '';
    switch (name) {
      case 'birthDate':
        error = validateBirthDate(value);
        break;
      case 'height':
        error = validateHeight(value);
        break;
      case 'weight':
        error = validateWeight(value);
        break;
      case 'age':
        error = validateAge(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'guardianName':
        error = validateGuardianName(value);
        break;
      case 'guardianPhone':
        error = validateGuardianPhone(value);
        break;
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 유효성 검사
    const newErrors: {[key: string]: string} = {};

    // 필수 항목 검사
    const birthDateError = validateBirthDate(formData.birthDate);
    if (birthDateError) newErrors.birthDate = birthDateError;

    const heightError = validateHeight(formData.height);
    if (heightError) newErrors.height = heightError;

    const weightError = validateWeight(formData.weight);
    if (weightError) newErrors.weight = weightError;

    const ageError = validateAge(formData.age);
    if (ageError) newErrors.age = ageError;

    const addressError = validateAddress(formData.address);
    if (addressError) newErrors.address = addressError;

    // 선택 항목 검사 (입력된 경우에만)
    if (formData.guardianName) {
      const guardianNameError = validateGuardianName(formData.guardianName);
      if (guardianNameError) newErrors.guardianName = guardianNameError;
    }

    if (formData.guardianPhone) {
      const guardianPhoneError = validateGuardianPhone(formData.guardianPhone);
      if (guardianPhoneError) newErrors.guardianPhone = guardianPhoneError;
    }

    // 보호자 정보 완성도 검사
    const hasGuardianInfo = formData.guardianName || formData.guardianPhone || formData.guardianRelationship;
    if (hasGuardianInfo) {
      if (!formData.guardianName || !formData.guardianPhone || !formData.guardianRelationship) {
        if (!formData.guardianName) newErrors.guardianName = '한글로 입력해주세요';
        if (!formData.guardianPhone) newErrors.guardianPhone = '전화번호에 하이픈(-)을 포함해주세요';
        if (!formData.guardianRelationship) newErrors.guardianRelationship = '선택해주세요';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 전역 상태에 사용자 정보 저장 (구글 로그인 정보 사용)
      const userInfo = {
        name: googleUserInfo.name || '홍길동',
        email: googleUserInfo.email || 'example@email.com',
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
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
      setErrors({ submit: '모든 입력해주세요' });
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
            키, 몸무게, 나이, 생년월일, 거주지는 필수 입력 사항입니다
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
                className={`mt-1 ${errors.birthDate ? 'border-red-500' : ''}`}
                required
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
              )}
              <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                  cursor: pointer;
                }
              `}</style>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                나이
              </label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="생년월일에서 자동 계산됨"
                className={`mt-1 ${errors.age ? 'border-red-500' : ''}`}
                required
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
              {!errors.age && formData.age && (
                <p className="mt-1 text-sm text-gray-500">생년월일에서 자동 계산됨 (수정 가능)</p>
              )}
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
                onBlur={(e) => {
                  const numValue = parseFloat(e.target.value) || 0;
                  const formattedValue = numValue.toFixed(2);
                  setFormData(prev => ({
                    ...prev,
                    height: formattedValue
                  }));
                }}
                placeholder="0.00"
                step="0.01"
                className={`mt-1 ${errors.height ? 'border-red-500' : ''}`}
                required
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
              )}
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
                onBlur={(e) => {
                  const numValue = parseFloat(e.target.value) || 0;
                  const formattedValue = numValue.toFixed(2);
                  setFormData(prev => ({
                    ...prev,
                    weight: formattedValue
                  }));
                }}
                placeholder="0.00"
                step="0.01"
                className={`mt-1 ${errors.weight ? 'border-red-500' : ''}`}
                required
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
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
                className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
                required
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
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
                    className={`mt-1 ${errors.guardianName ? 'border-red-500' : ''}`}
                  />
                  {errors.guardianName && (
                    <p className="mt-1 text-sm text-red-600">{errors.guardianName}</p>
                  )}
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
                    className={`mt-1 ${errors.guardianPhone ? 'border-red-500' : ''}`}
                  />
                  {errors.guardianPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.guardianPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    보호자 관계
                  </label>
                  <select
                    name="guardianRelationship"
                    value={formData.guardianRelationship}
                    onChange={handleChange}
                    className={`mt-1 flex h-14 w-full rounded-lg border-2 bg-white px-4 py-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none bg-no-repeat bg-right ${
                      errors.guardianRelationship ? 'border-red-500' : 'border-neutral-300'
                    }`}
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
                  {errors.guardianRelationship && (
                    <p className="mt-1 text-sm text-red-600">{errors.guardianRelationship}</p>
                  )}
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
