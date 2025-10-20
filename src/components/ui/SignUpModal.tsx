import { useState } from 'react';
import Modal from './Modal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (email: string, password: string, confirmPassword: string) => void;
  onSignIn?: () => void;
  onSSOSignUp?: (provider: string) => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  onSSOSignUp,
}) => {
  const [step, setStep] = useState<'sso' | 'email' | 'sso-terms'>('sso');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSSOProvider, setSelectedSSOProvider] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOClick = (provider: string) => {
    setSelectedSSOProvider(provider);
    setStep('sso-terms');
  };

  const handleSSOTermsAgree = async () => {
    setIsLoading(true);
    try {
      if (onSSOSignUp) {
        await onSSOSignUp(selectedSSOProvider);
      }
      resetAndClose();
    } catch (error) {
      console.error('SSO sign up error:', error);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Sign Up"
      showLogo={false}
    >
      {step === 'sso' ? (
        /* SSO Options Screen */
        <div className="flex flex-col gap-6">
          {/* Salesforce Button */}
          <button
            onClick={() => handleSSOClick('salesforce')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
            style={{ letterSpacing: '-0.02em' }}
          >
            Salesforce
          </button>
          
          {/* Google Button */}
          <button
            onClick={() => handleSSOClick('google')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
            style={{ letterSpacing: '-0.02em' }}
          >
            Google
          </button>
          
          {/* Github Button */}
          <button
            onClick={() => handleSSOClick('github')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
            style={{ letterSpacing: '-0.02em' }}
          >
            Github
          </button>
          
          {/* SAML Button */}
          <button
            onClick={() => handleSSOClick('saml')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
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
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
            style={{ letterSpacing: '-0.02em' }}
          >
            Use Email
          </button>
        </div>
      ) : step === 'sso-terms' ? (
        /* SSO Terms Acceptance Screen */
        <div className="flex flex-col gap-6">
          {/* Terms Content - No inner scrollbar */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Single Sign-On Terms and Conditions
            </h3>
            <div className="text-sm text-slate-700 space-y-3">
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
              className="w-full px-8 py-3 bg-blue-600 text-white rounded text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <form onSubmit={handleEmailSignUp} className="flex flex-col gap-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            disabled={isLoading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            disabled={isLoading}
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!email.trim() || !password.trim() || !confirmPassword.trim() || isLoading}
            className="w-full px-8 py-2 bg-blue-600 text-white rounded text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
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
      <p className="text-[15px] text-center font-roboto text-[#020618] mt-6" style={{ letterSpacing: '-0.02em' }}>
        By Signing Up you agree to Copado's{' '}
        <a href="#" className="text-blue-600 hover:underline">Terms</a>
        {' & '}
        <a href="#" className="text-blue-600 hover:underline">Privacy</a>
      </p>
    </Modal>
  );
};

export default SignUpModal;
