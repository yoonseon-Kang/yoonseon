import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useGoogleAuth } from '../../../hooks/useGoogleAuth';

interface GuardianInfo {
  name: string;
  phone: string;
  relationship: string;
}

interface UserInfo {
  name: string;
  email: string;
  height: string;
  weight: string;
  birthDate: string;
  address: string;
  guardian?: GuardianInfo;
}

export const AccountInfo: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo: globalUserInfo, updateUserInfo } = useUser();
  const { userInfo: googleUserInfo } = useGoogleAuth();

  // 전역 상태에서 데이터가 없으면 구글 정보 또는 기본값 사용
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: (globalUserInfo.name && globalUserInfo.name.trim()) || googleUserInfo.name || '홍길동',
    email: (globalUserInfo.email && globalUserInfo.email.trim()) || googleUserInfo.email || 'example@email.com',
    height: globalUserInfo.height || '170',
    weight: globalUserInfo.weight || '70',
    birthDate: globalUserInfo.birthDate || '1990-01-01',
    address: globalUserInfo.address || '서울시 강남구',
    guardian: globalUserInfo.guardian
  });

  const [isAddingGuardian, setIsAddingGuardian] = useState(false);

  // 전역 상태 또는 구글 정보가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setUserInfo({
      name: (globalUserInfo.name && globalUserInfo.name.trim()) || googleUserInfo.name || '홍길동',
      email: (globalUserInfo.email && globalUserInfo.email.trim()) || googleUserInfo.email || 'example@email.com',
      height: globalUserInfo.height || '170',
      weight: globalUserInfo.weight || '70',
      birthDate: globalUserInfo.birthDate || '1990-01-01',
      address: globalUserInfo.address || '서울시 강남구',
      guardian: globalUserInfo.guardian
    });
  }, [globalUserInfo, googleUserInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 보호자 정보 유효성 검사 - 이름과 전화번호가 모두 비어있으면 보호자 정보 제거
    const hasGuardianName = userInfo.guardian?.name && userInfo.guardian.name.trim();
    const hasGuardianPhone = userInfo.guardian?.phone && userInfo.guardian.phone.trim();

    const processedUserInfo = {
      ...userInfo,
      guardian: (hasGuardianName || hasGuardianPhone) ? userInfo.guardian : undefined
    };

    // 전역 상태 업데이트
    updateUserInfo(processedUserInfo);
    // 로컬 상태도 업데이트하여 동기화
    setUserInfo(processedUserInfo);
    // TODO: API 연동하여 사용자 정보 업데이트
    setIsEditing(false);
    setIsAddingGuardian(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">계정 정보</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-emerald-500 hover:text-emerald-600"
        >
          {isEditing ? '취소' : '수정'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={userInfo.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
              title="구글 로그인 정보에서 자동으로 가져옵니다"
            />
            <p className="mt-1 text-sm text-gray-500">구글 계정에서 자동으로 가져옵니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={userInfo.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
              title="구글 로그인 정보에서 자동으로 가져옵니다"
            />
            <p className="mt-1 text-sm text-gray-500">구글 계정에서 자동으로 가져옵니다</p>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              생년월일
            </label>
            <input
              type="date"
              value={userInfo.birthDate}
              onChange={(e) => setUserInfo({ ...userInfo, birthDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              키 (cm)
            </label>
            <input
              type="number"
              value={userInfo.height}
              onChange={(e) => setUserInfo({ ...userInfo, height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              몸무게 (kg)
            </label>
            <input
              type="number"
              value={userInfo.weight}
              onChange={(e) => setUserInfo({ ...userInfo, weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거주지
            </label>
            <input
              type="text"
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold">보호자 정보</h3>
              {!userInfo.guardian && !isAddingGuardian && (
                <button
                  type="button"
                  onClick={() => setIsAddingGuardian(true)}
                  className="text-emerald-500 hover:text-emerald-600"
                >
                  보호자 추가하기
                </button>
              )}
            </div>
            {(userInfo.guardian || isAddingGuardian) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보호자 이름
                  </label>
                  <input
                    type="text"
                    value={userInfo.guardian?.name || ''}
                    onChange={(e) => setUserInfo({
                      ...userInfo,
                      guardian: {
                        ...(userInfo.guardian || { phone: '', relationship: '부모' }),
                        name: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보호자 전화번호
                  </label>
                  <input
                    type="tel"
                    value={userInfo.guardian?.phone || ''}
                    onChange={(e) => setUserInfo({
                      ...userInfo,
                      guardian: {
                        ...(userInfo.guardian || { name: '', relationship: '부모' }),
                        phone: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    관계
                  </label>
                  <select
                    value={userInfo.guardian?.relationship || '부모'}
                    onChange={(e) => setUserInfo({
                      ...userInfo,
                      guardian: {
                        ...(userInfo.guardian || { name: '', phone: '' }),
                        relationship: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="부모">부모</option>
                    <option value="조부모">조부모</option>
                    <option value="친척">친척</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors mt-6"
          >
            저장
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">이름</p>
            <p className="mt-1">{userInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">이메일</p>
            <p className="mt-1">{userInfo.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">생년월일</p>
            <p className="mt-1">{userInfo.birthDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">키</p>
            <p className="mt-1">{userInfo.height}cm</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">몸무게</p>
            <p className="mt-1">{userInfo.weight}kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">거주지</p>
            <p className="mt-1">{userInfo.address}</p>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="mb-4">
              <h3 className="text-md font-semibold">보호자 정보</h3>
            </div>
            {userInfo.guardian ? (
              <>
                <div>
                  <p className="text-sm text-gray-500">보호자 이름</p>
                  <p className="mt-1">{userInfo.guardian.name}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">보호자 전화번호</p>
                  <p className="mt-1">{userInfo.guardian.phone}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">관계</p>
                  <p className="mt-1">{userInfo.guardian.relationship}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">등록된 보호자 정보가 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
