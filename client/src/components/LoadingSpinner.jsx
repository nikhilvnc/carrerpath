import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Compass, Cpu, Database, CheckCircle } from 'lucide-react';

export const LoadingSpinner = ({ message = 'AI is analyzing your profile...' }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { icon: Compass, text: 'Scanning education, coursework, and technical skills...' },
    { icon: Brain, text: 'Querying Gemini LLM with structured competency prompt...' },
    { icon: Database, text: 'Mapping profile against 12 technology career trajectories...' },
    { icon: Cpu, text: 'Computing skill gap delta & prioritization matrix...' },
    { icon: Sparkles, text: 'Synthesizing adaptive 30/60/90-day learning roadmaps...' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
      
      {/* Outer Glowing Ring */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin flex items-center justify-center shadow-lg shadow-brand-500/10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 backdrop-blur-md flex items-center justify-center">
            <CurrentIcon className="w-7 h-7 text-brand-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {message}
      </h3>

      {/* Current Step Status */}
      <p className="text-sm font-mono text-brand-300 max-w-md h-6 animate-fade-in mb-6">
        {steps[stepIndex].text}
      </p>

      {/* Mini Step Trackers */}
      <div className="flex items-center gap-2 max-w-sm w-full">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx <= stepIndex ? 'bg-brand-500' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
