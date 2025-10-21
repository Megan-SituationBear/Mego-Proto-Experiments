import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import './slider-styles.css';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onBrowseTemplates?: (selectedGoals: string[]) => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({ isOpen, onClose, onComplete, onBrowseTemplates: _onBrowseTemplates }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [expertiseLevel, setExpertiseLevel] = useState<number>(2); // 0-4 scale
  const [currentStep, setCurrentStep] = useState<'goals' | 'expertise' | 'results'>('goals');

  const goals = [
    { 
      id: 'plan', 
      label: 'Plan with data', 
      icon: 'ChartBarIcon',
      description: 'Make informed decisions' 
    },
    { 
      id: 'deploy', 
      label: 'Deploy without errors', 
      icon: 'RocketLaunchIcon',
      description: 'Ship with confidence' 
    },
    { 
      id: 'build', 
      label: 'Build quicker', 
      icon: 'BoltIcon',
      description: 'Accelerate development' 
    },
    { 
      id: 'support', 
      label: 'Solve support issues proactively', 
      icon: 'LifebuoyIcon',
      description: 'Prevent problems early' 
    },
    { 
      id: 'optimize', 
      label: 'Optimize Salesforce orgs', 
      icon: 'CogIcon',
      description: 'Improve performance' 
    },
    { 
      id: 'exploring', 
      label: 'Just checking it out', 
      icon: 'EyeIcon',
      description: 'Exploring options' 
    },
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

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedGoals([]);
      setExpertiseLevel(2);
      setCurrentStep('goals');
    }, 300);
  };

  const expertiseLabels = [
    { value: 0, label: 'Do the work for me, Copado', icon: 'GiftIcon', description: 'Full automation & guidance' },
    { value: 1, label: 'Learning the ropes', icon: 'AcademicCapIcon', description: 'Guided workflows' },
    { value: 2, label: 'Getting comfortable', icon: 'LightBulbIcon', description: 'Balanced approach' },
    { value: 3, label: 'Pretty confident', icon: 'CheckBadgeIcon', description: 'Advanced features' },
    { value: 4, label: 'Expert at Salesforce DevOps', icon: 'StarIcon', description: 'Full control & customization' },
  ];

  // Hero Icons components
  const HeroIcon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
    const icons: { [key: string]: React.ReactElement } = {
      ChartBarIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      RocketLaunchIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      ),
      BoltIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
      LifebuoyIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288" />
        </svg>
      ),
      CogIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
      GiftIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      ),
      AcademicCapIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
      LightBulbIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      CheckBadgeIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      ),
      StarIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
      TargetIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
      ),
      ChartPieIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      ),
      EyeIcon: (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    };
    return icons[name] || null;
  };

  return (
    <Dialog open={isOpen} onClose={resetAndClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full max-w-2xl max-h-[90vh] overflow-y-auto data-closed:sm:scale-95"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

        {currentStep === 'goals' ? (
          /* Questions Flow */
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              What do you want to accomplish?
            </h2>
            <p className="text-slate-700 mb-8 text-center" style={{ fontSize: '14px' }}>
              Select all that apply
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all text-center flex flex-col items-center justify-center gap-2 min-h-[130px] ${
                    selectedGoals.includes(goal.id)
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-indigo-50 hover:shadow-sm hover:border-indigo-300'
                  }`}
                >
                  {/* Check Mark Badge */}
                  {selectedGoals.includes(goal.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-white"
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
                  
                  {/* Hero Icon */}
                  <div className={`${selectedGoals.includes(goal.id) ? 'text-green-600' : 'text-slate-600'}`}>
                    <HeroIcon name={goal.icon} className="w-12 h-12" />
                  </div>
                  
                  {/* Label */}
                  <div className="text-slate-700 leading-tight font-semibold" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}>
                    {goal.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-slate-700 text-xs">
                    {goal.description}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueFromGoals}
              disabled={selectedGoals.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selectedGoals.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}
            >
              Continue →
            </button>
          </div>
        ) : currentStep === 'expertise' ? (
          /* Expertise Level Slider */
          <div className="p-8">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold text-slate-700">Back</span>
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              How much experience do you have?
            </h2>
            <p className="text-slate-700 mb-8 text-center" style={{ fontSize: '14px' }}>
              Help us recommend the right templates for your skill level
            </p>

            {/* Expertise Slider Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-white shadow-sm ${
                  expertiseLevel === 0 ? 'text-emerald-600' :
                  expertiseLevel === 1 ? 'text-blue-600' :
                  expertiseLevel === 2 ? 'text-amber-600' :
                  expertiseLevel === 3 ? 'text-purple-600' :
                  'text-indigo-600'
                }`}>
                  <HeroIcon name={expertiseLabels[expertiseLevel].icon} className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {expertiseLabels[expertiseLevel].label}
                </h3>
                <p className="text-slate-700" style={{ fontSize: '14px' }}>
                  {expertiseLabels[expertiseLevel].description}
                </p>
              </div>

              {/* Slider */}
              <div className="relative pt-6">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={expertiseLevel}
                  onChange={(e) => setExpertiseLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(expertiseLevel / 4) * 100}%, #e2e8f0 ${(expertiseLevel / 4) * 100}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between mt-3 text-slate-700" style={{ fontSize: '12px' }}>
                  <span className="text-left">Beginner</span>
                  <span className="text-right">Expert</span>
                </div>
              </div>
            </div>

            {/* Expertise Level Options as Pills */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {expertiseLabels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setExpertiseLevel(level.value)}
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    expertiseLevel === level.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300'
                  }`}
                >
                  <div className={`mx-auto ${expertiseLevel === level.value ? 'text-green-600' : 'text-slate-600'}`}>
                    <HeroIcon name={level.icon} className="w-6 h-6 mx-auto mb-1" />
                  </div>
                  <div className="text-xs font-semibold text-slate-700 leading-tight" style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}>
                    {level.value === 0 ? 'Beginner' : level.value === 4 ? 'Expert' : `Level ${level.value + 1}`}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueFromExpertise}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}
            >
              Show My Matches →
            </button>
          </div>
        ) : (
          /* Results */
          <div className="p-8">
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold text-slate-700">Back</span>
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <HeroIcon name="TargetIcon" className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Perfect Match!
              </h2>
              <p className="text-slate-700" style={{ fontSize: '14px' }}>
                Based on your goals and experience level, we've found{' '}
                <span className="font-bold text-green-600">
                  {12 + selectedGoals.length * 3} templates
                </span>{' '}
                that can help you
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Goals Summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}>
                  <HeroIcon name="CheckBadgeIcon" className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Your Goals</span>
                </h3>
                <div className="space-y-2">
                  {selectedGoals.map((goalId) => {
                    const goal = goals.find((g) => g.id === goalId);
                    return (
                      <div
                        key={goalId}
                        className="flex items-center gap-2 text-slate-700"
                        style={{ fontSize: '14px' }}
                      >
                        <HeroIcon name={goal?.icon || 'CheckBadgeIcon'} className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{goal?.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expertise Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}>
                  <HeroIcon name="ChartPieIcon" className="w-5 h-5 text-indigo-600" />
                  <span className="text-slate-700">Your Level</span>
                </h3>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-white shadow-sm text-indigo-600">
                    <HeroIcon name={expertiseLabels[expertiseLevel].icon} className="w-8 h-8" />
                  </div>
                  <div className="font-bold text-slate-900" style={{ fontSize: '13px' }}>{expertiseLabels[expertiseLevel].label}</div>
                  <div className="text-slate-700 mt-1" style={{ fontSize: '12px' }}>{expertiseLabels[expertiseLevel].description}</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleTryCopado}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl"
              style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}
            >
              Start with Copado AI →
            </button>
          </div>
        )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default MatchingModal;
