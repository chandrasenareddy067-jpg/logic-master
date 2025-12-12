export enum GameType {
  APTITUDE = 'APTITUDE',
  COGNITIVE = 'COGNITIVE',
  PUZZLE = 'PUZZLE'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Riddle {
  question: string;
  answer: string;
  hint: string;
}

export interface GameState {
  score: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
  isPlaying: boolean;
  loading: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown-like content
  examples: {
    bad: string;
    good: string;
    explanation: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isAnalysis?: boolean;
}