import React, { useState, useEffect } from 'react';
import styles from './EvolutionAnimation.module.scss';

type EvolutionStage = 'charging' | 'explosion' | 'complete';

interface EvolutionAnimationProps {
  nextPet: string | null;
  onComplete?: (stage: EvolutionStage) => void;
}

const EvolutionAnimation: React.FC<EvolutionAnimationProps> = ({ nextPet, onComplete }) => {
  const [stage, setStage] = useState<EvolutionStage>('charging');
  
    useEffect(() => {
      const timer1 = setTimeout(() => {
        setStage('explosion');
      }, 2000);
  
      const timer2 = setTimeout(() => {
        setStage('complete');
        if (onComplete) {
          onComplete('complete');
        }
      }, 3500);
  
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }, [onComplete]);
  
    if (stage === 'charging') {
        return (
          <div className={styles.evolutionContainer}>
            <div className={styles.energyBox}>
              <div className={styles.energyCore}></div>
              <div className={`${styles.energyRing} ${styles.ring1}`}></div>
              <div className={`${styles.energyRing} ${styles.ring2}`}></div>
              <div className={`${styles.energyRing} ${styles.ring3}`}></div>
              <div className={`${styles.lightning} ${styles.lightning1}`}></div>
              <div className={`${styles.lightning} ${styles.lightning2}`}></div>
              <div className={`${styles.lightning} ${styles.lightning3}`}></div>
              <div className={`${styles.lightning} ${styles.lightning4}`}></div>
            </div>
            <div className={styles.evolutionText}>EVOLVING...</div>
          </div>
        );
      }
    
      if (stage === 'explosion') {
        return (
          <div className={styles.explosionContainer}>
            <div className={styles.explosionFlash}></div>
            <div className={styles.explosionCore}></div>
            <div className={`${styles.explosionRing} ${styles.ring1}`}></div>
            <div className={`${styles.explosionRing} ${styles.ring2}`}></div>
            <div className={`${styles.explosionRing} ${styles.ring3}`}></div>
            <div className={`${styles.explosionRing} ${styles.ring4}`}></div>
            <div className={styles.explosionText}>EVOLUTION COMPLETE!</div>
          </div>
        );
      }
    
      return null;
    };

    export default EvolutionAnimation;