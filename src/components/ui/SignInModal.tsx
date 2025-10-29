import { useState } from 'react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: () => void;
  onSSOSignIn?: (provider: string) => void;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onSSOSignIn,
}) => {
  const [step, setStep] = useState<'sso' | 'email' | 'sso-terms' | 'email-terms'>('sso');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (onSSOSignIn) {
        await onSSOSignIn(selectedSSOProvider);
      }
      resetAndClose();
    } catch (error) {
      console.error('SSO sign in error:', error);
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

  const resetAndClose = () => {
    setStep('sso');
    setEmail('');
    setPassword('');
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      onClick={handleBackdropClick}
    >
      <div className="relative flex flex-col items-center w-full max-w-md px-4">
        {/* Header: Logo + COPADO AI + X */}
        <div className="flex items-center gap-4 mb-6 w-full justify-center relative">
          {/* Logo */}
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* COPADO AI Text */}
          <h1 className="text-xl font-bold text-white tracking-[0.2em]">COPADO AI</h1>
          
          {/* X Close Button */}
          <button
            onClick={resetAndClose}
            className="absolute right-0 text-white hover:text-slate-300 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* White Modal Card */}
        <div 
          className="w-full bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Login Title */}
          <h2 
            className="text-[28px] font-roboto font-semibold text-center text-slate-950 mb-8" 
            style={{ letterSpacing: '-0.03em' }}
          >
            Login
          </h2>

          {step === 'sso' ? (
            /* SSO Options Screen */
            <div className="flex flex-col gap-5">
              {/* Salesforce Button */}
              <button
                onClick={() => handleSSOClick('salesforce')}
                disabled={isLoading}
                className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Salesforce
              </button>
              
              {/* Google Button */}
              <button
                onClick={() => handleSSOClick('google')}
                disabled={isLoading}
                className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Google
              </button>
              
              {/* Github Button */}
              <button
                onClick={() => handleSSOClick('github')}
                disabled={isLoading}
                className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Github
              </button>
              
              {/* SAML Button */}
              <button
                onClick={() => handleSSOClick('saml')}
                disabled={isLoading}
                className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                SAML
              </button>

              {/* OR Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 border-t border-[#cad5e2]"></div>
                <span className="text-[15px] font-roboto text-[#020618]">OR</span>
                <div className="flex-1 border-t border-[#cad5e2]"></div>
              </div>

              {/* Use Email Button */}
              <button
                onClick={() => setStep('email')}
                disabled={isLoading}
                className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-slate-100 transition-colors disabled:opacity-50"
                style={{ letterSpacing: '-0.02em' }}
              >
                Use Email
              </button>
            </div>
          ) : step === 'sso-terms' ? (
            /* SSO Terms Acceptance Screen - Standard OAuth Style */
            <div className="flex flex-col gap-6">
              {/* Header Text */}
              <p className="text-sm text-slate-700 font-medium">
                Copado AI will access this info about you
              </p>

              {/* Permissions List */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Name and profile picture</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m2 7 10 6 10-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email address</p>
                  </div>
                </div>
              </div>

              {/* Privacy Text */}
              <div className="text-xs text-slate-600 space-y-2 pt-2">
                <p>
                  Review Copado AI's{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  {' and '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}to understand how Copado AI will process and protect your data.
                </p>
                <p>
                  To make changes at any time, go to your{' '}
                  <span className="capitalize">{selectedSSOProvider}</span> Account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('sso')}
                  disabled={isLoading}
                  className="flex-1 px-6 py-2.5 rounded border border-[#62748e] bg-white text-[#020618] text-[15px] font-roboto font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSSOTermsAgree}
                  disabled={isLoading}
                  className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          ) : (
            /* Email/Password Screen */
            <form onSubmit={handleEmailSignIn} className="flex flex-col gap-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                disabled={isLoading}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!email.trim() || !password.trim() || isLoading}
                className="w-full px-8 py-2 bg-blue-600 text-white rounded text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
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
          <p className="text-[15px] text-center font-roboto text-[#020618] mt-8" style={{ letterSpacing: '-0.02em' }}>
            By Signing Up you agree to Copado's{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms</a>
            {' & '}
            <a href="#" className="text-blue-600 hover:underline">Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
