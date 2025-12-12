import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, Calculator, Puzzle, Trophy, BookOpen, Activity } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useScore } from '../ScoreContext';

export const Home: React.FC = () => {
  const { score } = useScore();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-black">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="text-center max-w-4xl relative z-10 space-y-8 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-sky-900 text-sky-300 text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Master the Future of Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
          Logic <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">Master</span>
        </h1>
        
        {/* Total Score Display */}
        <div className="inline-flex items-center gap-3 bg-neutral-900 border border-neutral-700 px-6 py-3 rounded-2xl shadow-xl">
             <Trophy className="h-8 w-8 text-sky-400" />
             <div className="text-left">
                <div className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Total Score</div>
                <div className="text-2xl font-bold text-white leading-none">{score} PTS</div>
             </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Link to="/courses">
            <Button className="w-full sm:w-auto h-14 text-lg">
              Start Learning
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-sky-500">All Challenges & Courses</h2>
        <div className="grid md:grid-cols-3 gap-6">
            
            {/* Logic Riddles Course */}
            <Link to="/courses" className="group">
              <Card className="h-full hover:bg-neutral-800 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-sky-500/30">
                <div className="flex flex-col h-full">
                  <div className="bg-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white group-hover:text-sky-300 transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Logic Riddles Course</h3>
                  <p className="text-neutral-400 text-sm mb-4 flex-grow">
                    Learn the secrets of lateral thinking and paradox solving.
                    <br/><span className="text-sky-500 text-xs font-bold">New Module</span>
                  </p>
                  <div className="text-sky-400 text-sm font-medium flex items-center">Start Course <ArrowRight className="h-4 w-4 ml-1" /></div>
                </div>
              </Card>
            </Link>

            {/* IQ Tester */}
            <Link to="/iq-test" className="group">
              <Card className="h-full hover:bg-neutral-800 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-red-500/30">
                <div className="flex flex-col h-full">
                  <div className="bg-red-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-red-400 group-hover:text-red-300 transition-colors">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">IQ Tester</h3>
                  <p className="text-neutral-400 text-sm mb-4 flex-grow">
                    Official-style assessment of your pattern recognition and logic.
                    <br/><span className="text-red-500 text-xs font-bold">+10 PTS / Answer</span>
                  </p>
                  <div className="text-red-400 text-sm font-medium flex items-center">Start Test <ArrowRight className="h-4 w-4 ml-1" /></div>
                </div>
              </Card>
            </Link>

            {/* Aptitude Game */}
            <Link to="/games/aptitude" className="group">
              <Card className="h-full hover:bg-neutral-800 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-sky-500/30">
                <div className="flex flex-col h-full">
                  <div className="bg-sky-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-sky-400 group-hover:text-sky-300 transition-colors">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Aptitude & Logic</h3>
                  <p className="text-neutral-400 text-sm mb-4 flex-grow">
                    Logic reasoning and math questions.
                    <br/><span className="text-sky-500 text-xs font-bold">+5 PTS / Question</span>
                  </p>
                  <div className="text-sky-400 text-sm font-medium flex items-center">Play Now <ArrowRight className="h-4 w-4 ml-1" /></div>
                </div>
              </Card>
            </Link>

            {/* Cognitive Memory */}
            <Link to="/games/cognitive" className="group">
              <Card className="h-full hover:bg-neutral-800 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-white/30">
                <div className="flex flex-col h-full">
                  <div className="bg-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white group-hover:text-gray-300 transition-colors">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Cognitive Memory</h3>
                  <p className="text-neutral-400 text-sm mb-4 flex-grow">
                    Memory Matrix patterns.
                    <br/><span className="text-sky-500 text-xs font-bold">+5 PTS / Level</span>
                  </p>
                   <div className="text-white text-sm font-medium flex items-center">Play Now <ArrowRight className="h-4 w-4 ml-1" /></div>
                </div>
              </Card>
            </Link>

            {/* Analytical Puzzles */}
            <Link to="/games/puzzles" className="group">
              <Card className="h-full hover:bg-neutral-800 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-green-500/30">
                <div className="flex flex-col h-full">
                  <div className="bg-green-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-green-400 group-hover:text-green-300 transition-colors">
                    <Puzzle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Analytical Puzzles</h3>
                  <p className="text-neutral-400 text-sm mb-4 flex-grow">
                    Algorithmic mazes & riddles.
                    <br/><span className="text-sky-500 text-xs font-bold">Easy +2 / Hard +5 PTS</span>
                  </p>
                  <div className="text-green-400 text-sm font-medium flex items-center">Play Now <ArrowRight className="h-4 w-4 ml-1" /></div>
                </div>
              </Card>
            </Link>

        </div>
      </div>
    </div>
  );
};