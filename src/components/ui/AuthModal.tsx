import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, confirmPassword: string) => void;
  onSSOSignIn?: (provider: string) => void;
  onSSOSignUp?: (provider: string) => void;
  onSwitchMode?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSignIn,
  onSignUp,
  onSSOSignIn,
  onSSOSignUp,
  onSwitchMode,
}) => {
  const [step, setStep] = useState<'sso' | 'email' | 'sso-terms'>('sso');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSSOProvider, setSelectedSSOProvider] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSSOClick = (provider: string) => {
    setSelectedSSOProvider(provider);
    setStep('sso-terms');
  };

  const handleSSOTermsAgree = async () => {
    setIsLoading(true);
    try {
      if (mode === 'signin' && onSSOSignIn) {
        await onSSOSignIn(selectedSSOProvider);
      } else if (mode === 'signup' && onSSOSignUp) {
        await onSSOSignUp(selectedSSOProvider);
      }
      resetAndClose();
    } catch (error) {
      console.error('SSO error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setIsLoading(true);
    try {
      if (onSignIn) {
        await onSignIn(email, password);
      }
      resetAndClose();
    } catch (error) {
      console.error('Email sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) return;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      if (onSignUp) {
        await onSignUp(email, password, confirmPassword);
      }
      resetAndClose();
    } catch (error) {
      console.error('Email sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep('sso');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSelectedSSOProvider('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetAndClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="relative flex flex-col items-center w-full max-w-md my-8">
        {/* White Modal Card */}
        <div 
          className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* X Close Button - Top Right Corner */}
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Title */}
          <h2 
            className="text-2xl sm:text-[28px] font-roboto font-semibold text-center text-slate-950 mb-6 sm:mb-8" 
            style={{ letterSpacing: '-0.03em' }}
          >
            {mode === 'signin' ? 'Login' : 'Sign Up'}
          </h2>

          {step === 'sso' ? (
            /* SSO Options Screen */
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Salesforce Button */}
              <button
                onClick={() => handleSSOClick('salesforce')}
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-sm sm:text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Salesforce
              </button>
              
              {/* Google Button */}
              <button
                onClick={() => handleSSOClick('google')}
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-sm sm:text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Google
              </button>
              
              {/* Github Button */}
              <button
                onClick={() => handleSSOClick('github')}
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-sm sm:text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Github
              </button>
              
              {/* SAML Button */}
              <button
                onClick={() => handleSSOClick('saml')}
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-sm sm:text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                SAML
              </button>

              {/* OR Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 border-t border-[#cad5e2]"></div>
                <span className="text-sm sm:text-[15px] font-roboto text-[#020618]">OR</span>
                <div className="flex-1 border-t border-[#cad5e2]"></div>
              </div>

              {/* Use Email Button */}
              <button
                onClick={() => setStep('email')}
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-sm sm:text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Use Email
              </button>
            </div>
          ) : step === 'sso-terms' ? (
            /* SSO Terms Acceptance Screen */
            <div className="flex flex-col gap-6">
              {/* Terms Content */}
              <div className="bg-slate-50 rounded-lg p-4 sm:p-6 max-h-60 sm:max-h-80 overflow-y-auto border border-slate-200">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                  Single Sign-On Terms and Conditions
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 space-y-3">
                  <p>
                    By using Single Sign-On (SSO) with {selectedSSOProvider.charAt(0).toUpperCase() + selectedSSOProvider.slice(1)}, 
                    you agree to allow Copado AI to access your authentication information through this provider.
                  </p>
                  <p>
                    <strong>What we access:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your name and email address</li>
                    <li>Profile information necessary for account creation</li>
                    <li>Authentication tokens for secure access</li>
                  </ul>
                  <p>
                    <strong>Your data privacy:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>We never store your SSO provider passwords</li>
                    <li>Your data is encrypted and securely stored</li>
                    <li>You can revoke access at any time through your SSO provider settings</li>
                  </ul>
                  <p>
                    By continuing, you also agree to Copado's{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' and '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSSOTermsAgree}
                  disabled={isLoading}
                  className="w-full px-6 sm:px-8 py-3 bg-blue-600 text-white rounded text-sm sm:text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'I Agree - Continue with SSO'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('sso')}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Back to SSO options
                </button>
              </div>
            </div>
          ) : (
            /* Email/Password Screen */
            <form onSubmit={mode === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="flex flex-col gap-4 sm:gap-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-sm sm:text-[15px] font-roboto placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                disabled={isLoading}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-sm sm:text-[15px] font-roboto placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                disabled={isLoading}
              />

              {mode === 'signup' && (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-sm sm:text-[15px] font-roboto placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                  disabled={isLoading}
                />
              )}

              <button
                type="submit"
                disabled={
                  !email.trim() || 
                  !password.trim() || 
                  (mode === 'signup' && !confirmPassword.trim()) || 
                  isLoading
                }
                className="w-full px-6 sm:px-8 py-2 bg-blue-600 text-white rounded text-sm sm:text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
              </button>

              <button
                type="button"
                onClick={() => setStep('sso')}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Back to SSO options
              </button>
            </form>
          )}

          {/* Terms & Privacy Footer */}
          <p className="text-xs sm:text-[15px] text-center font-roboto text-[#020618] mt-6 sm:mt-8" style={{ letterSpacing: '-0.02em' }}>
            By Signing {mode === 'signin' ? 'In' : 'Up'} you agree to Copado's{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms</a>
            {' & '}
            <a href="#" className="text-blue-600 hover:underline">Privacy</a>
          </p>

          {/* Switch Mode */}
          {onSwitchMode && (
            <p className="text-xs sm:text-sm text-center text-slate-600 mt-4">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={onSwitchMode} className="text-blue-600 hover:underline font-medium">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
