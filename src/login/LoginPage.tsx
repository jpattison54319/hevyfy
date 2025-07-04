import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from '../firebase';
import { Button, Spinner, Text } from '@salt-ds/core';
import styles from './LoginPage.module.scss'; // Assuming you have a CSS module for styles
import api from '../api/api';
import { useUser } from '../context/UserContext';

function LoginPage() {
  const { userData, setUserData } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    console.log('Attempting to log in with Google...');
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      // Send token to backend to verify
       const { data } = await api.post('/auth/google', { token });

       const userResponse = await api.get(`/users/${data.uid}`); // Fetch user data from your backend
       const user = userResponse.data;

       setUserData(user); // Save user data in context
      console.log('User saved or retrieved from DB:', data);
    } catch (err) {
      console.error(err);
    }
        setIsLoading(true);
  };

    return (
    <div className={styles.loginScreen}>
      <div className={styles.loginContainer}>
        {isLoading ? <Spinner size='large' aria-label="loading" role="status"></Spinner>: 
        <Button className={styles.googleButton} onClick={handleLogin}>Embark with Google</Button>}
      </div>
    </div>
  );

  // return <div className={styles.myBackground}><Button style={{borderRadius: '16px'}} appearance='solid' sentiment='positive' onClick={handleLogin}>Start your journey with Google</Button></div>;
}

export default LoginPage;
