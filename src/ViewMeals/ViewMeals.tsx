import React, { useState, useEffect, useRef } from 'react';
import { X, Utensils, Zap, Shield, Brain, Heart, Droplets, Apple, ShieldPlus, Rabbit, Castle, Bone, Fish } from 'lucide-react';
import api from '../api/api';
import { LoggedMeal } from '../types/user.types';
import { useUser } from '../context/UserContext';
import styles from './ViewMeals.module.scss'

const ViewMeals = () => {
  const {userData} = useUser();
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 10;

  const fetchMeals = async (currentOffset = offset, isInitial = false) => {
  if (isInitial) {
    setLoading(true);
  } else {
    setLoadingMore(true);
  }

  try {
    const response = await api.get(
      `/users/${userData?.uid}/meals?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
    );
    const data = response.data;
    const newMeals = data.meals || [];

    if (isInitial) {
      setMeals(newMeals);
    } else {
      setMeals((prev) => [...prev, ...newMeals]);
    }

    // ✅ Better hasMore logic using total count from backend
    const total = data.total || 0;
    const loadedSoFar = currentOffset + newMeals.length;
    setHasMore(loadedSoFar < total);

    setOffset(currentOffset + newMeals.length); // more robust than ITEMS_PER_PAGE in case backend ever returns fewer
  } catch (error) {
    console.error("Error fetching meals:", error);

    // Optional fallback for local development if using mock data
    // Only use this if mockMeals exists
    // const startIndex = currentOffset;
    // const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, mockMeals.length);
    // const paginatedMeals = mockMeals.slice(startIndex, endIndex);
    // ...
    // setMeals(...);
    // setHasMore(...);
  }

  setLoading(false);
  setLoadingMore(false);
};

useEffect(() => {
  fetchMeals(0, true); // Fetch initial page on mount
}, []);


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when user scrolls to bottom (with 100px buffer)
    if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loadingMore) {
      fetchMeals(offset, false);
    }
  };

  const formatDate = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  type StatBoostProps = {
    icon: React.ComponentType<{ size?: string | number; className?: string }>;
    label: string;
    value: number;
    color: string;
  };

  const StatBoost: React.FC<StatBoostProps> = ({ icon: Icon, label, value, color }) => (
       <div className={`${styles.statBoost} ${styles[`statBoost--${color}`]}`}>
      <Icon size={12} className={styles.statBoost__icon} />
      <span className={styles.statBoost__label}>{label}</span>
      <span className={styles.statBoost__value}>+{value}</span>
    </div>
  );

   const MealCard: React.FC<{ meal: LoggedMeal }> = ({ meal }) => (
    <>
    <div className={styles.mealCard}>
           {/* Header */}
           <div className={styles.mealCard__header}>
               <div className={styles.mealCard__info}>
                   <h3 className={styles.mealCard__title}>{meal.description}</h3>
                   <p className={styles.mealCard__timestamp}>{formatDate(meal.timestamp)}</p>
               </div>
               <div className={styles.mealCard__calories}>
                   <div className={styles.mealCard__caloriesValue}>{meal.calories}</div>
                   <div className={styles.mealCard__caloriesLabel}>CAL</div>
               </div>
           </div>

       {/* Macros */}
       <div className={styles.mealCard__macros}>
         <div className={`${styles.macroItem} ${styles['macroItem--protein']}`}>
           <div className={styles.macroItem__value}>{meal.protein}g</div>
           <div className={styles.macroItem__label}>PROTEIN</div>
         </div>
         <div className={`${styles.macroItem} ${styles['macroItem--carbs']}`}>
           <div className={styles.macroItem__value}>{meal.carbs}g</div>
           <div className={styles.macroItem__label}>CARBS</div>
         </div>
         <div className={`${styles.macroItem} ${styles['macroItem--fat']}`}>
           <div className={styles.macroItem__value}>{meal.fat}g</div>
           <div className={styles.macroItem__label}>FAT</div>
         </div>
       </div>

      {/* Additional Stats */}
      <div className={styles.mealCard__additionalStats}>
        <div className={styles.additionalStat}>
          <Droplets size={16} className={styles.additionalStat__icon} />
          <div className={styles.additionalStat__content}>
            <div className={styles.additionalStat__value}>{meal.fluid_intake_ml}ml</div>
            <div className={styles.additionalStat__label}>FLUID</div>
          </div>
        </div>
        <div className={styles.additionalStat}>
          <Apple size={16} className={styles.additionalStat__icon} />
          <div className={styles.additionalStat__content}>
            <div className={styles.additionalStat__value}>{meal.servings_of_fruits_vegetables}</div>
            <div className={styles.additionalStat__label}>FRUIT/VEG</div>
          </div>
        </div>
      </div>

      {/* Stat Boosts */}
      <div className={styles.mealCard__statBoosts}>
        <div className={styles.mealCard__statBoostsTitle}>STAT BOOSTS</div>
        <div className={styles.mealCard__statBoostsGrid}>
          {meal.mealAffects.armorIncrease > 0 && (
            <StatBoost icon={ShieldPlus} label="ARM" value={meal.mealAffects.armorIncrease} color="blue" />
          )}
          {meal.mealAffects.speedIncrease > 0 && (
            <StatBoost icon={Rabbit} label="SPD" value={meal.mealAffects.speedIncrease} color="yellow" />
          )}
          {meal.mealAffects.intelligenceIncrease > 0 && (
            <StatBoost icon={Brain} label="INT" value={meal.mealAffects.intelligenceIncrease} color="pink" />
          )}
          {meal.mealAffects.defenseIncrease > 0 && (
            <StatBoost icon={Castle} label="DEF" value={meal.mealAffects.defenseIncrease} color="red" />
          )}
        </div>
      </div>

      {/* Currency Display */}
      <div className={styles.mealCard__currency}>
        <span className={styles.mealCard__currencyText}>
             {userData?.pet.currentPet === 'puppy' ? (
    <>
      <Bone size={15} style={{ verticalAlign: 'middle' }} />
    </>
  ) : (
    <>
      <Fish size={15} style={{ verticalAlign: 'middle' }} />
    </>
  )}
  {' ' + meal.currency}
            </span>
      </div>
    </div>
    </>
  );

return (
  <>
    {/* Header */}
    <div className={styles.drawer__header}>
          <div className={styles.drawer__headerContent}>
            <Utensils className={styles.drawer__headerIcon} size={32} />
            <h2 className={styles.drawer__title}>Meal Log</h2>
          </div>
        </div>

    {/* Content */}
    <div
      className="p-4 overflow-y-auto"
      style={{ maxHeight: 'calc(80vh - 80px)' }}
      onScroll={handleScroll}
      ref={scrollContainer}
    >
      {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingState__content}>
                <div className={styles.loadingState__text}>Loading meals...</div>
                <div className={styles.loadingState__subtext}>📖 Fetching your meal history</div>
              </div>
            </div>
          ) : meals.length === 0 ? (
            <div className={styles.emptyState}>
              <Utensils className={styles.emptyState__icon} size={48} />
              <div className={styles.emptyState__text}>No meals logged yet</div>
              <div className={styles.emptyState__subtext}>Start tracking your meals to see them here!</div>
            </div>
          ) : (
            <div className={styles.mealsList}>
              {meals.map((meal, index) => (
                <MealCard key={`${meal.id}-${index}`} meal={meal} />
              ))}

           {/* Load more indicator */}
              {loadingMore && (
                <div className={styles.loadingMore}>
                  <div className={styles.loadingMore__content}>
                    <div className={styles.loadingMore__text}>Loading more meals...</div>
                    <div className={styles.loadingMore__subtext}>⚡ Fetching next batch</div>
                  </div>
                </div>
              )}

         {/* End of list indicator */}
              {!hasMore && meals.length > 0 && (
                <div className={styles.endOfList}>
                  <div className={styles.endOfList__text}>
                    🎯 You've reached the end of your meal log!
                  </div>
                  <div className={styles.endOfList__subtext}>
                    Total meals loaded: {meals.length}
                  </div>
                </div>
              )}
        </div>
      )}
    </div>
  </>
);
};

export default ViewMeals;