import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';
import api from '../api/api';
import HevySplash from '../HevySplash/HevySplash';
import { HevyWorkout } from '../types/hevyWorkout.types';

const HevySplashContext = createContext({});

export function HevySplashProvider({ children }: any) {
  const { userData } = useUser();
  const [splashWorkouts, setSplashWorkouts] = useState<HevyWorkout[] | null>(null);

  async function onContinue(){
    await api.post(`/hevy/markSeen`, {
      workoutIds: splashWorkouts?.map((w: { hevyWorkoutId: any; }) => w.hevyWorkoutId),
      uid: userData?.uid,
    });
    setSplashWorkouts(null);
  }

  useEffect(() => {
    if (!userData?.uid) return;

    async function fetchUnseenWorkouts() {
      try {
        
        const res = await api.get(`/hevy/unseen/${userData?.uid}`);
        const workouts = res.data.newHevyWorkouts;

        if (workouts?.length) {
          setSplashWorkouts(workouts);

          // Immediately mark as seen
          // await api.post(`/hevy/markSeen`, {
          //   workoutIds: workouts.map((w: { hevyWorkoutId: any; }) => w.hevyWorkoutId),
          //   uid: userData?.uid,
          // });
        }
      } catch (err) {
        console.error('Error fetching unseen Hevy workout:', err);
      }
    }

    fetchUnseenWorkouts();
  }, [userData?.uid]);

  return (
    <>
      {splashWorkouts && <HevySplash workouts={splashWorkouts} onClose={() => onContinue()} />}
      {children}
    </>
  );
}

export function useHevySplash() {
  return useContext(HevySplashContext);
}
