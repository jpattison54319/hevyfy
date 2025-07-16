import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';
import api from '../api/api';

const HevySplashContext = createContext({});

export function HevySplashProvider({ children }: any) {
  const { userData } = useUser();
  const [splashWorkout, setSplashWorkout] = useState(null);

  useEffect(() => {
    if (!userData?.uid) return;

    async function fetchUnseenWorkout() {
      try {
        const res = await api.get(`/hevy/unseen?uid=${userData?.uid}`);
        if (res.data.workout) {
          setSplashWorkout(res.data.workout);

          // Immediately mark as seen
          await api.post(`/hevy/markSeen`, {
            workoutId: res.data.workout.hevyWorkoutId,
            uid: userData?.uid
          });
        }
      } catch (err) {
        console.error('Error fetching unseen Hevy workout:', err);
      }
    }

    fetchUnseenWorkout();
  }, [userData?.uid]);

  return (
    <>
      {splashWorkout && <HevySplash workout={splashWorkout} onClose={() => setSplashWorkout(null)} />}
      {children}
    </>
  );
}

export function useHevySplash() {
  return useContext(HevySplashContext);
}
