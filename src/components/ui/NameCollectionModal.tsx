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
      setName(''); // Reset for next time
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
          {/* Title */}
          <h2 
            className="text-2xl sm:text-[28px] font-roboto font-semibold text-center text-slate-950 mb-2" 
            style={{ letterSpacing: '-0.03em' }}
          >
            What should we call you?
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 text-center mb-8">
            Help us personalize your Copado experience
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded border border-[#62748e] bg-[#f8fafc] text-[15px] font-roboto placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full px-8 py-3 bg-blue-600 text-white rounded text-[15px] font-roboto font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Back
              </button>
            )}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NameCollectionModal;
