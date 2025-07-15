// Settings.tsx
import { useState } from 'react';
import styles from './Settings.module.scss';
import { Button, Input } from '@headlessui/react';
import { useUser } from '../context/UserContext';
import api from '../api/api';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const [showHevyIntegration, setShowHevyIntegration] = useState(false);
  const [hevyKey, setHevyKey] = useState('');
  const {userData} = useUser();
  const {addToast} = useToast();

  function handleHevyKey() {
    console.log('saving key');
    api.post('/users/hevy/saveKey', {hevyKey, uid: userData?.uid})
    .then((res) => {
        console.log(res);
    }).catch((err) => {
        console.error(err);
    });
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>User Settings</h2>

      <Button
        className={styles.optionButton}
        onClick={() => setShowHevyIntegration(prev => !prev)}
      >
        Hevy Integration
      </Button>

      {showHevyIntegration && (
        <div className={styles.integrationSection}>
          <h3>Connect to Hevy</h3>
          <p style={{color: 'red'}}>
            Prerequestie: Must be a Hevy Pro member!
          </p>
          <p>
            Integrate your Hevy account to automatically sync workouts logged there
            into this app to help your pet evolve!
          </p>
          <p>
            To get your API key, go to the Hevy.com, log in, click 'settings', click 'Developer', generate and copy your API key. Paste below! 
          </p>

          <label className={styles.label} htmlFor="hevyKey">
            Hevy API Key
          </label>
          <Input
            id="hevyKey"
            type="text"
            className={styles.input}
            placeholder="Enter your API key"
            value={hevyKey}
            onChange={(e) => setHevyKey(e.target.value)}
          />

          <Button className={styles.saveButton} onClick={() => handleHevyKey()}>Integrate with Hevy!</Button>
        </div>
      )}
    </div>
  );
}
