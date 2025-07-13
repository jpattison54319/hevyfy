import Loading from '../Loading/Loading';
import styles from './Routines.module.scss';

function UpdateRoutine() {
  return (
     <div style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'
            }}>
                <Loading scale={2}/>
            </div>
  );
}

export default UpdateRoutine;