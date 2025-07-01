import { Route, Routes } from "react-router-dom";
import { SaltProvider, BorderLayout, BorderItem, FlexLayout, FlexItem } from "@salt-ds/core";
import Header from "./header/Header";
import { routes } from "./routes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path if your firebase config is elsewhere
import LoginPage from "./login/LoginPage"; // Import your login component

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!user) {
    return <SaltProvider mode="dark"><LoginPage /></SaltProvider>; // show your login component until they're logged in
  }
  
  return (
   <SaltProvider mode="dark">
    <div style={{height: '100vh', position: 'relative'}}>
      <div style={{
        height: 'calc(100vh - 76px)', 
        overflowY: 'auto',
        paddingBottom: 0
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
        zIndex: 1000
      }}>
        <Header />
      </div>
    </div>
  </SaltProvider>
  );
}

export default App;
