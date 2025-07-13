import { useEffect, useState } from 'react';
import RoutineAccordion from './RoutineAccordion/RoutineAccordion';
import styles from './Routines.module.scss';
import { useUser } from '../context/UserContext';
import api from '../api/api';
import { Routine, WeeklyScheduleDay } from '../types/routine.types';
import Loading from '../Loading/Loading';
import WorkoutScreen, { ExerciseCardData } from '../WorkoutScreen/WorkoutScreen'; 


function MyRoutines() {
    const [routines, setRoutines] = useState<Routine[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const {userData} = useUser();
    const [activeWorkout, setActiveWorkout] = useState<ExerciseCardData[] | null>(null);

const handleStartWorkout = (day: WeeklyScheduleDay) => {
  const workoutData = day.exercises.map(e => ({
    dayName: day.dayName,
    exercise: e.exercise,
    repRange: e.repRange,
    sets: Array(Number(e.sets)).fill({ weight: 0, reps: 0 })
  }));
  
  setActiveWorkout(workoutData);
};

const handleWorkoutFinish = (data: { duration: number; exercises: ExerciseCardData[] }) => {
  console.log('Workout complete:', data);
  setActiveWorkout(null);
};
  // You can later fetch actual routines via useEffect

    useEffect(() => {
      api.get(`/routines?uid=${userData?.uid}`)
        .then(res => {
            setRoutines(res.data.routines);
        }).catch(err => {
            console.error(err);
        }).finally(() => setLoading(false));

    },[])

    if (!routines || routines.length === 0) {
        return <p style={{ padding: '1rem' }}>You havn't created a routine yet!.</p>;
      }

      if(loading){
        return (
        <div style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'
        }}>
            <Loading scale={2}/>
        </div>
        );
      }

  return (
    <div style={{display: 'flex', width: '100%'}}>
      {activeWorkout && (
  <WorkoutScreen
    exercises={activeWorkout}
    onFinish={handleWorkoutFinish}
  />
)}
      <RoutineAccordion routine={routines} setRoutines={setRoutines} menuOptions={['Share', 'Delete']} onStartWorkout={handleStartWorkout}/>
    </div>
  );
}

export default MyRoutines;