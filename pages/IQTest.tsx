import React, { useState, useEffect } from 'react';
import { generateIQQuestions } from '../services/geminiService';
import { Question } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Check, X, RefreshCw, Trophy, BrainCircuit, Activity } from 'lucide-react';
import { useScore } from '../ScoreContext';

export const IQTest: React.FC = () => {
  const { addScore } = useScore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [iqEstimate, setIqEstimate] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setGameEnded(false);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIqEstimate(0);

    // Fetch 10 IQ questions
    const fetched = await generateIQQuestions(10);
    setQuestions(fetched);
    setLoading(false);
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    if (idx === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
      // No instant feedback explanation for IQ test to keep it serious, but we show right/wrong visual
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    // Simple mock calculation: Base 80 + (Score/Total * 60) + Random variance
    // Correct answers in IQ tests are weighted, but here we just estimate.
    const calculatedIQ = Math.round(80 + ((score / questions.length) * 60) + (Math.random() * 5));
    setIqEstimate(calculatedIQ);
    setGameEnded(true);
    addScore(score * 10); // 10 points per correct IQ answer
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-400 animate-pulse">Calibrating Test Parameters...</p>
      </div>
    );
  }

  if (questions.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-red-400 mb-4">Failed to initialize test. Connection error.</p>
            <Button onClick={loadQuestions}>Retry Initialization</Button>
        </div>
     )
  }

  if (gameEnded) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center px-4">
        <Card>
          <div className="flex justify-center mb-6">
            <BrainCircuit className="h-20 w-20 text-sky-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
          <div className="py-8">
            <p className="text-neutral-400 text-sm uppercase tracking-widest mb-2">Estimated IQ Score</p>
            <div className="text-7xl font-bold text-sky-400 mb-2">
                {iqEstimate}
            </div>
            <p className="text-sm text-neutral-500 italic">*This is a simulation powered by AI.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8 bg-neutral-900/50 p-4 rounded-lg">
             <div className="text-center">
                <div className="text-2xl font-bold text-white">{score}/{questions.length}</div>
                <div className="text-xs text-neutral-400">Correct Answers</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-bold text-green-400">+{score * 10}</div>
                <div className="text-xs text-neutral-400">Total Points</div>
             </div>
          </div>

          <Button onClick={loadQuestions} className="w-full">
            <RefreshCw className="h-5 w-5 mr-2" />
            Retake Test
          </Button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-sky-500" />
            <span className="text-neutral-300 font-medium">IQ Assessment</span>
        </div>
        <div className="text-neutral-500 font-mono">
            {currentQIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full bg-neutral-900 h-2 rounded-full mb-8 overflow-hidden">
        <div 
            className="bg-sky-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <Card className="mb-8 border-t-4 border-t-sky-600">
        <h2 className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8">
          {currentQ.text}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all relative flex items-center justify-between group ";
            if (selectedOption === null) {
              btnClass += "bg-neutral-800 border-neutral-700 hover:bg-neutral-750 hover:border-sky-500 text-white";
            } else {
               // Show Correct/Incorrect visually
              if (idx === currentQ.correctAnswerIndex) {
                btnClass += "bg-green-900/20 border-green-500 text-green-200";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-900/20 border-red-500 text-red-200";
              } else {
                btnClass += "bg-neutral-900 border-neutral-800 text-neutral-500 opacity-40";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(idx)}
                className={btnClass}
              >
                <span className="font-medium">{option}</span>
                {selectedOption !== null && idx === currentQ.correctAnswerIndex && (
                    <Check className="h-5 w-5 text-green-400" />
                )}
                {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctAnswerIndex && (
                    <X className="h-5 w-5 text-red-400" />
                )}
                {selectedOption === null && (
                    <div className="h-3 w-3 rounded-full border border-neutral-500 group-hover:border-sky-400"></div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={nextQuestion} 
          disabled={selectedOption === null}
          variant={selectedOption === null ? 'secondary' : 'primary'}
          className="w-full md:w-auto"
        >
          {currentQIndex === questions.length - 1 ? 'Analyze Results' : 'Next Problem'}
        </Button>
      </div>
    </div>
  );
};