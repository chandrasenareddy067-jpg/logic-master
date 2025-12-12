import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AI_COURSE_MODULES } from '../constants';
import { analyzePrompt, runPromptSimulation } from '../services/geminiService';
import { Play, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { CourseModule } from '../types';

export const Courses: React.FC = () => {
  const [activeModule, setActiveModule] = useState<CourseModule>(AI_COURSE_MODULES[0]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Course List */}
      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Curriculum</h2>
        {AI_COURSE_MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              activeModule.id === module.id
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            <div className="font-semibold">{module.title}</div>
            <div className="text-xs opacity-75 mt-1 truncate">{module.description}</div>
          </button>
        ))}
        
        <div className="mt-8 bg-neutral-900 p-4 rounded-xl border border-sky-500/20">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Play className="h-4 w-4 text-sky-400" />
            Interactive Lab
          </h3>
          <p className="text-sm text-neutral-300">
            Test your knowledge in the playground at the bottom of the module!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-9 space-y-8">
        <Card className="min-h-[500px]">
          <h1 className="text-3xl font-bold text-white mb-2">{activeModule.title}</h1>
          <p className="text-neutral-400 text-lg mb-8">{activeModule.description}</p>
          
          <div className="prose prose-invert max-w-none prose-headings:text-sky-300 prose-strong:text-white prose-code:text-sky-200 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded">
             {activeModule.content.split('\n').map((line, idx) => {
               if (line.startsWith('###')) return <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-sky-200">{line.replace('###', '')}</h3>;
               if (line.startsWith('1.')) return <li key={idx} className="ml-4 text-neutral-300 mb-2 list-decimal">{line.replace(/^\d+\./, '')}</li>;
               if (line.startsWith('*')) return <li key={idx} className="ml-4 text-neutral-300 mb-2 list-disc">{line.replace('*', '')}</li>;
               return <p key={idx} className="mb-4 text-neutral-300 leading-relaxed">{line}</p>;
             })}
          </div>

          <div className="mt-10 space-y-6">
             <h3 className="text-xl font-bold text-white border-b border-neutral-700 pb-2">Examples</h3>
             {activeModule.examples.map((ex, idx) => (
               <div key={idx} className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                      <XCircle className="h-5 w-5" /> Bad Prompt
                    </div>
                    <p className="text-neutral-300 font-mono text-sm">{ex.bad}</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                      <CheckCircle className="h-5 w-5" /> Good Prompt
                    </div>
                    <p className="text-neutral-300 font-mono text-sm">{ex.good}</p>
                  </div>
                  <div className="md:col-span-2 text-sm text-neutral-400 italic bg-black p-3 rounded">
                    💡 Analysis: {ex.explanation}
                  </div>
               </div>
             ))}
          </div>
        </Card>

        {/* Interactive Playground */}
        <PromptPlayground />
      </div>
    </div>
  );
};

const PromptPlayground: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulate' | 'analyze'>('simulate');

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setAnalysis('');
    setOutput('');

    if (activeTab === 'simulate') {
        const res = await runPromptSimulation(input);
        setOutput(res);
    } else {
        const res = await analyzePrompt(input);
        setAnalysis(res);
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-sky-500/30">
      <div className="flex items-center gap-3 mb-6">
         <div className="bg-sky-600 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
         </div>
         <div>
            <h3 className="text-xl font-bold text-white">Prompt Playground</h3>
            <p className="text-sm text-neutral-400">Practice what you've learned. Test prompts or get feedback.</p>
         </div>
      </div>

      <div className="flex gap-2 mb-4 bg-neutral-900 p-1 rounded-lg w-fit">
        <button 
          onClick={() => setActiveTab('simulate')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'simulate' ? 'bg-sky-600 text-white' : 'text-neutral-400 hover:text-white'}`}
        >
          Simulate Response
        </button>
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'analyze' ? 'bg-sky-600 text-white' : 'text-neutral-400 hover:text-white'}`}
        >
          Analyze Quality
        </button>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activeTab === 'simulate' ? "Enter a prompt to see how AI responds..." : "Enter a prompt to get a critique on its quality..."}
          className="w-full h-32 bg-black border border-neutral-700 rounded-lg p-4 text-white placeholder-neutral-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none font-mono text-sm"
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            {activeTab === 'simulate' ? 'Run Prompt' : 'Analyze Prompt'}
          </Button>
        </div>

        {(output || analysis) && (
          <div className="mt-6 bg-neutral-900/80 rounded-lg border border-neutral-700 overflow-hidden">
            <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700 text-xs font-bold text-neutral-400 uppercase tracking-wider">
               {activeTab === 'simulate' ? 'AI Output' : 'Quality Analysis'}
            </div>
            <div className="p-4 text-neutral-300 text-sm whitespace-pre-wrap leading-relaxed font-mono">
              {output || analysis}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};