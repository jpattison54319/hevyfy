import { Button } from '@salt-ds/core';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SplashScreenConfig = {
  content: ReactNode;
  style?: React.CSSProperties;
};

interface SplashScreenContextProps {
  showSplash: (config: SplashScreenConfig) => void;
  hideSplash: () => void;
}

const SplashScreenContext = createContext<SplashScreenContextProps | undefined>(undefined);


export const SplashScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [style, setStyle] = useState<React.CSSProperties | undefined>(undefined);

  const showSplash = ({ content, style }: SplashScreenConfig) => {
    setContent(content);
    setStyle(style);
  };

  const hideSplash = () => {
    setContent(null);
    setStyle(undefined);
  };

  return (
    <SplashScreenContext.Provider value={{ showSplash, hideSplash }}>
      {children}
      {content && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            ...style, // <-- override default styles
          }}
          onClick={hideSplash}
        >
          {content}
          <div style={{padding: '17px 0px'}}>
          <Button
            onClick={hideSplash}
            style={{
    marginTop: 24,
    padding: '17px 24px',
    lineHeight: '20px',
    fontFamily: "'Press Start 2P', Pixelify Sans",
    fontSize: '17px',
    color: '#fff',
    backgroundColor: '#ff9900', // ✅ bright orange
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
  }}
          >
            Dismiss
          </Button>
          </div>
        </div>
      )}
    </SplashScreenContext.Provider>
  );
};

export const useSplashScreen = (): SplashScreenContextProps => {
  const context = useContext(SplashScreenContext);
  if (!context) {
    throw new Error('useSplashScreen must be used within a SplashScreenProvider');
  }
  return context;
};