import { Route, Routes } from "react-router-dom";
import { SaltProvider, BorderLayout, BorderItem } from "@salt-ds/core";
import Header from "./header/Header";
import { routes } from "./routes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path if your firebase config is elsewhere
import LoginPage from "./LoginPage"; // Import your login component

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
    return <LoginPage />; // show your login component until they're logged in
  }
  
  return (
    <SaltProvider>
      <BorderLayout style={{height: '100vh'}}>
        <BorderItem position="center" style={{flex: 1,height: '100vh', width: '100%'}} >
          <Routes>
            {routes.map((r) => (
              <Route key={r.name} path={r.path} element={r.element} />
            ))}
          </Routes>
        </BorderItem>
        <BorderItem sticky={true} position="south" style={{bottom: 0, left: 0, right: 0}}>
          <Header />
        </BorderItem>
      </BorderLayout>
    </SaltProvider>
  );
}

export default App;
