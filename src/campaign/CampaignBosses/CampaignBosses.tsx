import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon, LockIcon, SwordIcon, TrophyIcon, SkullIcon  } from 'lucide-react';
import styles from './CampaignBosses.module.scss';
import { useUser } from '../../context/UserContext';
import { PetStats } from '../../types/user.types';
import AnimatedBoss from '../AnimatedBoss/AnimatedBoss';
import api from '../../api/api';

type BossAnimationDefinition = {
    name: string;
    spriteSrc: string;
    startFrame: number;
    frameCount: number;
    fps: number;
    columns: number;
    frameWidth: number;
    frameHeight: number;
    scale: number;
  };
  
  const bossAnimationsMap: Record<string, BossAnimationDefinition[]> = {
    "dwarf-warrior": [
      {
        name: "idle",
        spriteSrc: "/assets/sprites/bosses/dwarf/IDLE.png",
        startFrame: 0,
        frameCount: 3,
        fps: 3,
        columns: 3,
        frameWidth: 100,
        frameHeight: 100,
        scale: 1.5,
      },
      {
        name: "attack",
        spriteSrc: "/assets/sprites/bosses/dwarf/ATTACK.png",
        startFrame: 0,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 100,
        frameHeight: 100,
        scale: 1.5
      },
      {
        name: "death",
        spriteSrc: "/assets/sprites/bosses/dwarf/DEATH.png",
        startFrame: 5,
        frameCount: 6,
        fps: 0,
        columns: 6,
        frameWidth: 100,
        frameHeight: 100,
        scale: 1.5
      },
    ],
    "witch": [
      {
        name: "attack",
        spriteSrc: "/assets/sprites/bosses/witch/ATTACK.png",
        startFrame: 0,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 125,
        frameHeight: 125,
        scale: 1.3,
      },
      {
        name: "idle",
        spriteSrc: "/assets/sprites/bosses/witch/IDLE.png",
        startFrame: 0,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 125,
        frameHeight: 125,
        scale: 1.3
      },
    ],
    "headless-horseman": [
        {
          name: "idle",
          spriteSrc: "/assets/sprites/bosses/headless-horseman/IDLE.png",
          startFrame: 0,
          frameCount: 4,
          fps: 2,
          columns: 4,
          frameWidth: 150,
          frameHeight: 150,
          scale: 1,
        },
        {
          name: "attack",
          spriteSrc: "/assets/sprites/bosses/headless-horseman/ATTACK.png",
          startFrame: 0,
          frameCount: 8,
          fps: 4,
          columns: 8,
          frameWidth: 150,
          frameHeight: 150,
          scale: 1
        },
      ],
    // Add more bosses as needed
  };

const getTotalPetStats = (pet: PetStats | undefined) => {
    if (!pet) return 0;
  
    return Object.entries(pet)
      .filter(([key]) => !['name', 'currentPet', 'xp'].includes(key))
      .reduce((sum, [, val]) => sum + (typeof val === 'number' ? val : 0), 0);
  };
  

export interface MiniBoss {
  _id: string;
  chapter: number;
  bossNumber: number;
  name: string;
  requiredSkillTotal: number;
  weakness?: string;
  reward: {
    xp?: number;
    item?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CampaignBossesProps {
  bosses: MiniBoss[];
  onFightBoss?: (boss: MiniBoss) => void;
}

const CampaignBosses: React.FC<CampaignBossesProps> = ({
  bosses = [],
  onFightBoss
}) => {
    const {userData, setUserData} = useUser();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: false
  });

  // Get unique chapters from bosses
  const availableChapters = [...new Set(bosses.map(boss => boss.chapter))].sort((a, b) => a - b);

  // Filter bosses by selected chapter
  const currentChapterBosses = bosses
  .filter(boss => boss.chapter === userData?.currentChapter)
  .sort((a, b) => a.bossNumber - b.bossNumber);

  // Initialize selected chapter when bosses change
  useEffect(() => {
    if (availableChapters.length > 0 && !availableChapters.includes(selectedChapter)) {
      setSelectedChapter(availableChapters[0]);
    }
  }, [availableChapters, selectedChapter]);

  // Carousel navigation
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const handleFightBoss = (boss: MiniBoss) => {
    const totalStats = getTotalPetStats(userData?.pet);
    console.log('stats : ' + totalStats);
    const canFight =
      userData?.currentChapter === boss.chapter &&
      userData?.currentBossNumber === boss.bossNumber;
  
    if (!canFight) {
      alert("You must defeat earlier bosses before this one!");
      return;
    }
  
    if (totalStats >= boss.requiredSkillTotal) {
      alert(`Victory! You defeated ${boss.name}.`);
      api.post(`/miniboss/defeatBoss/${userData?.uid}`).then((res) => {
        alert(`Victory! You defeated ${boss.name}.`);
        setUserData(res.data.updatedUser);
      }).catch(err => {
        console.log(err);
      });

    
  
      // Advance to next boss or chapter
      const isFinalBossInChapter = bosses.filter(b => b.chapter === boss.chapter).length === boss.bossNumber;
  
    } else {
      alert("You lost! Train your pet more before trying again.");
    }
  };

  const BossCard: React.FC<{ boss: MiniBoss }> = ({ boss }) => {
    const isCurrent = userData?.currentChapter === boss.chapter && userData.currentBossNumber === boss.bossNumber;
    const isDefeated = userData?.defeatedBosses.some(
        (b) => b.chapter === boss.chapter && b.bossNumber === boss.bossNumber
      );
return (
    <div className={styles.bossCard}>
         {isDefeated && (
    <div className={styles.defeatedOverlay}>
      <SkullIcon />
    </div>
  )}
        <div className={styles.bossNumber}>{boss.bossNumber}</div>
      <div className={styles.bossSprite}>
        <div className={styles.spriteContainer}>
        <AnimatedBoss 
    bossKey={boss.name.toLowerCase().replace(/\s+/g, '-')}
    animations={bossAnimationsMap}
    isDead={isDefeated}
  />
          {/* <div className={styles.sprite} data-boss={boss.name.toLowerCase().replace(/\s+/g, '-')} /> */}
        </div>
      </div>
      
      <div className={styles.bossInfo}>
        <h3 className={styles.bossName}>{boss.name}</h3>
        
        <div className={styles.bossStats}>
          {boss.weakness && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Weakness:</span>
              <span className={styles.statValue}>{boss.weakness}</span>
            </div>
          )}
        </div>
        
        {(boss.reward.xp || boss.reward.item) && (
          <div className={styles.rewards}>
            <TrophyIcon className={styles.rewardIcon} />
            <div className={styles.rewardList}>
              {boss.reward.xp && <span>{boss.reward.xp} XP</span>}
              {boss.reward.item && <span>{boss.reward.item}</span>}
            </div>
          </div>
        )}
        
        {!isDefeated && <button
  className={styles.fightButton}
  onClick={() => handleFightBoss(boss)}
  disabled={!isCurrent}
>
  { isCurrent ? <SwordIcon className={styles.fightIcon} /> : <LockIcon className={styles.fightIcon} />}
  {isCurrent ? "Fight Boss" : "Locked"}
</button>}
      </div>
    </div>
);
  };

  if (availableChapters.length === 0) {
    return (
      <div className={styles.campaignBosses}>
        <div className={styles.noBosses}>
          <p>No campaign bosses available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.campaignBosses}>
      <div className={styles.chapterSelector}>
        <label className={styles.chapterLabel}>Select Chapter</label>
        <select 
          value={selectedChapter} 
          onChange={(e) => setSelectedChapter(Number(e.target.value))}
          className={styles.chapterSelect}
        >
          {availableChapters.map(chapter => (
            <option key={chapter} value={chapter}>
              Chapter {chapter}
            </option>
          ))}
        </select>
      </div>

      {bosses.length > 0 ? (
        <div className={styles.carouselContainer}>
          <div className={styles.embla} ref={emblaRef}>
            <div className={styles.emblaContainer}>
              {bosses.map((boss) => (
                <div key={boss._id} className={styles.emblaSlide}>
                  <BossCard boss={boss} />
                </div>
              ))}
            </div>
          </div>

          {/* {currentChapterBosses.length > 1 && (
            <div className={styles.carouselControls}>
              <button 
                className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
              >
                <ChevronLeftIcon />
              </button>
              <button 
                className={`${styles.carouselBtn} ${styles.carouselBtnNext}`}
                onClick={scrollNext}
                disabled={nextBtnDisabled}
              >
                <ChevronRightIcon />
              </button>
            </div>
          )} */}
        </div>
      ) : (
        <div className={styles.noBosses}>
          <p>No bosses available for Chapter {selectedChapter}</p>
        </div>
      )}
    </div>
  );
};

export { CampaignBosses };