import React, { useState } from 'react';
import { SwordIcon, TrophyIcon, SearchIcon, FilterIcon } from 'lucide-react';
import styles from './CommunityBosses.module.scss';

interface MiniBoss {
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

interface CommunityBossesProps {
  bosses: MiniBoss[];
  onFightBoss?: (boss: MiniBoss) => void;
}

const CommunityBosses: React.FC<CommunityBossesProps> = ({
  bosses = [],
  onFightBoss
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'skill' | 'chapter'>('name');

  // Get unique chapters for filter
  const availableChapters = [...new Set(bosses.map(boss => boss.chapter))].sort((a, b) => a - b);

  // Filter and sort bosses
  const filteredBosses = bosses
    .filter(boss => {
      const matchesSearch = boss.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           boss.weakness?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChapter = selectedChapter === 'all' || boss.chapter === selectedChapter;
      return matchesSearch && matchesChapter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'skill':
          return a.requiredSkillTotal - b.requiredSkillTotal;
        case 'chapter':
          return a.chapter - b.chapter || a.bossNumber - b.bossNumber;
        default:
          return 0;
      }
    });

  const handleFightBoss = (boss: MiniBoss) => {
    onFightBoss?.(boss);
  };

  const CommunityBossCard: React.FC<{ boss: MiniBoss }> = ({ boss }) => (
    <div className={styles.communityBossCard}>
      <div className={styles.bossHeader}>
        <h3 className={styles.bossName}>{boss.name}</h3>
        <span className={styles.chapterBadge}>Chapter {boss.chapter}</span>
      </div>
      
      <div className={styles.bossSprite}>
        <div className={styles.spriteContainer}>
          <div className={styles.sprite} data-boss={boss.name.toLowerCase().replace(/\s+/g, '-')} />
        </div>
      </div>
      
      <div className={styles.bossDetails}>
        <div className={styles.skillRequirement}>
          <span className={styles.skillLabel}>Required Skill:</span>
          <span className={styles.skillValue}>{boss.requiredSkillTotal}</span>
        </div>
        
        {boss.weakness && (
          <div className={styles.weakness}>
            <span className={styles.weaknessLabel}>Weakness:</span>
            <span className={styles.weaknessValue}>{boss.weakness}</span>
          </div>
        )}

        {(boss.reward.xp || boss.reward.item) && (
          <div className={styles.rewards}>
            <TrophyIcon className={styles.rewardIcon} />
            <div className={styles.rewardList}>
              {boss.reward.xp && <span>{boss.reward.xp} XP</span>}
              {boss.reward.item && <span>{boss.reward.item}</span>}
            </div>
          </div>
        )}
        
        <button 
          className={styles.fightButton}
          onClick={() => handleFightBoss(boss)}
        >
          <SwordIcon className={styles.fightIcon} />
          Challenge Boss
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.communityBosses}>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search bosses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <FilterIcon className={styles.filterIcon} />
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className={styles.filterSelect}
            >
              <option value="all">All Chapters</option>
              {availableChapters.map(chapter => (
                <option key={chapter} value={chapter}>
                  Chapter {chapter}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'skill' | 'chapter')}
              className={styles.filterSelect}
            >
              <option value="name">Sort by Name</option>
              <option value="skill">Sort by Skill</option>
              <option value="chapter">Sort by Chapter</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <span className={styles.resultCount}>
          {filteredBosses.length} boss{filteredBosses.length !== 1 ? 'es' : ''} found
        </span>
      </div>

      {filteredBosses.length > 0 ? (
        <div className={styles.communityGrid}>
          {filteredBosses.map((boss) => (
            <CommunityBossCard key={boss._id} boss={boss} />
          ))}
        </div>
      ) : (
        <div className={styles.noBosses}>
          <p>
            {searchTerm || selectedChapter !== 'all' 
              ? 'No bosses match your search criteria' 
              : 'No community bosses available'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export { CommunityBosses };