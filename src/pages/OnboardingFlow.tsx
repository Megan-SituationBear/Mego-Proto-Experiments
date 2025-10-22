import { useState } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton';

interface OnboardingFlowProps {
  onComplete: () => void;
  isSignUp?: boolean; // true for sign up flow, false for login flow
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, isSignUp = true }) => {
  const [step, setStep] = useState<'sso' | 'email' | 'terms' | 'goals' | 'expertise' | 'name' | 'pricing'>('sso');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [expertiseLevel, setExpertiseLevel] = useState<number>(2);

  const goals = [
    { id: 'plan', label: 'Plan with data', description: 'Make informed decisions' },
    { id: 'deploy', label: 'Deploy without errors', description: 'Ship with confidence' },
    { id: 'build', label: 'Build quicker', description: 'Accelerate development' },
    { id: 'support', label: 'Solve support issues proactively', description: 'Prevent problems early' },
    { id: 'optimize', label: 'Optimize Salesforce orgs', description: 'Improve performance' },
    { id: 'exploring', label: 'Just checking it out', description: 'Exploring options' },
  ];

  const expertiseLabels = [
    { value: 0, label: 'Do the work for me, Copado', description: 'Full automation & guidance' },
    { value: 1, label: 'Learning the ropes', description: 'Guided workflows' },
    { value: 2, label: 'Getting comfortable', description: 'Balanced approach' },
    { value: 3, label: 'Pretty confident', description: 'Advanced features' },
    { value: 4, label: 'Expert at Salesforce DevOps', description: 'Full control & customization' },
  ];

  const pricingPlans = [
    { name: 'Free', price: '$0', period: '/month', description: 'Perfect for trying out Copado AI', features: ['5 AI conversations', 'Basic templates', 'Community support'] },
    { name: 'Pro', price: '$29', period: '/month', description: 'Best for individual users', features: ['Unlimited AI conversations', 'All templates', 'Priority support', 'Advanced features'], recommended: true },
    { name: 'Enterprise', price: 'Custom', period: '', description: 'For teams and organizations', features: ['Everything in Pro', 'Custom templates', 'Dedicated support', 'SSO & security', 'Volume pricing'] },
  ];

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleSSOLogin = () => {
    setIsLoading(true);
    // Simulate SSO login
    setTimeout(() => {
      setIsLoading(false);
      setStep('terms'); // Both login and signup go to terms
    }, 1500);
  };

  const handleEmailLogin = () => {
    if (email && password) {
      setIsLoading(true);
      // Simulate email login
      setTimeout(() => {
        setIsLoading(false);
        setStep('terms');
      }, 1000);
    }
  };

  const handleAcceptTerms = () => {
    if (termsAccepted) {
      if (isSignUp) {
        setStep('goals'); // Sign up: go to goals question
      } else {
        onComplete(); // Login: complete after accepting terms
      }
    }
  };

  const handleGoalsNext = () => {
    if (selectedGoals.length > 0) {
      setStep('expertise');
    }
  };

  const handleExpertiseNext = () => {
    setStep('name');
  };

  const handleNameNext = () => {
    if (name.trim()) {
      setStep('pricing');
    }
  };

  const handlePricingSelect = (plan: string) => {
    console.log('Selected plan:', plan);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-fadeIn">
      <div className="w-full max-w-md px-4">
        {/* Content Card */}
        <div key={step} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 animate-slideUp">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {step === 'sso' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                {isSignUp ? 'Create an account' : 'Welcome to Copado AI'}
              </h2>
              <p className="text-center text-slate-600 mb-8">
                {isSignUp ? 'Choose your sign-up method' : 'Sign in to get started'}
              </p>

              {/* SSO Buttons */}
              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-slate-900 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* GitHub */}
                <button
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-slate-900 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Continue with GitHub'}
                </button>

                {/* SAML SSO */}
                <button
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-slate-900 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Continue with SAML SSO'}
                </button>

                {/* Salesforce */}
                <button
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-slate-900 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A1E0">
                    <path d="M10.006 5.415a4.195 4.195 0 013.045-.309 4.194 4.194 0 012.306 1.548 4.192 4.192 0 011.02 3.654 5.43 5.43 0 012.915.385 5.432 5.432 0 012.246 2.012 5.433 5.433 0 01.693 3.876 5.433 5.433 0 01-1.679 3.195 5.433 5.433 0 01-3.398 1.442 5.433 5.433 0 01-3.644-1.095 4.194 4.194 0 01-3.654 1.02 4.194 4.194 0 01-2.306-1.548 4.192 4.192 0 01-1.02-3.654 5.43 5.43 0 01-2.915-.385 5.432 5.432 0 01-2.246-2.012 5.433 5.433 0 01-.693-3.876 5.433 5.433 0 011.679-3.195A5.433 5.433 0 017.753 5.03a5.433 5.433 0 013.644 1.095 4.194 4.194 0 01-.391-3.71z"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Continue with Salesforce'}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or</span>
                </div>
              </div>

              {/* Email Button */}
              <button
                onClick={() => setStep('email')}
                disabled={isLoading}
                className="w-full px-6 py-3.5 rounded-xl border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all font-semibold text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Continue with Email
              </button>
            </>
          )}

          {step === 'email' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                {isSignUp ? 'Sign up with email' : 'Sign in with email'}
              </h2>
              <p className="text-center text-slate-600 mb-8">
                {isSignUp ? 'Create your account' : 'Enter your credentials'}
              </p>

              {/* Email/Password Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && email && password) {
                        handleEmailLogin();
                      }
                    }}
                  />
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <PrimaryButton
                onClick={handleEmailLogin}
                disabled={!email || !password || isLoading}
                className="w-full mb-4"
              >
                {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </PrimaryButton>

              {/* Back to SSO */}
              <button
                onClick={() => setStep('sso')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Back to other options
              </button>
            </>
          )}

          {step === 'terms' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                Terms & Conditions
              </h2>
              <p className="text-center text-slate-600 mb-8">
                Please review and accept to continue
              </p>

              {/* Terms Content */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6 max-h-64 overflow-y-auto border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Copado AI Terms of Service</h3>
                <div className="text-sm text-slate-600 space-y-3">
                  <p>
                    By using Copado AI, you agree to our terms of service and privacy policy.
                  </p>
                  <p>
                    <strong>1. Service Usage:</strong> You may use Copado AI for legitimate business purposes in accordance with Salesforce platform guidelines.
                  </p>
                  <p>
                    <strong>2. Data & Privacy:</strong> We collect and process data in accordance with our privacy policy and applicable data protection laws.
                  </p>
                  <p>
                    <strong>3. AI-Generated Content:</strong> AI-generated content should be reviewed before deployment. You are responsible for validating all outputs.
                  </p>
                  <p>
                    <strong>4. Account Security:</strong> You are responsible for maintaining the security of your account credentials.
                  </p>
                  <p>
                    <strong>5. Acceptable Use:</strong> Do not use the service for any unlawful purpose or in violation of Salesforce terms.
                  </p>
                </div>
              </div>

              {/* Accept Checkbox */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  I have read and agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              {/* Continue Button */}
              <PrimaryButton
                onClick={handleAcceptTerms}
                disabled={!termsAccepted}
                className="w-full"
              >
                Accept & Continue
              </PrimaryButton>
            </>
          )}

          {step === 'goals' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                What do you want to accomplish?
              </h2>
              <p className="text-center text-slate-600 mb-8">
                Select all that apply
              </p>

              {/* Goals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`relative p-6 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-2 ${
                      selectedGoals.includes(goal.id)
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-slate-200 bg-white hover:bg-indigo-50 hover:shadow-sm hover:border-indigo-300'
                    }`}
                  >
                    {selectedGoals.includes(goal.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-sm font-semibold text-slate-700">{goal.label}</div>
                    <div className="text-xs text-slate-600">{goal.description}</div>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <PrimaryButton
                onClick={handleGoalsNext}
                disabled={selectedGoals.length === 0}
                className="w-full"
              >
                Continue →
              </PrimaryButton>
            </>
          )}

          {step === 'expertise' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                How much experience do you have?
              </h2>
              <p className="text-center text-slate-600 mb-8">
                Help us recommend the right templates for your skill level
              </p>

              {/* Expertise Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {expertiseLabels[expertiseLevel].label}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {expertiseLabels[expertiseLevel].description}
                  </p>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={expertiseLevel}
                  onChange={(e) => setExpertiseLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(expertiseLevel / 4) * 100}%, #e2e8f0 ${(expertiseLevel / 4) * 100}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-slate-600">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              {/* Expertise Pills */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {expertiseLabels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setExpertiseLevel(level.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      expertiseLevel === level.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-700">
                      {level.value === 0 ? 'Beginner' : level.value === 4 ? 'Expert' : `Level ${level.value + 1}`}
                    </div>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <PrimaryButton
                onClick={handleExpertiseNext}
                className="w-full"
              >
                Continue →
              </PrimaryButton>
            </>
          )}

          {step === 'name' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                Let's Get Started!
              </h2>
              <p className="text-center text-slate-600 mb-8">
                What's your name?
              </p>

              {/* Name Input */}
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-lg transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      handleNameNext();
                    }
                  }}
                />
              </div>

              {/* Continue Button */}
              <PrimaryButton
                onClick={handleNameNext}
                disabled={!name.trim()}
                className="w-full"
              >
                Continue
              </PrimaryButton>
            </>
          )}

          {step === 'pricing' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                Choose Your Plan
              </h2>
              <p className="text-center text-slate-600 mb-8">
                Start for free, upgrade anytime
              </p>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {pricingPlans.map((plan) => (
                  <button
                    key={plan.name}
                    onClick={() => handlePricingSelect(plan.name)}
                    className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                      plan.recommended
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {plan.price}
                        <span className="text-sm text-slate-600">{plan.period}</span>
                      </div>
                      <p className="text-xs text-slate-600">{plan.description}</p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {/* Skip for Now */}
              <button
                onClick={() => handlePricingSelect('Free')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Start with Free plan →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
