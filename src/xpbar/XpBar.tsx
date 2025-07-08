import React, { useEffect, useRef, useState } from 'react';
import styles from './XpBar.module.scss';
import {Text} from '@salt-ds/core';

type XpBarProps = {
  currentXp: number;
  level: number;
};

function xpToNextLevel(level: number): number {
  return 100 + level * 50;
}

// function getXpProgress(currentXp: number, level: number): number {
//   let xpForCurrentLevel = 0;
//   for (let i = 1; i < level; i++) {
//     xpForCurrentLevel += xpToNextLevel(i);
//   }

//   const currentLevelXp = currentXp - xpForCurrentLevel;
//   const nextLevelXp = xpToNextLevel(level);
//   const percent = (currentLevelXp / nextLevelXp) * 100;
//   return Math.min(Math.max(percent, 0), 100);
// }

export function xpNeededForLevel(level: number) {
  const baseXp = 1000;       // XP needed to reach level 2
  const growthFactor = 1.5;  // XP multiplies by this factor each level
  return Math.floor(baseXp * Math.pow(growthFactor, level - 1));
}

function getXpLevelInfo(currentXp: number, level: number) {

  const xpNeeded = xpNeededForLevel(level);
  const progress = Math.min(Math.max((currentXp / xpNeeded) * 100, 0), 100);

  return {
    progress,
    xpNeeded,
  };
}

const XpBar: React.FC<XpBarProps> = ({ currentXp, level }) => {
  const [progress, setProgress] = useState(() => getXpLevelInfo(currentXp, level).progress);
  const prevXpRef = useRef(currentXp);
  const {xpNeeded } = getXpLevelInfo(currentXp, level);

  useEffect(() => {
    const newProgress = getXpLevelInfo(currentXp, level).progress;
    const prevXp = prevXpRef.current;

    if (currentXp > prevXp) {
      // Animate only on XP increase
      setProgress(newProgress);
    } else {
      // Instantly update without animation
      setProgress(newProgress);
    }

    prevXpRef.current = currentXp;
  }, [currentXp, level]);

  return (<>
    <Text className={styles.levelText} styleAs='display4'>Level {level}</Text>
    <div className={styles.xpBarWrapper}>
      <div
        className={styles.xpBarFill}
        style={{ width: `${progress}%` }}
      />
      <Text className={styles.xpText} styleAs='label'> {currentXp} / {xpNeeded}</Text>
      {/* <div className={styles.xpText}>
        {currentLevelXp} / {xpNeeded}
      </div> */}
    </div>
    </>
  );
};

export default XpBar;