import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import styles from './HevySplash.module.scss';
import { Button } from '@headlessui/react';
import { HevyWorkout } from '../types/hevyWorkout.types';
import Emoji from '../Emoji/Emoji';
import { ChevronDown } from 'lucide-react';

export interface HevySplashProps{
    workouts: HevyWorkout[];
    onClose: () => void;
    
}

export default function HevySplash({ workouts, onClose }: HevySplashProps) {
  const isMultiple = workouts.length > 1;

  const totalPetAffects = workouts.reduce(
    (acc: { strength: any; agility: any; pet: any; }, w: { petAffects: { strength: any; agility: any; pet: any; }; }) => {
      acc.strength += w.petAffects.strength || 0;
      acc.agility += w.petAffects.agility || 0;
      acc.pet += w.petAffects.pet || 0;
      return acc;
    },
    { strength: 0, agility: 0, pet: 0 }
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.splashBox}>
        <div className={styles.titleBar}>
            <div>
                <Emoji symbol='🏋️' size={32}/>
            <h2 className={styles.title}>HEVY WORKOUT SYNC</h2>
            </div>
          <div className={styles.titleDecoration}></div>
        </div>

        <div className={styles.petAffects}>
          <div className={styles.petHeader}>
            <span className={styles.petIcon}>🐾</span>
            <h3>YOUR PET GREW STRONGER!</h3>
          </div>
          <div className={styles.statsGrid}>
            <div className={`${styles.statItem} ${styles.petXp}`}>
              <span className={styles.statLabel}>PET XP</span>
              <span className={styles.statValue}>+{totalPetAffects.pet}</span>
            </div>
            <div className={`${styles.statItem} ${styles.strength}`}>
              <span className={styles.statLabel}>STRENGTH</span>
              <span className={styles.statValue}>+{totalPetAffects.strength}</span>
            </div>
            <div className={`${styles.statItem} ${styles.agility}`}>
              <span className={styles.statLabel}>AGILITY</span>
              <span className={styles.statValue}>+{totalPetAffects.agility}</span>
            </div>
          </div>
        </div>

        {isMultiple ? (
          <div className={styles.disclosures}>
            <h4 className={styles.workoutsTitle}>WORKOUT DETAILS</h4>
            {workouts.map((w, idx) => (
                <Disclosure as="div" className={styles.disclosure} key={w.hevyWorkoutId}>
                {({ open }) => (
                  <>
                    <DisclosureButton className={styles.disclosureHeader}>
                      {w.title || `Workout ${idx + 1}`} — {new Date(w.startTime).toLocaleDateString()}
                      <ChevronDown
                        className={`${styles.chevron} ${open ? styles.rotate : ''}`}
                        aria-hidden="true"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className={styles.disclosureBody}>
                      <p><strong>Notes:</strong> {w.description || 'No notes provided'}</p>
                      <div className={styles.exerciseList}>
                        {w.exercises.map((ex, i) => (
                          <div key={i} className={styles.exerciseItem}>
                            <span className={styles.exerciseName}>{ex.title}</span>
                            <span className={styles.exerciseSets}>{ex.sets.length} sets</span>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        ) : (
          <div className={styles.singleWorkout}>
            <div className={styles.workoutHeader}>
              <h3>{workouts[0].title}</h3>
              <div className={styles.workoutDate}>{new Date(workouts[0].startTime).toLocaleDateString()}</div>
            </div>
            <p className={styles.workoutDescription}>{workouts[0].description}</p>
            <div className={styles.exerciseList}>
              {workouts[0].exercises.map((ex, i) => (
                <div key={i} className={styles.exerciseItem}>
                  <span className={styles.exerciseName}>{ex.title}</span>
                  <span className={styles.exerciseSets}>{ex.sets.length} sets</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} className={styles.closeBtn}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}
