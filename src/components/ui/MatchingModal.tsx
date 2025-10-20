import { useState } from 'react';
import { X } from 'lucide-react';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const goals = [
    { id: 'plan', label: 'Plan with data', icon: '📊' },
    { id: 'deploy', label: 'Deploy without errors', icon: '🚀' },
    { id: 'build', label: 'Build quicker', icon: '⚡' },
    { id: 'support', label: 'Solve support issues proactively', icon: '🛟' },
    { id: 'optimize', label: 'Optimize Salesforce orgs', icon: '⚙️' },
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
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {!showResults ? (
          /* Questions Flow */
          <div className="p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
              What do you want to accomplish?
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Select all that apply
            </p>

            <div className="space-y-3 mb-8">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4 ${
                    selectedGoals.includes(goal.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-lg font-medium text-slate-900">
                    {goal.label}
                  </span>
                  {selectedGoals.includes(goal.id) && (
                    <svg
                      className="w-6 h-6 text-blue-600 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={selectedGoals.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selectedGoals.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        ) : (
          /* Results */
          <div className="p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
              Perfect Match! 🎯
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Based on your goals, we've found{' '}
              <span className="font-semibold text-blue-600">
                {12 + selectedGoals.length * 3} templates
              </span>{' '}
              that can help you
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4">
                Your selected goals:
              </h3>
              <div className="space-y-2">
                {selectedGoals.map((goalId) => {
                  const goal = goals.find((g) => g.id === goalId);
                  return (
                    <div
                      key={goalId}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <span className="text-xl">{goal?.icon}</span>
                      <span>{goal?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTryCopado}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                Try Copado
              </button>
              <button
                onClick={resetAndClose}
                className="w-full py-3 rounded-lg border-2 border-gray-300 text-slate-900 font-medium hover:bg-gray-50 transition-all"
              >
                Browse Templates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingModal;
