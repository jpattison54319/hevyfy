import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import styles from './LogWeight.module.scss';
import WeightAdjuster from './WeightAdjustor';
import { useUser } from '../context/UserContext';
import api from '../api/api';
import { WeightLog } from '../types/user.types';
import { Button } from '@headlessui/react';

const ranges = {
  week: 7,
  month: 30,
  threeMonths: 90,
  all: Infinity,
};

const getInterval = (dataLength: number): number => {
  if (dataLength <= 7) return 0;       // show every tick
  if (dataLength <= 30) return 4;      // every 3rd tick
  if (dataLength <= 90) return 15;     // every 10th tick
  return 30;                           // for larger datasets
};

const LogWeight: React.FC = () => {
const [showCheck, setShowCheck] = useState(false);

  const {userData, setUserData} = useUser();
  const [range, setRange] = useState<'week' | 'month' | 'threeMonths' | 'all'>('week');
  const weightLogs: WeightLog[] = userData?.bodyStats?.weightLogs ?? [];
const sortedLogs = [...weightLogs].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
).map((log: { date: string | Date; weight: number }) => ({
  date: typeof log.date === 'string' ? log.date.slice(0, 10) : (log.date instanceof Date ? log.date.toISOString().slice(0, 10) : ''),
  weight: log.weight,
}));

const filteredData = range === 'all' ? sortedLogs : sortedLogs.slice(-ranges[range]);
  const interval = getInterval(filteredData.length);

    const handleWeightChange = async  (newWeight: number) => {
      if (!userData) return;

  const newLog = {
    date: new Date().toISOString(),
    weight: newWeight,
  };

  const updatedUser = {
    ...userData,
    bodyStats: {
      ...userData.bodyStats,
      weight: newWeight,
      weightLogs: [...(userData.bodyStats.weightLogs ?? []), newLog],
    },
  };

    try {
    const {data} = await api.post('users/update',updatedUser);
    setUserData(data);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 1500);
      } catch (err) {
    console.error(err);
    // Optional: revert changes or show error
  }
  };


  return (
    <div className={styles.container}>
        {showCheck && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999999999,
    }}
  >
    <svg
      viewBox="0 0 100 100"
      width="50%"
      height="50%"
      style={{ stroke: '#00ff00', strokeWidth: 8, fill: 'none' }}
    >
      <path
      className={styles.checkmarkPath}
        d="M20 55 L40 75 L80 30"
      />
    </svg>
  </div>
)}

      <h2 className={styles.heading}>Log Your Weight</h2>

      <div className={styles.rangeButtons}>
        {(['week', 'month', 'threeMonths', 'all'] as const).map((key) => (
          <Button
            key={key}
            className={range === key ? styles.activeButton : styles.button}
            onClick={() => setRange(key)}
          >
            {key === 'week' ? '1W' : key === 'month' ? '1M' : key === 'threeMonths' ? '3M' : 'ALL'}
          </Button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
>
          <CartesianGrid strokeDasharray="3 3" stroke="#ff9900" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => format(new Date(tick), 'MM/dd')}
            stroke="#ff9900"
            interval={interval}
            style={{ fontFamily: 'Arial, sans-serif', fontSize: 15 }}
          />
          <YAxis stroke="#ff9900" domain={['auto', 'auto']} style={{ fontFamily: 'Arial, sans-serif', fontSize: 15 }} />
          <Tooltip
            labelFormatter={(label: string) => format(new Date(label), 'PPP')}
            contentStyle={{ backgroundColor: '#000', borderColor: '#00FF00', color: '#00FF00' }}
            itemStyle={{ color: '#FF69B4' }}
          />
          <Line type="monotone" dataKey="weight" stroke="#00ff00" dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>

        <div style={{display: 'flex', justifyContent: 'center'}}>
      <WeightAdjuster onWeightChange={handleWeightChange} />
      </div>

    
    </div>
  );
};

export default LogWeight;