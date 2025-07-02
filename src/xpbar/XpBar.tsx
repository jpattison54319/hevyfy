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

function getXpLevelInfo(currentXp: number, level: number) {
  let xpForCurrentLevel = 0;
  for (let i = 1; i < level; i++) {
    xpForCurrentLevel += xpToNextLevel(i);
  }

  const currentLevelXp = currentXp - xpForCurrentLevel;
  const xpNeeded = xpToNextLevel(level);
  const progress = Math.min(Math.max((currentLevelXp / xpNeeded) * 100, 0), 100);

  return {
    progress,
    currentLevelXp,
    xpNeeded,
  };
}

const XpBar: React.FC<XpBarProps> = ({ currentXp, level }) => {
  const [progress, setProgress] = useState(() => getXpLevelInfo(currentXp, level).progress);
  const prevXpRef = useRef(currentXp);
  const { currentLevelXp, xpNeeded } = getXpLevelInfo(currentXp, level);

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
    <Text styleAs='display4'>Level {level}</Text>
    <div className={styles.xpBarWrapper}>
      <div
        className={styles.xpBarFill}
        style={{ width: `${progress}%` }}
      />
      <Text className={styles.xpText} styleAs='label'> {currentLevelXp} / {xpNeeded}</Text>
      {/* <div className={styles.xpText}>
        {currentLevelXp} / {xpNeeded}
      </div> */}
    </div>
    </>
  );
};

export default XpBar;