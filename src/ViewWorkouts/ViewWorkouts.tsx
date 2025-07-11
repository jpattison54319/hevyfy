import React, { useState, useEffect, useRef } from 'react';
import { X, Dumbbell, Zap, Shield, Brain, Heart, Timer, Target, ShieldPlus, Rabbit, Castle, Bone, Fish, Clock, MapPin, Activity, ActivityIcon } from 'lucide-react';

import api from '../api/api';
import { WorkoutLog } from '../types/user.types';
import { useUser } from '../context/UserContext';
import styles from './ViewWorkouts.module.scss'

const ViewWorkouts = () => {
  const {userData} = useUser();
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 10;

  const fetchWorkouts = async (currentOffset = offset, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await api.get(
        `/workout/${userData?.uid}/workouts?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
      );
      const data = response.data;
      const newWorkouts = data.workouts || [];

      if (isInitial) {
        setWorkouts(newWorkouts);
      } else {
        setWorkouts((prev) => [...prev, ...newWorkouts]);
      }

      // ✅ Better hasMore logic using total count from backend
      const total = data.total || 0;
      const loadedSoFar = currentOffset + newWorkouts.length;
      setHasMore(loadedSoFar < total);

      setOffset(currentOffset + newWorkouts.length); // more robust than ITEMS_PER_PAGE in case backend ever returns fewer
    } catch (error) {
      console.error("Error fetching workouts:", error);

      // Optional fallback for local development if using mock data
      // Only use this if mockWorkouts exists
      // const startIndex = currentOffset;
      // const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, mockWorkouts.length);
      // const paginatedWorkouts = mockWorkouts.slice(startIndex, endIndex);
      // ...
      // setWorkouts(...);
      // setHasMore(...);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchWorkouts(0, true); // Fetch initial page on mount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const drawerElement = document.querySelector('.saltDrawer');
      if (!drawerElement) return;
      
      const { scrollTop, scrollHeight, clientHeight } = drawerElement;
      
      // Load more when user scrolls to bottom (with 100px buffer)
      if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loadingMore) {
        fetchWorkouts(offset, false);
      }
    };

    const drawerElement = document.querySelector('.saltDrawer');
    if (drawerElement) {
      drawerElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (drawerElement) {
        drawerElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [offset, hasMore, loadingMore]);

  const formatDate = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  type StatBoostProps = {
    icon: React.ComponentType<{ size?: string | number; className?: string }>;
    label: string;
    value: number;
    color: string;
  };

  const StatBoost: React.FC<StatBoostProps> = ({ icon: Icon, label, value, color }) => (
    <div className={`${styles.statBoost} ${styles[`statBoost--${color}`]}`}>
      <Icon size={17} className={styles.statBoost__icon} />
      <span className={styles.statBoost__label}>{label}</span>
      <span className={styles.statBoost__value}>+{value}</span>
    </div>
  );

   const WorkoutCard: React.FC<{ workout: WorkoutLog }> = ({ workout }) => {
    const isManual = workout.logType === 'manual';
    const isRoutine = workout.logType === 'routine';
    
    // Calculate total XP for display
    const totalXp = workout.workoutXp.pet;
    
    return (
      <div className={styles.workoutCard}>
        {/* Pixelated Border Effect */}
        <div className={styles.workoutCard__border}></div>
        
        {/* Header with retro styling */}
        <div className={styles.workoutCard__header}>
          <div className={styles.workoutCard__info}>
            <h3 className={styles.workoutCard__title}>
              {isRoutine ? `${workout.routineDay} ROUTINE` : `${workout?.workoutType?.toUpperCase()} SESSION`}
            </h3>
            <p className={styles.workoutCard__timestamp}>
              <Clock size={12} className={styles.workoutCard__timestampIcon} />
              {formatDate(workout.timestamp)}
            </p>
          </div>
          <div className={styles.workoutCard__xp}>
            <div className={styles.workoutCard__xpValue}>{totalXp}</div>
            <div className={styles.workoutCard__xpLabel}>XP</div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className={styles.workoutCard__stats}>
          {workout.rpe && (
            <div className={`${styles.statItem} ${styles['statItem--rpe']}`}>
              <div className={styles.statItem__value}>{workout.rpe}/10</div>
              <div className={styles.statItem__label}>RPE</div>
            </div>
          )}
        </div>

        {/* Manual workout specific stats */}
        {isManual && (
          <div className={styles.workoutCard__manualStats}>
            <div className={styles.workoutCard__manualGrid}>
              {workout.duration && (
                <div className={styles.manualStat}>
                  <Timer size={25} className={styles.manualStat__icon} />
                  <div className={styles.manualStat__content}>
                    <div className={styles.manualStat__value}>{formatDuration(workout.duration)}</div>
                    <div className={styles.manualStat__label}>DURATION</div>
                  </div>
                </div>
              )}
              {workout.distance != 0 && (
                <div className={styles.manualStat}>
                  <MapPin size={16} className={styles.manualStat__icon} />
                  <div className={styles.manualStat__content}>
                    <div className={styles.manualStat__value}>{workout.distance} KM</div>
                    <div className={styles.manualStat__label}>DISTANCE</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Routine workout specific stats */}
        {isRoutine && workout.performedExercises && workout.performedExercises.length > 0 && (
          <div className={styles.workoutCard__exercises}>
            <div className={styles.workoutCard__sectionTitle}>
              <Dumbbell size={14} />
              PERFORMED EXERCISES
            </div>
            <div className={styles.workoutCard__exercisesList}>
              {workout.performedExercises.map((exercise, index) => (
                <div key={index} className={styles.exerciseItem}>
                  <div className={styles.exerciseItem__name}>{exercise.name.toUpperCase()}</div>
                  <div className={styles.exerciseItem__sets}>
                    {exercise.sets.map((set, setIndex) => (
                      <span key={setIndex} className={styles.exerciseItem__set}>
                        {set.weight}KG × {set.reps}
                      </span>
                    ))}
                  </div>
                  {exercise.notes && (
                    <div className={styles.exerciseItem__notes}>"{exercise.notes}"</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* XP Boosts */}
        <div className={styles.workoutCard__statBoosts}>
          <div className={styles.workoutCard__sectionTitle}>
            <Zap size={17} />
            Skills GAINED
          </div>
          <div className={styles.workoutCard__statBoostsGrid}>
            {workout.workoutXp.strength > 0 && (
              <StatBoost icon={Shield} label="STR" value={workout.workoutXp.strength} color="red" />
            )}
            {workout.workoutXp.agility > 0 && (
              <StatBoost icon={Rabbit} label="AGI" value={workout.workoutXp.agility} color="yellow" />
            )}
          </div>
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className={styles.workoutCard__notes}>
            <div className={styles.workoutCard__sectionTitle}>
              <Brain size={14} />
              WORKOUT NOTES
            </div>
            <div className={styles.workoutCard__notesText}>"{workout.notes}"</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Retro Header */}
      <div className={styles.drawer__header}>
        <div className={styles.drawer__headerContent}>
          <Dumbbell className={styles.drawer__headerIcon} size={32} />
          <h2 className={styles.drawer__title}>WORKOUT LOG</h2>
        </div>
      </div>

      {/* Content */}
      <div
        className={styles.drawer__content}
        ref={scrollContainer}
      >
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingState__content}>
              <div className={styles.loadingState__spinner}></div>
              <div className={styles.loadingState__text}>LOADING WORKOUTS...</div>
              <div className={styles.loadingState__subtext}>💪 FETCHING WORKOUT DATA</div>
            </div>
          </div>
        ) : workouts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyState__content}>
              <Dumbbell className={styles.emptyState__icon} size={48} />
              <div className={styles.emptyState__text}>NO WORKOUTS LOGGED</div>
              <div className={styles.emptyState__subtext}>START YOUR FITNESS JOURNEY!</div>
            </div>
          </div>
        ) : (
          <div className={styles.workoutsList}>
            {workouts.map((workout, index) => (
              <WorkoutCard key={`${workout._id}-${index}`} workout={workout} />
            ))}

            {/* Load more indicator */}
            {loadingMore && (
              <div className={styles.loadingMore}>
                <div className={styles.loadingMore__content}>
                  <div className={styles.loadingMore__spinner}></div>
                  <div className={styles.loadingMore__text}>LOADING MORE...</div>
                  <div className={styles.loadingMore__subtext}>⚡ FETCHING NEXT BATCH</div>
                </div>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && workouts.length > 0 && (
              <div className={styles.endOfList}>
                <div className={styles.endOfList__content}>
                  <div className={styles.endOfList__text}>
                    🎯 END OF WORKOUT LOG
                  </div>
                  <div className={styles.endOfList__subtext}>
                    TOTAL WORKOUTS: {workouts.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewWorkouts;