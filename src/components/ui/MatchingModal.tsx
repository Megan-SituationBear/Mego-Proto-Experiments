import { useState } from 'react';
import { X } from 'lucide-react';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onBrowseTemplates?: (selectedGoals: string[]) => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, onClose, onComplete, onBrowseTemplates }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      setShowResults(true);
    }
  };

  const handleTryCopado = () => {
    onComplete();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setTimeout(() => {
        setShowResults(false);
        setSelectedGoals([]);
      }, 300);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setShowResults(false);
      setSelectedGoals([]);
    }, 300);
  };

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

        {!showResults ? (
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
              onClick={handleContinue}
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
        ) : (
          /* Results */
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <span className="text-5xl">🎯</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                Perfect Match!
              </h2>
              <p className="text-lg text-slate-600">
                Based on your goals, we've found{' '}
                <span className="font-bold text-green-600">
                  {12 + selectedGoals.length * 3} templates
                </span>{' '}
                that can help you
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border-2 border-green-200">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">
                Your selected goals:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedGoals.map((goalId) => {
                  const goal = goals.find((g) => g.id === goalId);
                  return (
                    <div
                      key={goalId}
                      className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                    >
                      <span className="text-3xl">{goal?.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-900">{goal?.label}</div>
                        <div className="text-sm text-slate-600">{goal?.description}</div>
                      </div>
                    </div>
                  );
                })}
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
