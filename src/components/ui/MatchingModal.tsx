import { useState } from 'react';
import { X } from 'lucide-react';
import './slider-styles.css';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onBrowseTemplates?: (selectedGoals: string[]) => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, onClose, onComplete, onBrowseTemplates }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [expertiseLevel, setExpertiseLevel] = useState<number>(2); // 0-4 scale
  const [currentStep, setCurrentStep] = useState<'goals' | 'expertise' | 'results'>('goals');

  const goals = [
    { id: 'plan', label: 'Plan with data', icon: '📊', description: 'Make informed decisions' },
    { id: 'deploy', label: 'Deploy without errors', icon: '🚀', description: 'Ship with confidence' },
    { id: 'build', label: 'Build quicker', icon: '⚡', description: 'Accelerate development' },
    { id: 'support', label: 'Solve support issues proactively', icon: '🛟', description: 'Prevent problems early' },
    { id: 'optimize', label: 'Optimize Salesforce orgs', icon: '⚙️', description: 'Improve performance' },
  ];

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinueFromGoals = () => {
    if (selectedGoals.length > 0) {
      setCurrentStep('expertise');
    }
  };

  const handleContinueFromExpertise = () => {
    setCurrentStep('results');
  };

  const handleBack = () => {
    if (currentStep === 'expertise') {
      setCurrentStep('goals');
    } else if (currentStep === 'results') {
      setCurrentStep('expertise');
    }
  };

  const handleTryCopado = () => {
    onComplete();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedGoals([]);
      setExpertiseLevel(2);
      setCurrentStep('goals');
    }, 300);
  };

  const expertiseLabels = [
    { value: 0, label: 'Do the work for me, Copado', emoji: '🎁', description: 'Full automation & guidance' },
    { value: 1, label: 'Learning the ropes', emoji: '📚', description: 'Guided workflows' },
    { value: 2, label: 'Getting comfortable', emoji: '💡', description: 'Balanced approach' },
    { value: 3, label: 'Pretty confident', emoji: '🎯', description: 'Advanced features' },
    { value: 4, label: 'Expert at Salesforce DevOps', emoji: '🚀', description: 'Full control & customization' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {currentStep === 'goals' ? (
          /* Questions Flow */
          <div className="p-8 sm:p-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center">
              What do you want to accomplish?
            </h2>
            <p className="text-lg text-slate-600 mb-10 text-center">
              Select all that apply
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center gap-3 min-h-[180px] ${
                    selectedGoals.includes(goal.id)
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-indigo-50 hover:shadow-sm hover:border-indigo-300'
                  }`}
                >
                  {/* Check Mark Badge */}
                  {selectedGoals.includes(goal.id) && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="text-6xl mb-2">
                    {goal.icon}
                  </div>
                  
                  {/* Label */}
                  <div className="text-lg font-bold text-slate-900 leading-tight">
                    {goal.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-slate-600">
                    {goal.description}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueFromGoals}
              disabled={selectedGoals.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedGoals.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          </div>
        ) : currentStep === 'expertise' ? (
          /* Expertise Level Slider */
          <div className="p-8 sm:p-12">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center">
              How much experience do you have?
            </h2>
            <p className="text-lg text-slate-600 mb-10 text-center">
              Help us recommend the right templates for your skill level
            </p>

            {/* Expertise Slider Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-indigo-200">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{expertiseLabels[expertiseLevel].emoji}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {expertiseLabels[expertiseLevel].label}
                </h3>
                <p className="text-slate-600">
                  {expertiseLabels[expertiseLevel].description}
                </p>
              </div>

              {/* Slider */}
              <div className="relative pt-8">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={expertiseLevel}
                  onChange={(e) => setExpertiseLevel(parseInt(e.target.value))}
                  className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(expertiseLevel / 4) * 100}%, #e2e8f0 ${(expertiseLevel / 4) * 100}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between mt-4 text-xs text-slate-600">
                  <span className="text-left w-20">Beginner</span>
                  <span className="text-center flex-1">Intermediate</span>
                  <span className="text-right w-20">Expert</span>
                </div>
              </div>
            </div>

            {/* Expertise Level Options as Pills */}
            <div className="grid grid-cols-5 gap-2 mb-8">
              {expertiseLabels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setExpertiseLevel(level.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    expertiseLevel === level.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-3xl mb-1">{level.emoji}</div>
                  <div className="text-xs font-medium text-slate-700 leading-tight">
                    {level.value === 0 ? 'Beginner' : level.value === 4 ? 'Expert' : `Level ${level.value + 1}`}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueFromExpertise}
              className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Show My Matches →
            </button>
          </div>
        ) : (
          /* Results */
          <div className="p-8 sm:p-12">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <span className="text-5xl">🎯</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                Perfect Match!
              </h2>
              <p className="text-lg text-slate-600">
                Based on your goals and experience level, we've found{' '}
                <span className="font-bold text-green-600">
                  {12 + selectedGoals.length * 3} templates
                </span>{' '}
                that can help you
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Goals Summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Your Goals
                </h3>
                <div className="space-y-2">
                  {selectedGoals.map((goalId) => {
                    const goal = goals.find((g) => g.id === goalId);
                    return (
                      <div
                        key={goalId}
                        className="flex items-center gap-2 text-slate-900"
                      >
                        <span className="text-xl">{goal?.icon}</span>
                        <span className="text-sm font-medium">{goal?.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expertise Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Your Level
                </h3>
                <div className="text-center">
                  <div className="text-5xl mb-3">{expertiseLabels[expertiseLevel].emoji}</div>
                  <div className="font-bold text-slate-900">{expertiseLabels[expertiseLevel].label}</div>
                  <div className="text-sm text-slate-600 mt-1">{expertiseLabels[expertiseLevel].description}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTryCopado}
                className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start with Copado AI →
              </button>
              <button
                onClick={() => {
                  if (onBrowseTemplates) {
                    onBrowseTemplates(selectedGoals);
                  }
                  resetAndClose();
                }}
                className="w-full py-4 rounded-xl border-2 border-slate-300 text-slate-900 font-bold text-lg hover:bg-indigo-50 hover:border-indigo-400 transition-all"
              >
                Browse Matched Templates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingModal;
