import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Trophy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useScore } from '../ScoreContext';

export const CognitiveGame: React.FC = () => {
  const { addScore } = useScore();
  const [gridSize, setGridSize] = useState(3);
  const [activeCells, setActiveCells] = useState<number[]>([]);
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'IDLE' | 'SHOWING' | 'PLAYING' | 'RESULT'>('IDLE');
  const [level, setLevel] = useState(1);
  const [sessionScore, setSessionScore] = useState(0);

  const generatePattern = useCallback(() => {
    // Increase grid size every 3 levels
    const newSize = 3 + Math.floor((level - 1) / 3);
    setGridSize(newSize);

    // Number of tiles to remember increases with level
    const tilesCount = 3 + Math.floor(level / 2);
    const totalCells = newSize * newSize;
    
    const newPattern = new Set<number>();
    while(newPattern.size < tilesCount) {
      newPattern.add(Math.floor(Math.random() * totalCells));
    }
    
    setActiveCells(Array.from(newPattern));
    setGameState('SHOWING');
    setUserSelection([]);
    
    // Show pattern for limited time
    setTimeout(() => {
      setGameState('PLAYING');
    }, 1500 + (level * 100)); // Time increases slightly as difficulty goes up to be fair
  }, [level]);

  useEffect(() => {
    if (gameState === 'IDLE' && level > 1) {
        generatePattern();
    }
  }, [gameState, level, generatePattern]);

  const startGame = () => {
    setLevel(1);
    setSessionScore(0);
    setGameState('IDLE');
    // small delay to reset state properly then start
    setTimeout(() => generatePattern(), 100);
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'PLAYING') return;
    if (userSelection.includes(index)) return;

    const newSelection = [...userSelection, index];
    setUserSelection(newSelection);

    // Check if correct
    if (!activeCells.includes(index)) {
      // Wrong selection - Game Over
      setGameState('RESULT');
    } else {
      // Check if level complete
      if (newSelection.length === activeCells.length) {
        setSessionScore(s => s + (activeCells.length * 10));
        addScore(5); // 5 points per level cleared
        setLevel(l => l + 1);
        setGameState('IDLE'); // This triggers next level via useEffect
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Memory Matrix</h1>
        <p className="text-neutral-400">Memorize the pattern of blue tiles.</p>
      </div>

      <div className="flex justify-between w-full max-w-md mb-6 px-4">
        <div className="text-neutral-300">Level: <span className="text-white font-bold">{level}</span></div>
        <div className="text-neutral-300">Score: <span className="text-sky-400 font-bold">{sessionScore}</span></div>
      </div>

      {gameState === 'RESULT' ? (
        <Card className="w-full max-w-md text-center py-10">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-neutral-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Game Over</h2>
          <p className="text-neutral-400 mb-8">You reached Level {level}</p>
          <div className="text-5xl font-bold text-sky-400 mb-8">{sessionScore}</div>
          <Button onClick={startGame} className="w-full">
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
        </Card>
      ) : gameState === 'IDLE' && level === 1 ? (
        <Card className="w-full max-w-md text-center py-10">
             <div className="h-20 w-20 bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-10 w-10 text-sky-400" />
             </div>
             <h3 className="text-xl font-bold text-white mb-4">Ready to Focus?</h3>
             <p className="text-neutral-400 mb-8 px-4">Tiles will flash briefly. Recreate the pattern by clicking the correct grid cells.</p>
             <Button onClick={startGame} className="w-full">Start Game</Button>
        </Card>
      ) : (
        <div 
            className="grid gap-2 bg-neutral-800 p-4 rounded-xl shadow-2xl shadow-black/50 transition-all duration-300"
            style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: 'min(90vw, 400px)',
                height: 'min(90vw, 400px)'
            }}
        >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const isActive = activeCells.includes(i);
                const isSelected = userSelection.includes(i);
                
                let cellClass = "rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95";
                
                if (gameState === 'SHOWING') {
                    cellClass += isActive ? " bg-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.5)]" : " bg-neutral-700";
                } else if (gameState === 'PLAYING') {
                     if (isSelected) {
                        cellClass += isActive ? " bg-sky-600" : " bg-red-600 animate-shake"; 
                     } else {
                        cellClass += " bg-neutral-700 hover:bg-neutral-600";
                     }
                }
                
                return (
                    <div 
                        key={i} 
                        onClick={() => handleCellClick(i)}
                        className={cellClass}
                    />
                );
            })}
        </div>
      )}
      
      {gameState === 'SHOWING' && (
         <div className="mt-8 flex items-center gap-2 text-sky-300 animate-pulse">
            <Eye className="h-5 w-5" /> Memorize...
         </div>
      )}
      
      {gameState === 'PLAYING' && (
         <div className="mt-8 flex items-center gap-2 text-neutral-400">
            <EyeOff className="h-5 w-5" /> Recall!
         </div>
      )}
    </div>
  );
};