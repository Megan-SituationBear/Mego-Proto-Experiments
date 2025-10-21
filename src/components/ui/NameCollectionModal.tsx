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
        <DialogPanel 
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <div className="p-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              What should we call you?
            </h2>

            {/* Subtitle */}
            <p className="text-slate-700 mb-8 text-center" style={{ fontSize: '14px' }}>
              Help us personalize your Copado experience
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                style={{ fontSize: '14px' }}
                required
                autoFocus
              />

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.01em' }}
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
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NameCollectionModal;
