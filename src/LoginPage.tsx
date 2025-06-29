import React from 'react';
import { auth, provider, signInWithPopup } from './firebase';

function LoginPage() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      // Send token to backend to verify
      const res = await fetch('http://localhost:2025/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      console.log('User saved or retrieved from DB:', data);
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
}

export default LoginPage;
