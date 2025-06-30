import React from 'react';
import { auth, provider, signInWithPopup } from '../firebase';
import { Button } from '@salt-ds/core';
import styles from './LoginPage.module.scss'; // Assuming you have a CSS module for styles
import api from '../api/api';

function LoginPage() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      // Send token to backend to verify
       const { data } = await api.post('/auth/google', { token });
      console.log('User saved or retrieved from DB:', data);
    } catch (err) {
      console.error(err);
    }
  };

  return <div className={styles.myBackground}><Button style={{borderRadius: '16px'}} appearance='solid' sentiment='positive' onClick={handleLogin}>Sign in with Google</Button></div>;
}

export default LoginPage;
