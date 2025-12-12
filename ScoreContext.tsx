import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScoreContextType {
  score: number;
  addScore: (points: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('pm_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('pm_score', score.toString());
  }, [score]);

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <ScoreContext.Provider value={{ score, addScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};