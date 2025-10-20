import { useState, useEffect } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const roles = [
    {
      title: 'Save Time Deploying',
      description: 'Automate and streamline Salesforce deployments',
      icon: '🚀',
    },
    {
      title: 'Plan Using Data',
      description: 'Make decisions with analytics and insights',
      icon: '📊',
    },
    {
      title: 'Ensure Quality',
      description: 'Test and validate Salesforce changes',
      icon: '✓',
    },
    {
      title: 'Manage Releases',
      description: 'Coordinate and track release cycles',
      icon: '📦',
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

  useEffect(() => {
    setIsAnimating(true);
  }, [step]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsAnimating(false);
      setTimeout(() => setStep(2), 300);
    }
  };

  const handleRoleClick = (title: string) => {
    setIsAnimating(false);
    setTimeout(() => setStep(3), 300);
  };

  const handlePlanClick = (planName: string) => {
    setIsAnimating(false);
    setTimeout(() => onComplete(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-3xl px-6">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-3 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s === step ? 'w-16 bg-white' : s < step ? 'w-12 bg-white/60' : 'w-8 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div 
          className={`transition-all duration-500 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Let's Go!
              </h1>
              <p className="text-2xl text-white/90 mb-12">
                What's Your Name?
              </p>
              <form onSubmit={handleNameSubmit} className="max-w-md mx-auto">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-8 py-6 rounded-2xl border-0 bg-white/95 backdrop-blur-sm text-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/40 transition-all shadow-2xl"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="mt-6 px-12 py-4 rounded-2xl bg-white text-blue-600 font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continue
                </button>
              </form>
              <button
                onClick={onComplete}
                className="mt-8 text-white/70 hover:text-white transition-colors text-sm"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 2: Salesforce Role */}
          {step === 2 && (
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                What Do You Do With Salesforce?
              </h1>
              <p className="text-xl text-white/90 mb-12">
                Pick your primary focus
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {roles.map((role, index) => (
                  <button
                    key={role.title}
                    onClick={() => handleRoleClick(role.title)}
                    className="group p-8 rounded-2xl bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 text-left shadow-2xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {role.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-gray-600">
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={onComplete}
                className="mt-8 text-white/70 hover:text-white transition-colors text-sm"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 3: Plans */}
          {step === 3 && (
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Choose Your Plan
              </h1>
              <p className="text-xl text-white/90 mb-12">
                Start with a 14-day free trial
              </p>
              <div className="space-y-4 max-w-2xl mx-auto">
                {plans.map((plan, index) => (
                  <button
                    key={plan.name}
                    onClick={() => handlePlanClick(plan.name)}
                    className="group w-full p-8 rounded-2xl bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 text-left relative shadow-2xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                        ⭐ Most Popular
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600">
                          {plan.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {plan.price}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
