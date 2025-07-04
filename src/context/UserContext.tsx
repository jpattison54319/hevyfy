import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { ReactNode } from 'react';
import { User } from '../types/user.types';
import { onAuthStateChanged } from 'firebase/auth';

type UserContextType = {
  userData: User | null; // Replace 'any' with your user data type/interface
  setUserData: Dispatch<SetStateAction<any>>; // Replace 'any' with your user data type/interface
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserDataState] = useState<User | null>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });


  const setUserData = (data: User | null) => {
    setUserDataState(data);
    if (data) {
      localStorage.setItem("userData", JSON.stringify(data));
    } else {
      localStorage.removeItem("userData");
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

    const { userData, setUserData } = context;

  const dailyCurrency = useMemo(() => {
    if (!userData) return undefined;
    return Math.floor(userData.goal.dailyCalorieGoal / 100); // Replace 50 with your logic
  }, [userData]);

  return {
    userData, setUserData, dailyCurrency};
};