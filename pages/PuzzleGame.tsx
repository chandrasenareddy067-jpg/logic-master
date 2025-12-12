import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { generateRiddle } from '../services/geminiService';
import { Riddle } from '../types';
import { Lightbulb, RotateCcw, Flag, User, HelpCircle, Eye, EyeOff, Timer } from 'lucide-react';
import { useScore } from '../ScoreContext';

export const PuzzleGame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAZE' | 'RIDDLE'>('MAZE');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="bg-neutral-900 p-1 rounded-lg inline-flex border border-neutral-800">
          <button
            onClick={() => setActiveTab('MAZE')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'MAZE' ? 'bg-sky-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Algorithmic Maze
          </button>
          <button
            onClick={() => setActiveTab('RIDDLE')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'RIDDLE' ? 'bg-sky-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Logic Riddles
          </button>
        </div>
      </div>

      {activeTab === 'MAZE' ? <MazeComponent /> : <RiddleComponent />}
    </div>
  );
};

// --- Maze Logic ---

type Cell = {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
};

const MazeComponent: React.FC = () => {
  const { addScore } = useScore();
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(15);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const generateMaze = useCallback(() => {
    // Stop existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    setPlayerPos({ x: 0, y: 0 });
    setGameWon(false);
    setTimeElapsed(0);
    setIsRunning(true);

    const w = difficulty === 'EASY' ? 10 : 20;
    const h = difficulty === 'EASY' ? 10 : 20;
    setWidth(w);
    setHeight(h);
    setEndPos({ x: w - 1, y: h - 1 });

    // Initialize Grid
    const newGrid: Cell[][] = [];
    for (let y = 0; y < h; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < w; x++) {
        row.push({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false
        });
      }
      newGrid.push(row);
    }

    // DFS Recursive Backtracker
    const stack: Cell[] = [];
    const start = newGrid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors: { cell: Cell; dir: 'top' | 'right' | 'bottom' | 'left' }[] = [];

      const dirs = [
        { x: 0, y: -1, val: 'top', opp: 'bottom' },
        { x: 1, y: 0, val: 'right', opp: 'left' },
        { x: 0, y: 1, val: 'bottom', opp: 'top' },
        { x: -1, y: 0, val: 'left', opp: 'right' }
      ];

      for (const d of dirs) {
        const nx = current.x + d.x;
        const ny = current.y + d.y;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h && !newGrid[ny][nx].visited) {
          neighbors.push({ cell: newGrid[ny][nx], dir: d.val as any });
        }
      }

      if (neighbors.length > 0) {
        const nextInfo = neighbors[Math.floor(Math.random() * neighbors.length)];
        const next = nextInfo.cell;
        
        current.walls[nextInfo.dir] = false;
        
        let oppDir: 'top' | 'right' | 'bottom' | 'left' = 'top';
        if (nextInfo.dir === 'top') oppDir = 'bottom';
        if (nextInfo.dir === 'right') oppDir = 'left';
        if (nextInfo.dir === 'bottom') oppDir = 'top';
        if (nextInfo.dir === 'left') oppDir = 'right';
        
        next.walls[oppDir] = false;
        next.visited = true;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    setGrid(newGrid);

    // Start Timer
    timerRef.current = window.setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

  }, [difficulty]);

  useEffect(() => {
    generateMaze();
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [generateMaze]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameWon) return;
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    const { x, y } = playerPos;
    const currentCell = grid[y]?.[x];
    if (!currentCell) return;

    if (e.key === 'ArrowUp' && !currentCell.walls.top) setPlayerPos({ x, y: y - 1 });
    if (e.key === 'ArrowRight' && !currentCell.walls.right) setPlayerPos({ x: x + 1, y });
    if (e.key === 'ArrowDown' && !currentCell.walls.bottom) setPlayerPos({ x, y: y + 1 });
    if (e.key === 'ArrowLeft' && !currentCell.walls.left) setPlayerPos({ x: x - 1, y });
  }, [playerPos, grid, gameWon]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (playerPos.x === endPos.x && playerPos.y === endPos.y && isRunning) {
      setGameWon(true);
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Award points
      const points = difficulty === 'EASY' ? 2 : 5;
      addScore(points);
    }
  }, [playerPos, endPos, isRunning, difficulty, addScore]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-2xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Algorithmic Maze</h2>
                <p className="text-neutral-400 text-sm">Navigate to the green flag.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <div className="flex gap-2">
                    <button 
                    onClick={() => setDifficulty('EASY')}
                    className={`px-3 py-1 text-sm rounded ${difficulty === 'EASY' ? 'bg-sky-900 text-sky-300 border border-sky-700' : 'bg-neutral-800 text-neutral-400'}`}
                    >
                        Easy (2pts)
                    </button>
                    <button 
                    onClick={() => setDifficulty('HARD')}
                    className={`px-3 py-1 text-sm rounded ${difficulty === 'HARD' ? 'bg-sky-900 text-sky-300 border border-sky-700' : 'bg-neutral-800 text-neutral-400'}`}
                    >
                        Hard (5pts)
                    </button>
                    <Button onClick={generateMaze} variant="secondary" className="!py-1 !px-3 !text-sm ml-2">
                        <RotateCcw className="h-4 w-4" /> Reset
                    </Button>
                 </div>
                 <div className="flex items-center gap-2 text-white font-mono text-lg bg-black px-3 py-1 rounded border border-neutral-800">
                    <Timer className="h-4 w-4 text-sky-500" />
                    {formatTime(timeElapsed)}
                 </div>
            </div>
        </div>
      </Card>

      <div 
        className="bg-neutral-800 p-4 rounded-xl shadow-2xl relative select-none"
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, 1fr)`,
            gap: '0px',
            width: 'min(90vw, 500px)',
            aspectRatio: '1/1'
        }}
      >
         {gameWon && (
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl animate-in fade-in">
                 <h3 className="text-3xl font-bold text-sky-400 mb-2">Solved!</h3>
                 <p className="text-white mb-4">Time: {formatTime(timeElapsed)}</p>
                 <div className="text-green-400 font-bold mb-4">+{difficulty === 'EASY' ? 2 : 5} Points</div>
                 <Button onClick={generateMaze}>Play Again</Button>
             </div>
         )}

         {grid.map((row, y) => (
             row.map((cell, x) => (
                 <div 
                    key={`${x}-${y}`}
                    className="relative border-neutral-600/30"
                    style={{
                        borderTopWidth: cell.walls.top ? '2px' : '0',
                        borderRightWidth: cell.walls.right ? '2px' : '0',
                        borderBottomWidth: cell.walls.bottom ? '2px' : '0',
                        borderLeftWidth: cell.walls.left ? '2px' : '0',
                        backgroundColor: (x === endPos.x && y === endPos.y) ? 'rgba(14, 165, 233, 0.1)' : 'transparent'
                    }}
                 >
                    {x === playerPos.x && y === playerPos.y && (
                        <div className="absolute inset-1 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                    )}
                    {x === endPos.x && y === endPos.y && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Flag className="h-5 w-5 text-sky-500" />
                        </div>
                    )}
                 </div>
             ))
         ))}
      </div>
      
      {/* Mobile Controls */}
      <div className="md:hidden mt-8 grid grid-cols-3 gap-2 w-48">
         <div />
         <Button onClick={() => handleKeyDown({ key: 'ArrowUp', preventDefault: ()=>{} } as any)} variant="secondary"><div className="rotate-0">▲</div></Button>
         <div />
         <Button onClick={() => handleKeyDown({ key: 'ArrowLeft', preventDefault: ()=>{} } as any)} variant="secondary"><div className="-rotate-90">▲</div></Button>
         <Button onClick={() => handleKeyDown({ key: 'ArrowDown', preventDefault: ()=>{} } as any)} variant="secondary"><div className="rotate-180">▲</div></Button>
         <Button onClick={() => handleKeyDown({ key: 'ArrowRight', preventDefault: ()=>{} } as any)} variant="secondary"><div className="rotate-90">▲</div></Button>
      </div>
    </div>
  );
};

// --- Riddle Logic ---

const RiddleComponent: React.FC = () => {
    const { addScore } = useScore();
    const [riddle, setRiddle] = useState<Riddle | null>(null);
    const [loading, setLoading] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [solved, setSolved] = useState(false);

    const fetchRiddle = async () => {
        setLoading(true);
        setShowHint(false);
        setShowAnswer(false);
        setSolved(false);
        const data = await generateRiddle();
        setRiddle(data);
        setLoading(false);
    }

    const handleReveal = () => {
        if (!showAnswer && !solved) {
            setShowAnswer(true);
            setSolved(true);
            // Self-reported solve? For now, we assume reveal means they gave up or are checking. 
            // The prompt implies points for challenges. 
            // For Riddles, since we can't verify the answer easily without input, 
            // I'll just skip points here or maybe give 2 points if they claim they solved it.
            // Simplification: No points for reveal, just learning.
        } else {
             setShowAnswer(!showAnswer);
        }
    }

    useEffect(() => {
        if (!riddle) fetchRiddle();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
             <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-sky-500/20 p-2 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Logic Riddle</h2>
                        <p className="text-neutral-400 text-sm">Lateral thinking puzzles.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : riddle ? (
                    <div className="space-y-6">
                        <div className="bg-black p-6 rounded-xl border border-neutral-800">
                            <p className="text-lg text-white leading-relaxed font-medium">
                                {riddle.question}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowHint(!showHint)}
                                className="text-sm"
                            >
                                <HelpCircle className="h-4 w-4 mr-2" />
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </Button>
                            
                            <Button 
                                variant={showAnswer ? 'secondary' : 'primary'}
                                onClick={handleReveal}
                                className="text-sm"
                            >
                                {showAnswer ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                            </Button>

                            <div className="flex-grow"></div>
                            <Button variant="outline" onClick={fetchRiddle} className="text-sm">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                New Riddle
                            </Button>
                        </div>

                        {showHint && (
                            <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <span className="font-bold text-sky-400 text-sm uppercase tracking-wide">Hint:</span>
                                <p className="text-neutral-300 mt-1">{riddle.hint}</p>
                            </div>
                        )}

                        {showAnswer && (
                            <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <span className="font-bold text-green-400 text-sm uppercase tracking-wide">Answer:</span>
                                <p className="text-green-200 mt-1">{riddle.answer}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-red-400">
                        Failed to load riddle.
                        <div className="mt-4">
                            <Button onClick={fetchRiddle}>Retry</Button>
                        </div>
                    </div>
                )}
             </Card>
        </div>
    );
};