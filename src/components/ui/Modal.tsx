import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = "",
  overlayClassName = "",
  contentClassName = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-slate-500/50 backdrop-blur-sm ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      {/* Close button positioned outside the modal */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`bg-white w-full mx-4 relative min-w-[320px] max-w-2xl rounded-xl shadow-xl p-6 ${contentClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title section */}
        {title && (
          <div className="flex flex-col justify-start items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-center capitalize text-[#020618] w-full">
              {title}
            </h2>
          </div>
        )}
        
        {/* Content */}
        <div className={`${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
