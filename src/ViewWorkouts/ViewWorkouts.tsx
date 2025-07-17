import React, { useState, useEffect, useRef } from 'react';
import { X, Dumbbell, Zap, Shield, Brain, Heart, Timer, Target, ShieldPlus, Rabbit, Castle, Bone, Fish, Clock, MapPin, Activity, ActivityIcon } from 'lucide-react';

import api from '../api/api';
import { WorkoutLog } from '../types/user.types';
import { useUser } from '../context/UserContext';
import styles from './ViewWorkouts.module.scss'
import { HevyWorkout } from '../types/hevyWorkout.types';

type AnyWorkout = WorkoutLog | HevyWorkout;

const ViewWorkouts = () => {
  const {userData} = useUser();
  const [workouts, setWorkouts] = useState<AnyWorkout[]>([]);
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

  // Convert kg to lbs and round to nearest 0.5
  const convertToLbs = (weightKg: number) => {
    const lbs = weightKg * 2.20462;
    return Math.round(lbs * 2) / 2; // Round to nearest 0.5
  };

  const formatWeight = (weightKg: number) => {
    const lbs = convertToLbs(weightKg);
    return lbs % 1 === 0 ? `${lbs}` : `${lbs.toFixed(1)}`;
  };

  // Format duration from seconds to readable format
  const formatDurationFromSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  // Format distance from meters
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      const km = (meters / 1000).toFixed(2);
      return `${km}km`;
    }
    return `${meters}m`;
  };

  // Format set data based on available metrics
  const formatSetData = (set: any) => {
    const parts = [];
    
    // Add weight if available
    if (set.weight_kg || set.weightKg) {
      const weight = set.weight_kg || set.weightKg;
      parts.push(`${formatWeight(weight)}lbs`);
    }
    
    // Add reps if available
    if (set.reps) {
      parts.push(`× ${set.reps}`);
    }
    
    // Add distance if available (and no reps)
    if (set.distance_meters && !set.reps) {
      parts.push(formatDistance(set.distance_meters));
    }
    
    // Add duration if available (and no reps)
    if (set.duration_seconds && !set.reps) {
      parts.push(formatDurationFromSeconds(set.duration_seconds));
    }
    
    // If nothing else, show "—"
    if (parts.length === 0) {
      return "—";
    }
    
    return parts.join(' ');
  };

  type StatBoostProps = {
    icon: React.ComponentType<{ size?: string | number; className?: string }>;
    label: string;
    value: number;
    color: string;
  };

  const StatBoost: React.FC<StatBoostProps> = ({ icon: Icon, label, value, color }) => (
    <div className={`${styles.statBoost} ${styles[`statBoost--${color}`]}`}>
      <Icon size={16} className={styles.statBoost__icon} />
      <span className={styles.statBoost__label}>{label}</span>
      <span className={styles.statBoost__value}>+{value}</span>
    </div>
  );

  const WorkoutCard: React.FC<{ workout: AnyWorkout }> = ({ workout }) => {
    const isManual = workout.logType === 'manual';
    const isRoutine = workout.logType === 'routine';
    const isHevy = workout.logType === 'hevy';
  
    const totalXp = isHevy ? workout.petAffects.pet : workout.workoutXp.pet;
  
    return (
      <div className={styles.workoutCard}>
        {/* Header */}
        <div className={styles.workoutCard__header}>
          <div className={styles.workoutCard__info}>
            <h3 className={styles.workoutCard__title}>
              {isRoutine
                ? `${workout.routineDay} ROUTINE`
                : isHevy
                ? `${workout.title?.toUpperCase() || "HEVY WORKOUT"}`
                : `${workout?.workoutType?.toUpperCase()} SESSION`}
            </h3>
            <p className={styles.workoutCard__timestamp}>
              <Clock size={12} className={styles.workoutCard__timestampIcon} />
              {formatDate(isHevy ? workout.startTime : workout.timestamp)}
            </p>
          </div>
          <div className={styles.workoutCard__xp}>
            <div className={styles.workoutCard__xpValue}>{totalXp}</div>
            <div className={styles.workoutCard__xpLabel}>XP</div>
          </div>
        </div>
  
        {/* Hevy-specific exercise list */}
        {isHevy && (
          <div className={styles.workoutCard__exercises}>
            <div className={styles.workoutCard__sectionTitle}>
              <Dumbbell size={14} />
              EXERCISES
            </div>
            <div className={styles.workoutCard__exercisesList}>
              {workout.exercises.map((exercise, index) => (
                <div key={index} className={styles.exerciseItem}>
                  <div className={styles.exerciseItem__name}>{exercise.title?.toUpperCase()}</div>
                  <div className={styles.exerciseItem__sets}>
                    {exercise.sets.map((set, i) => (
                      <div key={i} className={styles.setCard} data-set-number={i + 1}>
                        <div className={styles.setCard__data}>
                          {formatSetData(set)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {exercise.notes && (
                    <div className={styles.exerciseItem__notes}>
                      "{exercise.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* XP Boosts */}
        <div className={styles.workoutCard__statBoosts}>
          <div className={styles.workoutCard__sectionTitle}>
            <Zap size={14} />
            Skills GAINED
          </div>
          <div className={styles.workoutCard__statBoostsGrid}>
            {(isHevy ? workout.petAffects.strength : workout.workoutXp.strength) > 0 && (
              <StatBoost icon={Shield} label="STR" value={isHevy ? workout.petAffects.strength : workout.workoutXp.strength} color="red" />
            )}
            {(isHevy ? workout.petAffects.agility : workout.workoutXp.agility) > 0 && (
              <StatBoost icon={Rabbit} label="AGI" value={isHevy ? workout.petAffects.agility : workout.workoutXp.agility} color="yellow" />
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
            <div className={styles.workoutCard__notesText}>
              "{workout.notes}"
            </div>
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
          <Dumbbell className={styles.drawer__headerIcon} size={28} />
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
              <Dumbbell className={styles.emptyState__icon} size={40} />
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