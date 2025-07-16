// Settings.tsx
import { useEffect, useState } from 'react';
import styles from './Settings.module.scss';
import { Button, Input } from '@headlessui/react';
import { useUser } from '../context/UserContext';
import api from '../api/api';
import { useToast } from '../context/ToastContext';
import Emoji from '../Emoji/Emoji';

export default function Settings() {
  const [showHevyIntegration, setShowHevyIntegration] = useState(false);
  const [hevyKey, setHevyKey] = useState('');
  const {userData, setUserData} = useUser();
  const [alreadyConnected, setAlreadyConnected] = useState<boolean>(false);
  const {addToast} = useToast();

  function handleHevyKey() {
    console.log('saving key');
    api.post('/users/hevy/saveKey', {hevyKey, uid: userData?.uid})
    .then((res) => {
        console.log(res);
        setUserData(res.data.updatedUser);
        addToast({content:(
<div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        backgroundColor: "#1c1c1c",
        border: "3px solid #ffa640",
        color: "#FFFDD0",
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        fontSize: 17,
        textTransform: "uppercase",
        boxShadow: "0 0 8px #ffa640",
        borderRadius: 8,
      }}>
        <Emoji size={32} symbol="🏋🏽🔥💪🏼🎧"/>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 4 }}>Success!</div>
        <div style={{ marginBottom: 4 }}>Integrated with Hevy!</div>
        </div>
        </div>
        ), duration: 2000
        } );
    }).catch((err) => {
        console.error(err);
    });
  }

  useEffect(() => {
    setAlreadyConnected(!!userData?.hevyKey);
  }, [userData]);


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

          {alreadyConnected ? (
            <>
              <p style={{ color: 'green' }}>
                ✅ Already integrated with Hevy.
              </p>
              <p>Your workouts will automatically sync from Hevy.</p>
            </>
          ) : (
            <>
              <p style={{ color: 'red' }}>
                Prerequisite: Must be a Hevy Pro member!
              </p>
              <p>
                Integrate your Hevy account to automatically sync workouts logged there
                into this app to help your pet evolve!
              </p>
              <p>
                To get your API key, go to hevy.com, log in, click 'Settings' → 'Developer',
                generate and copy your API key, then paste it below.
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

              <Button
                className={styles.saveButton}
                onClick={handleHevyKey}
              >
                Integrate with Hevy!
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
