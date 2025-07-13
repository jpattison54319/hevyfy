import { useEffect, useState } from 'react';
import RoutineAccordion from '../RoutineAccordion/RoutineAccordion';
import styles from './Routines.module.scss';
import { useUser } from '../../context/UserContext';
import api from '../../api/api';
import { Routine } from '../../types/routine.types';
import Loading from '../../Loading/Loading';

function MyRoutines() {
    const [routines, setRoutines] = useState<Routine[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const {userData} = useUser();
  // You can later fetch actual routines via useEffect

  useEffect(() => {
    api.get(`/routines?communityRoutine=${true}`)
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
      <RoutineAccordion routine={routines} setRoutines={setRoutines} menuOptions={['Copy']}/>
    </div>
  );
}

export default MyRoutines;