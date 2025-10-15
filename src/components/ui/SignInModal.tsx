import React, { useState } from 'react';
import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from './index';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  className?: string;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  onForgotPassword,
  className = "",
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setIsLoading(true);
    try {
      if (onSignIn) {
        await onSignIn(email, password);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    }
    onClose();
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In"
      className={className}
      contentClassName="max-w-md"
    >
      <form onSubmit={handleSignIn} className="flex flex-col gap-6">
        {/* Body text section */}
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="text-sm font-medium text-left text-slate-600 w-full">
            Sign in to your Copado account to continue.
          </p>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-copado-blue focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-copado-blue focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-copado-blue hover:text-copado-dark transition-colors"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>
        
        {/* Buttons section */}
        <div className="flex flex-col gap-3">
          <PrimaryButton
            type="submit"
            disabled={!email.trim() || !password.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </PrimaryButton>
          
          <SecondaryButton
            type="button"
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full"
          >
            Create Account
          </SecondaryButton>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default SignInModal;
