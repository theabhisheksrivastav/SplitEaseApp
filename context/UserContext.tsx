import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserContextType {
  userId: string | null;
  androidId: string | null;
  deviceName: string | null;
  setUser: (user: { userId: string; androidId: string; deviceName: string }) => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  androidId: null,
  deviceName: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [androidId, setAndroidId] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const setUser = (user: { userId: string; androidId: string; deviceName: string }) => {
    setUserId(user.userId);
    setAndroidId(user.androidId);
    setDeviceName(user.deviceName);
  };

  return (
    <UserContext.Provider value={{ userId, androidId, deviceName, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
