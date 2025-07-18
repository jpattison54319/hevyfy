import React, { useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import styles from './BossArena.module.scss';
import { CampaignBosses } from './CampaignBosses/CampaignBosses';
import { CommunityBosses } from './communityboss/CommunityBosses';
import { useUser } from '../context/UserContext';
import api from '../api/api';

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

const BossArena: React.FC = ({
}) => {
    const{userData, setUserData} = useUser();
    const [campaignBosses, setCampaignBosses] = useState<MiniBoss[]>();

    useEffect(() => {
      api.get(`/miniboss/${userData?.uid}`).then((res) => {
        setCampaignBosses(res.data.bosses);
      }).catch((err) => {
        console.log(err);
      })

    },[userData])



  return (
    <div className={styles.bossArena}>
      <div className={styles.header}>
        <h1 className={styles.title}>Boss Arena</h1>
      </div>

      <TabGroup>
        <TabList className={styles.tabList}>
          <Tab className={({ selected }) => 
            `${styles.tab} ${selected ? styles.tabSelected : styles.tabUnselected}`
          }>
            Campaign
          </Tab>
          <Tab className={({ selected }) => 
            `${styles.tab} ${selected ? styles.tabSelected : styles.tabUnselected}`
          }>
            Community
          </Tab>
        </TabList>

        <TabPanels className={styles.tabPanels}>
          <TabPanel className={styles.tabPanel}>
            <CampaignBosses 
              bosses={campaignBosses ?? []}
            />
          </TabPanel>

          <Tab.Panel className={styles.tabPanel}>
            {/* <CommunityBosses 
              bosses={communityBosses}
              onFightBoss={onFightBoss}
            /> */}
          </Tab.Panel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default BossArena;