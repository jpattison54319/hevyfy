// WorkoutScreen.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './WorkoutScreen.module.scss';
import { Checkbox, Input } from '@headlessui/react';
import { Club, Diamond, Heart, Spade } from 'lucide-react';
import WorkoutTimer from '../WorkoutTimer/WorkoutTimer';

export interface ExerciseSet {
  weight: number;
  reps: number;
  completed?: boolean;
}

export interface ExerciseCardData {
    dayName: string;
    exercise: string;
    repRange: string;
    sets: ExerciseSet[];
    cardId?: string;
    displayIndex?: number;
    originalIndex?: number;
  }

export interface WorkoutScreenProps {
  exercises: ExerciseCardData[];
  onFinish: (data: { duration: number; exercises: ExerciseCardData[] }) => void;
}

const WorkoutScreen = ({ exercises, onFinish }: WorkoutScreenProps) => {
  const [startTime] = useState(Date.now());
  const [cards, setCards] = useState(
    exercises.map((e, i) => ({ ...e, cardId: `${e.exercise}-${i}` }))
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cardCycleCount, setCardCycleCount] = useState(0);
  const [exitingCardId, setExitingCardId] = useState<string | null>(null);
  const [exitAnimationDuration, setExitAnimationDuration] = useState(0.4);

  const calculateAnimationDuration = (velocity: number, distance: number) => {
    // Base duration of 0.4s, but adjust based on velocity and distance
    const baseTime = 0.4;
    const velocityFactor = Math.abs(velocity) / 1000; // Normalize velocity
    const distanceFactor = Math.abs(distance) / 300; // Normalize distance
    
    // Faster swipes = shorter duration, slower swipes = longer duration
    // But keep it within reasonable bounds (0.2s to 0.6s)
    const dynamicDuration = Math.max(0.2, Math.min(0.6, baseTime - velocityFactor * 0.15 + distanceFactor * 0.1));
    
    return dynamicDuration;
  };

  const swipeCard = (velocity: number, distance: number) => {
    const currentTopCard = getDisplayedCards()[0];
    if (currentTopCard) {
      const animDuration = calculateAnimationDuration(velocity, distance);
      setExitAnimationDuration(animDuration);
      setExitingCardId(currentTopCard.cardId);
      
      // Use the calculated duration for the timeout
      setTimeout(() => {
        setCards((prev) => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        setCardCycleCount(count => count + 1);
        setExitingCardId(null);
      }, animDuration * 1000); // Convert to milliseconds
    }
  };


  const updateSet = (
    cardId: string,
    setIndex: number,
    key: keyof ExerciseSet,
    value: number | boolean
  ) => {
    setCards((prev) => {
      const updatedCards = prev.map((card) => {
        if (card.cardId === cardId) {
          const updatedSets = card.sets.map((set, index) =>
            index === setIndex ? { ...set, [key]: value } : set
          );
          return { ...card, sets: updatedSets };
        }
        return card;
      });
      return updatedCards;
    });
  };

  const getDisplayedCards = () => {
    const totalCards = cards.length;
    if (totalCards === 0) return [];
    const startIndex = cardCycleCount % totalCards;
    const displayCards = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % totalCards;
      if (cards[index]) {
        displayCards.push({
            ...cards[index],
            displayIndex: i,
            originalIndex: index
          });
      }
    }
    return displayCards;
  };

  const suits = [<Spade size={32} color="#ff4d4d"/>, <Club size={32} color="#ff4d4d"/>, <Heart size={32} color="#ff4d4d" />, <Diamond size={32} color="#ff4d4d" />];

const getRandomSuitIcon = () => {
  const index = Math.floor(Math.random() * suits.length);
  return suits[index];
};

const suitToRender = getRandomSuitIcon();

  return (
    <div className={styles.fullScreenWrapper}>
        <div style={{display: 'flex', flexDirection: 'column', fontSize: '19px', gap: '16px', alignItems: 'center'}}>
            <div>{exercises[0].dayName}</div>
            <div className={styles.timer}>
            <WorkoutTimer startTime={startTime} />
                </div>
        </div>
      <div className={styles.deckContainer}>
        <AnimatePresence initial={false}>
          {getDisplayedCards().map((card, index) => {
            const isTop = index === 0;
            const isExiting = card.cardId === exitingCardId;

            return (
            <motion.div
            key={`${card.cardId}-cycle-${cardCycleCount}-${index}`}
            className={styles.card}
              initial={{ x: 0, y: index * 20, zIndex: 100 - index }}
              animate={{ 
                x: 0, 
                scale: 1 - index * 0.02, 
                y: index * 20, 
                zIndex: 100 - index 
              }}
              exit={{ 
                y: -400, 
                opacity: 0, 
                zIndex: 100 - index,
                transition: { 
                  duration: exitAnimationDuration,
                  ease: "easeOut"
                }
              }}
              transition={{ duration: 0.3 }}
              drag={isTop && !isExiting ? 'y' : false}
              dragElastic={0.2}
              whileTap={{ scale: 0.98 }}
              dragConstraints={{ top: -400, bottom: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.y < -100 && !isExiting) {
                  swipeCard(info.velocity.y, info.offset.y);
                }
              }}
            >
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>
                 <span className={styles.cardSuitTop}>
                    {suitToRender}
                 </span>
                 </div>
              <div className={styles.exerciseTitle}>{card.exercise}</div>
              <div className={styles.repRange}>Target: {card.repRange} reps</div>
              </div>
              <div className={styles.setGrid}>
              <div className={styles.setHeaderRow}>
    <span className={styles.setLabel}>Set</span>
    <span className={styles.inputLabel}>Weight</span>
    <span className={styles.inputLabel}>Reps</span>
    <span className={styles.checkboxLabel}>✔</span>
  </div>
  {card.sets.map((set, setIndex) => (
    <div className={styles.setRow} key={setIndex}>
      <span className={styles.setLabel}>{setIndex + 1}</span>
      <Input
  type="number"
  value={set.weight === 0 ? '' : set.weight}
  placeholder="Weight"
  className={styles.compactInput}
  onChange={(e) => updateSet(card.cardId!, setIndex, 'weight', Number(e.target.value))}
/>
<Input
  type="number"
  value={set.reps === 0 ? '' : set.reps}
  placeholder="Reps"
  className={styles.compactInput}
  onChange={(e) => updateSet(card.cardId!, setIndex, 'reps', Number(e.target.value))}
/>
          <Checkbox
  checked={set.completed ?? false}
  onChange={(checked) => {
    updateSet(card.cardId!, setIndex, 'completed', checked);
  }}
  className={({ checked }) =>
    `${styles.setCheckbox} ${checked ? styles.checked : ''}`
  }
>
  <span aria-hidden="true">{set.completed ? '✔' : ''}</span>
</Checkbox>
    </div>
  ))}
  <span className={styles.cardSuitBottom}>{suitToRender}</span>
</div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <button className={styles.finishButton} onClick={() => onFinish({ duration: elapsedTime, exercises: cards })}>
        Finish Workout
      </button>
    </div>
  );
};

export default WorkoutScreen;