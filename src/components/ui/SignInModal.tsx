import { useState } from 'react';
import Modal from './Modal';

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
  onSignUp,
  onSSOSignIn,
}) => {
  const [step, setStep] = useState<'sso' | 'email'>('sso');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOClick = async (provider: string) => {
    setIsLoading(true);
    try {
      if (onSSOSignIn) {
        await onSSOSignIn(provider);
      }
      onClose();
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
      onClose();
    } catch (error) {
      console.error('Email sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setStep('sso');
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Login"
      showLogo={true}
      className="gap-8"
    >
      {step === 'sso' ? (
        /* SSO Options View */
        <div className="flex flex-col gap-5 w-full">
          {/* SSO Buttons */}
          <button
            onClick={() => handleSSOClick('salesforce')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Salesforce
          </button>
          
          <button
            onClick={() => handleSSOClick('google')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Google
          </button>
          
          <button
            onClick={() => handleSSOClick('github')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Github
          </button>
          
          <button
            onClick={() => handleSSOClick('saml')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            SAML
          </button>

          {/* OR Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px border-t border-[#cad5e2]"></div>
            <span className="text-[15px] font-roboto text-[#020618]">OR</span>
            <div className="flex-1 h-px border-t border-[#cad5e2]"></div>
          </div>

          {/* Use Email Button */}
          <button
            onClick={() => setStep('email')}
            disabled={isLoading}
            className="w-full px-8 py-2 rounded border border-[#62748e] bg-[#f8fafc] text-[#020618] text-[15px] font-roboto hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Use Email
          </button>
        </div>
      ) : (
        /* Email/Password View */
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-5 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
            disabled={isLoading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
            Back to SSO options
          </button>
        </form>
      )}
      
      {/* Footer Text - Outside form, always visible */}
      <p className="text-[15px] text-center font-roboto text-[#020618] -mt-4" style={{ letterSpacing: '-0.02em' }}>
        By Signing Up you agree to Copado's{' '}
        <a href="#" className="text-blue-600 hover:underline">Terms</a>
        {' & '}
        <a href="#" className="text-blue-600 hover:underline">Privacy</a>
      </p>
    </Modal>
  );
};

export default SignInModal;
