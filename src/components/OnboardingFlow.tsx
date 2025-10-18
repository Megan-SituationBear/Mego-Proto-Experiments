import { useState } from 'react';
import PrimaryButton from './ui/PrimaryButton';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const interests = [
    {
      title: 'Fix Issues Faster',
      description: 'Resolve bugs and issues quickly',
      icon: '🔧',
    },
    {
      title: 'Deploy More Often',
      description: 'Streamline deployment process',
      icon: '🚀',
    },
    {
      title: 'Manage Teams',
      description: 'Collaborate effectively',
      icon: '👥',
    },
    {
      title: 'Automate Workflows',
      description: 'Save time with automation',
      icon: '⚡',
    },
  ];

  const plans = [
    {
      name: 'Starter Pack',
      price: 'Free',
      description: 'Perfect for individuals',
      features: ['5 projects', 'Basic templates', 'Community support'],
    },
    {
      name: 'Copado for Teams',
      price: '$79/mo',
      description: 'Best for teams',
      popular: true,
      features: ['Unlimited projects', 'All templates', 'Priority support', 'Team collaboration'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Custom solutions', 'Dedicated support', 'SSO & security', 'Onboarding'],
    },
  ];

  const toggleInterest = (title: string) => {
    if (selectedInterests.includes(title)) {
      setSelectedInterests(selectedInterests.filter(i => i !== title));
    } else {
      setSelectedInterests([...selectedInterests, title]);
    }
  };

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && selectedInterests.length > 0) {
      setStep(3);
    } else if (step === 3 && selectedPlan) {
      onComplete();
    }
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return selectedInterests.length > 0;
    if (step === 3) return selectedPlan !== '';
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-2xl px-4">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-12 bg-blue-600' : s < step ? 'w-8 bg-blue-400' : 'w-8 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
            {step === 1 && "Let's Go!"}
            {step === 2 && "What Would You Like To Spend Time Fixing?"}
            {step === 3 && "Choose Your Plan"}
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-8">
            {step === 1 && "What's Your Name?"}
            {step === 2 && "Select all that apply"}
            {step === 3 && "Start with a 14-day free trial"}
          </p>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg transition-all"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interests.map((interest) => (
                <button
                  key={interest.title}
                  onClick={() => toggleInterest(interest.title)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedInterests.includes(interest.title)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">{interest.title}</h3>
                  <p className="text-sm text-gray-600">{interest.description}</p>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {plans.map((plan) => (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left relative ${
                    selectedPlan === plan.name
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plan.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            )}
            <PrimaryButton
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1"
            >
              {step === 3 ? 'Start Free Trial' : 'Continue'}
            </PrimaryButton>
          </div>

          {/* Skip Option */}
          {step < 3 && (
            <button
              onClick={onComplete}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
