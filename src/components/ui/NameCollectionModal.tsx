import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

interface NameCollectionModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  onBack?: () => void;
}

const NameCollectionModal: React.FC<NameCollectionModalProps> = ({
  isOpen,
  onSubmit,
  onBack,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  const handleSkip = () => {
    onSubmit(''); // Submit empty name to skip
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-12">
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
            Let's Go!
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-slate-600 text-center mb-8">
            What's Your Name?
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              autoFocus
            />

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full px-8 py-3 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip for now
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NameCollectionModal;
