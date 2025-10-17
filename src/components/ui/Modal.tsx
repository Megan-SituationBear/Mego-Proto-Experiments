import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showLogo?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showLogo = true,
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
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-slate-500/80 backdrop-blur-sm ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Logo and COPADO AI text - Outside the modal */}
        {showLogo && (
          <div className="flex flex-col items-center gap-3 mb-4">
            {/* Copado Logo */}
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-white">COPADO AI</h1>
          </div>
        )}

        {/* Close button - X positioned to the right */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 w-8 h-8 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Modal content card */}
        <div 
          ref={modalRef}
          className={`flex flex-col items-center w-full max-w-[400px] gap-6 p-8 rounded-2xl bg-white shadow-2xl mx-6 ${contentClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title section */}
          {title && (
            <h2 className="text-[28px] font-roboto font-semibold text-center text-slate-950" style={{ letterSpacing: '-0.03em' }}>
              {title}
            </h2>
          )}
          
          {/* Content */}
          <div className={`flex flex-col w-full ${className}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
