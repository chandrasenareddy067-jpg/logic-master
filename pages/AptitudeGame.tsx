import React, { useState, useEffect } from 'react';
import { generateAptitudeQuestions } from '../services/geminiService';
import { Question } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Check, X, RefreshCw, Trophy, Brain } from 'lucide-react';
import { useScore } from '../ScoreContext';

export const AptitudeGame: React.FC = () => {
  const { addScore } = useScore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0); // Session score
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setGameEnded(false);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);

    // Fetch 5 questions for a session
    const fetched = await generateAptitudeQuestions('Logical Reasoning and Pattern Recognition', 5);
    setQuestions(fetched);
    setLoading(false);
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(idx);
    setShowExplanation(true);
    
    if (idx === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
      addScore(5); // Add global points for hard/aptitude question
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameEnded(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-400 animate-pulse">Gemini is crafting unique questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-red-400 mb-4">Failed to load questions. Please check API key.</p>
            <Button onClick={loadQuestions}>Retry</Button>
        </div>
     )
  }

  if (gameEnded) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <Card>
          <div className="flex justify-center mb-6">
            <Trophy className="h-20 w-20 text-sky-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
          <p className="text-neutral-400 mb-6">Your logical prowess:</p>
          <div className="text-6xl font-bold text-sky-400 mb-8">
            {score} / {questions.length}
          </div>
          <div className="text-green-400 font-bold mb-6">Total Points Earned: {score * 5}</div>
          <Button onClick={loadQuestions} className="w-full">
            <RefreshCw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <span className="text-neutral-400 text-sm">Question {currentQIndex + 1} of {questions.length}</span>
        <span className="bg-neutral-800 text-sky-300 px-3 py-1 rounded-full text-sm font-medium border border-neutral-700">
            Session Score: {score}
        </span>
      </div>

      <Card className="mb-8">
        <h2 className="text-xl font-medium text-white leading-relaxed mb-6">
          {currentQ.text}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all relative ";
            if (selectedOption === null) {
              btnClass += "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-sky-500 text-white";
            } else {
              if (idx === currentQ.correctAnswerIndex) {
                btnClass += "bg-green-900/30 border-green-500 text-green-200";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-900/30 border-red-500 text-red-200";
              } else {
                btnClass += "bg-neutral-900 border-neutral-800 text-neutral-500 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(idx)}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedOption !== null && idx === currentQ.correctAnswerIndex && (
                        <Check className="h-5 w-5 text-green-400" />
                    )}
                    {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctAnswerIndex && (
                        <X className="h-5 w-5 text-red-400" />
                    )}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 p-4 bg-sky-900/10 border border-sky-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-sky-300 mb-1 flex items-center gap-2">
                <Brain className="h-4 w-4" /> Logic Explanation
            </h4>
            <p className="text-sm text-neutral-300">{currentQ.explanation}</p>
          </div>
        )}
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={nextQuestion} 
          disabled={selectedOption === null}
          variant={selectedOption === null ? 'secondary' : 'primary'}
        >
          {currentQIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};