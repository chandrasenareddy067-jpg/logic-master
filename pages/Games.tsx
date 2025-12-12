import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Brain, Calculator, ChevronRight, Puzzle } from 'lucide-react';

export const Games: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Game Arena</h1>
        <p className="text-neutral-400">Sharpen your cognitive abilities and aptitude.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Link to="/games/aptitude" className="group">
          <Card className="h-full hover:bg-neutral-800/80 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-sky-500/30">
            <div className="flex flex-col h-full">
              <div className="bg-sky-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-sky-400 group-hover:text-sky-300 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Aptitude & Logic</h2>
              <p className="text-neutral-400 mb-6 flex-grow">
                Test your logical reasoning and mathematical skills with AI-generated questions.
              </p>
              <div className="flex items-center text-sky-400 font-medium group-hover:translate-x-2 transition-transform">
                Start Challenge <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/games/cognitive" className="group">
          <Card className="h-full hover:bg-neutral-800/80 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-white/30">
            <div className="flex flex-col h-full">
              <div className="bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:text-gray-300 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Cognitive Memory</h2>
              <p className="text-neutral-400 mb-6 flex-grow">
                Push your working memory to the limit with the "Memory Matrix" pattern recall challenge.
              </p>
              <div className="flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                Start Challenge <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/games/puzzles" className="group">
          <Card className="h-full hover:bg-neutral-800/80 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-green-500/30">
            <div className="flex flex-col h-full">
              <div className="bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-transform duration-300">
                <Puzzle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Analytical Puzzles</h2>
              <p className="text-neutral-400 mb-6 flex-grow">
                Solve algorithmic mazes and lateral thinking riddles used in technical interviews.
              </p>
              <div className="flex items-center text-green-400 font-medium group-hover:translate-x-2 transition-transform">
                Start Challenge <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};