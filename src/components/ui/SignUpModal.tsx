import React, { useState } from 'react';
import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from './index';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (email: string, password: string, confirmPassword: string) => void;
  onSignIn?: () => void;
  className?: string;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  onSignIn,
  className = "",
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign Up"
      className="gap-2"
    >
      <form onSubmit={handleSignUp} className="flex flex-col gap-6 w-full">
        {/* Body text section */}
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="font-inter text-body text-slate-600 w-full">
            Create your Copado account to get started.
          </p>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-copado-blue focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-copado-blue focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>
        
        {/* Buttons section */}
        <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-4">
          <SecondaryButton
            type="button"
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex-1"
          >
            Sign In
          </SecondaryButton>
          
          <PrimaryButton
            type="submit"
            disabled={!email.trim() || !password.trim() || !confirmPassword.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </PrimaryButton>
        </div>

        {/* Additional info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default SignUpModal;
