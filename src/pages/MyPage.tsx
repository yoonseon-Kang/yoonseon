import React from 'react';
import { AccountInfo } from '../features/mypage/components/AccountInfo';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const MyPage: React.FC = () => {
  const { logout } = useGoogleAuth();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <button
          onClick={logout}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          로그아웃
        </button>
      </div>

      <div className="space-y-6">
        <AccountInfo />
      </div>
    </div>
  );
};
