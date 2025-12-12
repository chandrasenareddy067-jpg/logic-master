import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { Games } from './pages/Games';
import { AptitudeGame } from './pages/AptitudeGame';
import { CognitiveGame } from './pages/CognitiveGame';
import { PuzzleGame } from './pages/PuzzleGame';
import { IQTest } from './pages/IQTest';
import { ScoreProvider } from './ScoreContext';

const App: React.FC = () => {
  return (
    <ScoreProvider>
      <HashRouter>
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/iq-test" element={<IQTest />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/aptitude" element={<AptitudeGame />} />
              <Route path="/games/cognitive" element={<CognitiveGame />} />
              <Route path="/games/puzzles" element={<PuzzleGame />} />
            </Routes>
          </main>
          <footer className="bg-black py-6 border-t border-neutral-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-neutral-500 text-sm">
              &copy; {new Date().getFullYear()} Logic Master Academy. Powered by Google Gemini.
            </div>
          </footer>
        </div>
      </HashRouter>
    </ScoreProvider>
  );
};

export default App;