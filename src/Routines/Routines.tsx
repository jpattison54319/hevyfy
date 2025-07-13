import {
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  Tab
} from '@headlessui/react';
import styles from './Routines.module.scss';

import CreateRoutine from './CreateRoutine';
import MyRoutines from './MyRoutines';
import UpdateRoutine from './UpdateRoutine';
import CommunityRoutines from './CommunityRoutines/CommunityRoutines';

export default function Routines() {
  return (
    <div className={styles.container}>
      <TabGroup>
        <TabList className={styles.tabList}>
          {['My Routines', 'Create', 'Update', 'Community Routines'].map((tab) => (
            <Tab key={tab} className={({ selected }) =>
              `${styles.tabButton} ${selected ? styles.active : ''}`
            }>
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <MyRoutines />
          </TabPanel>
          <TabPanel>
            <CreateRoutine />
          </TabPanel>
          <TabPanel>
            <UpdateRoutine />
          </TabPanel>
          <TabPanel>
            <CommunityRoutines />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}