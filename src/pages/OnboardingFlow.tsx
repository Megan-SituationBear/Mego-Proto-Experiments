import { useState } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton';

interface OnboardingFlowProps {
  onComplete: () => void;
  isSignUp?: boolean; // true for sign up flow, false for login flow
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, isSignUp = true }) => {
  const [step, setStep] = useState<'sso' | 'terms' | 'name' | 'interests'>('sso');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { title: 'Fix Issues Faster', description: 'Resolve bugs and issues quickly', icon: '🔧' },
    { title: 'Deploy More Often', description: 'Streamline deployment process', icon: '🚀' },
    { title: 'Manage Teams', description: 'Collaborate effectively', icon: '👥' },
    { title: 'Automate Workflows', description: 'Save time with automation', icon: '⚡' },
  ];

  const toggleInterest = (title: string) => {
    if (selectedInterests.includes(title)) {
      setSelectedInterests(selectedInterests.filter(i => i !== title));
    } else {
      setSelectedInterests([...selectedInterests, title]);
    }
  };

  const handleSSOLogin = () => {
    setIsLoading(true);
    // Simulate SSO login
    setTimeout(() => {
      setIsLoading(false);
      setStep('terms');
    }, 1500);
  };

  const handleAcceptTerms = () => {
    if (termsAccepted) {
      if (isSignUp) {
        setStep('name'); // Sign up: go to name question
      } else {
        onComplete(); // Login: skip questions and complete
      }
    }
  };

  const handleNameNext = () => {
    if (name.trim()) {
      setStep('interests');
    }
  };

  const handleInterestsNext = () => {
    if (selectedInterests.length > 0) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md px-4">
        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
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
                Welcome to Copado AI
              </h2>
              <p className="text-center text-slate-600 mb-8">
                Sign in to get started
              </p>

              {/* SSO Button */}
              <div className="space-y-3">
                <button
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-lg font-semibold text-slate-900 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Continue with SSO'}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">or</span>
                  </div>
                </div>

                <button
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-lg font-semibold text-slate-900 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#0052CC"/>
                  </svg>
                  {isLoading ? 'Signing in...' : 'Continue with Salesforce'}
                </button>
              </div>
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

          {step === 'interests' && (
            <>
              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
                What Would You Like To Fix?
              </h2>
              <p className="text-center text-slate-600 mb-8">
                Select all that apply
              </p>

              {/* Interests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {interests.map((interest) => (
                  <button
                    key={interest.title}
                    onClick={() => toggleInterest(interest.title)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedInterests.includes(interest.title)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{interest.icon}</div>
                    <h3 className="font-semibold text-slate-900 mb-1">{interest.title}</h3>
                    <p className="text-sm text-slate-600">{interest.description}</p>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <PrimaryButton
                onClick={handleInterestsNext}
                disabled={selectedInterests.length === 0}
                className="w-full"
              >
                Get Started
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
