import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface UserContextType {
  userInfo: UserInfo;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  setUserInfo: (info: UserInfo) => void;
}

const defaultUserInfo: UserInfo = {
  name: '',
  email: '',
  height: '',
  weight: '',
  birthDate: '',
  address: ''
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfoState] = useState<UserInfo>(defaultUserInfo);

  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfoState(prev => ({ ...prev, ...info }));
  };

  const setUserInfo = (info: UserInfo) => {
    setUserInfoState(info);
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};