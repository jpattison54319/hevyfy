import React, { useState, useContext, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Button, Input } from '@headlessui/react';

const WeightAdjuster: React.FC<{ onWeightChange: (w: number) => void }> = ({ onWeightChange }) => {
  const { userData, setUserData } = useUser();

  // Get latest weight from weightLogs or fallback to bodyStats.weight or 150
  const getLatestWeight = () => {
    const logs = userData?.bodyStats?.weightLogs;
    if (Array.isArray(logs) && logs.length > 0) {
      // Assuming logs are sorted by date ascending; if not, sort first:
      const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return sortedLogs[sortedLogs.length - 1].weight;
    }
    return userData?.bodyStats?.weight ?? 150;
  };

  const [draftWeight, setDraftWeight] = useState(getLatestWeight());

  useEffect(() => {
    setDraftWeight(getLatestWeight());
  }, [userData?.bodyStats?.weightLogs, userData?.bodyStats?.weight]);

    const adjustWeight = (delta: number) => {
    const newWeight = parseFloat((draftWeight + delta).toFixed(1));
    if (newWeight >= 0) setDraftWeight(newWeight);
  };

    const handleSubmit = () => {
    onWeightChange(draftWeight);
  };

 return (
    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Arial, sans-serif' }}>
      <label htmlFor="current-weight" style={{ fontWeight: 'bold' }}>Current Weight:</label>
      <Input
        id="current-weight"
        type="number"
        step={0.1}
        value={draftWeight}
          onChange={(e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setDraftWeight(val); 
    } else if (e.target.value === '') {
      setDraftWeight(0); 
    }
  }}
        style={{ width: 80, fontSize: 16, padding: '4px 8px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Button
            onClick={() => adjustWeight(0.5)}
          style={{ padding: '2px 6px', cursor: 'pointer', userSelect: 'none' }}
          aria-label="Increase weight"
        >
          ▲
        </Button>
        <Button
            onClick={() => adjustWeight(-0.5)}
          style={{ padding: '2px 6px', cursor: 'pointer', userSelect: 'none' }}
          aria-label="Decrease weight"
        >
          ▼
        </Button>
      </div>

       <Button
        onClick={handleSubmit}
        style={{
          fontFamily: "'Press Start 2P', cursive",
          background: '#00ff00',
          color: '#000',
          border: '2px solid #00ff00',
          padding: '10px 20px',
          cursor: 'pointer',
          transition: '0.2s',
          borderRadius: '2px'
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default WeightAdjuster;
