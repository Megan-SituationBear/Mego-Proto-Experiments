import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  initialTitle?: string;
}

const SaveModal = ({ isOpen, onClose, onSave, initialTitle = '' }: SaveModalProps) => {
  const [title, setTitle] = useState(initialTitle);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle); // Reset to initial title
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all w-full max-w-lg">
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-4 border-b border-slate-200">
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Save Workspace
              </DialogTitle>
              <p className="mt-2 text-sm text-slate-600">
                Give this workspace a name so you can find it later
              </p>
            </div>

            {/* Content */}
            <div className="bg-white px-6 py-6">
              <div className="space-y-2">
                <label htmlFor="workspace-title" className="block text-sm font-medium text-slate-700">
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="workspace-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                  placeholder="Enter workspace name..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveModal;

