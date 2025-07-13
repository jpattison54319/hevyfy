import { useEffect, useState } from 'react';

interface WorkoutTimerProps {
  startTime: number;
}

const WorkoutTimer = ({ startTime }: WorkoutTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return <div style={{ fontSize: '1.5rem' }}>{formatTime(elapsedTime)}</div>;
};

export default WorkoutTimer;
