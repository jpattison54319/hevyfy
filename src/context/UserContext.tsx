import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Can include stats, levels, inventory, etc.

  const updateStats = (updates) => {
    setUserData(prev => ({ ...prev, stats: { ...prev.stats, ...updates } }));
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, updateStats }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);