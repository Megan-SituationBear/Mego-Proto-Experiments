/**
 * ThinkingModal - Shows AI processing/thinking animation
 * 
 * Displays when AI is doing complex processing like:
 * - Analyzing requirements
 * - Creating workspace structure
 * - Planning project architecture
 * - Generating recommendations
 */

import React, { useEffect, useState } from 'react';

interface ThinkingModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds (default: 3500)
  title?: string;
  steps?: string[];
}

const ThinkingModal: React.FC<ThinkingModalProps> = ({
  isOpen,
  onComplete,
  duration = 3500,
  title = "Analyzing your project...",
  steps = [
    "Understanding your requirements",
    "Analyzing optimal workspace structure",
    "Configuring project settings",
    "Setting up collaboration tools",
    "Preparing development environment"
  ]
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    const stepDuration = duration / steps.length;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return prev;
        }
        setCompletedSteps(current => [...current, prev]);
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isOpen, duration, steps.length, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        {/* Animated Brain/Thinking Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Pulsing outer ring */}
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
            
            {/* Main icon circle */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              {/* Brain/AI icon */}
              <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              
              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-center text-slate-600 mb-6">
          Copado AI is processing your request...
        </p>

        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isPending = index > currentStep;

            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  isCurrent ? 'bg-blue-50 border border-blue-200' : 
                  isCompleted ? 'bg-green-50 border border-green-200' : 
                  'bg-slate-50 border border-slate-200'
                }`}
              >
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-blue-500 animate-pulse' :
                  'bg-slate-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                  )}
                </div>

                {/* Step Text */}
                <span className={`text-sm font-medium transition-all duration-300 ${
                  isCompleted ? 'text-green-700 line-through' :
                  isCurrent ? 'text-blue-700' :
                  'text-slate-500'
                }`}>
                  {step}
                </span>

                {/* Spinner for current step */}
                {isCurrent && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-slate-500 mt-2">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThinkingModal;
