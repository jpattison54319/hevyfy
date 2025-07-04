import { Route, Routes } from "react-router-dom";
import { SaltProvider, BorderLayout, BorderItem, FlexLayout, FlexItem } from "@salt-ds/core";
import Header from "./header/Header";
import { routes } from "./routes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path if your firebase config is elsewhere
import LoginPage from "./login/LoginPage"; // Import your login component
import { UserProvider, useUser } from "./context/UserContext";
import OnboardingPage from "./onboarding/onboardingPage";
import api from "./api/api";
import { handleSignOut } from "./SignOut";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const [initializing, setInitializing] = useState(true);
    const { userData, setUserData } = useUser();
    const [currencyBalance, setCurrencyBalance] = useState<number>(0);
   // console.log('User Data in App:', userData); // Log user data to check if it's being set correctly

//   const checkForNewDay = async () => {
//     const currentDate = new Date();
//     const lastLogin = userData?.lastLogin ? new Date(userData.lastLogin) : null;

//     // if (!lastLogin || currentDate.getDate() !== lastLogin.getDate() || currentDate.getMonth() !== lastLogin.getMonth() || currentDate.getFullYear() !== lastLogin.getFullYear()) {
//     //   console.log('New day detected, resetting user data...');
//     //   // Reset user data logic here
//     //   try {
//     //     const response = await api.post('/resetUserData', { uid: user?.uid });
//     //     setUserData(response.data);
//     //   } catch (error) {
//     //     console.error('Error resetting user data:', error);
//     //   }
//     // }
//   }

// useEffect(() => {
//   const handleFocus = () => {
//     // user came back to your site/tab
//     console.log('User came back!');
//     checkForNewDay(); // or trigger your reset logic here
//   };

//   window.addEventListener('focus', handleFocus);
//   return () => {
//     window.removeEventListener('focus', handleFocus);
//   };
// }, []);


   useEffect(() => {
    //handleSignOut(); // Ensure sign out is handled on app load
  //   const checkCurrentUser = () => {
  //   const currentUser = auth.currentUser;
  //   if (currentUser) {
  //     console.log('Found existing user:', currentUser);
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // };
  // const cachedUser = auth.currentUser;
  // console.log('Cached User:', cachedUser); // Log the cached user to check if it's being set correctly
  // if (cachedUser) {
  //   const cached = localStorage.getItem("userData");
  // if (cached) {
  //   setUserData(JSON.parse(cached));
  // }
  //   setUser(cachedUser); // Temporarily set cached user
  //   setLoading(false); // Set loading to false immediately
  // }
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {

    //       if (firebaseUser) {
    //   console.log('User is signed in — signing them out...');
    //   handleSignOut();
    // }
   console.log('Auth state changed:', firebaseUser); // Add this debug log
   console.log('User Data in App useEffect:', userData); // Log user data to check if it's being set correctly
      setUser(firebaseUser);
      setLoading(false); // Set loading to true when auth state changes
      const cached = localStorage.getItem("userData");
  if (cached) {
    setUserData(JSON.parse(cached));
  }
      // if (firebaseUser) {
      //   retrieveUserData(firebaseUser);
      // } else {
      //   setUserData(null); // Clear user data when logged out
      //   setLoading(false);
      // }
    });

  //     if (auth.currentUser !== undefined) {
  //   checkCurrentUser();
  // }

  // auth.authStateReady().then(() => {
  //     setInitializing(false);
  //     setLoading(false);
  //   });

return () => unsub();
  }, []);

  console.log('App render - Loading:', loading, 'User:', user, 'UserData:', userData);


  if (loading) {
    return <div>Loading in app.tsx...</div>; // or a loading spinner
  }

  if (!user || !userData) {
    return <SaltProvider mode="dark"><LoginPage /></SaltProvider>; // show your login component until they're logged in
  }

  if (userData.bodyStats.weight === 0) {
    return <SaltProvider mode="dark"><OnboardingPage /></SaltProvider>; // show your login component until they're logged in
  }
  
  return (
   <SaltProvider mode="dark">
    <div style={{maxHeight: '100dvh', minHeight: '100dvh', height: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column'}}>
      <div style={{
        flex: 1,
        maxHeight: 'calc(100dvh - 76px)', 
        minHeight: 'calc(100dvh - 76px)',
        height: 'calc(100dvh - 76px)',
         display: 'flex',
    flexDirection: 'column',
        paddingBottom: '14px'
      }}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.name} path={r.path} element={r.element} />
          ))}
        </Routes>
      </div>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '76px',
              }}>
        <Header />
      </div>
    </div>
  </SaltProvider>
  );
}

export default App;
