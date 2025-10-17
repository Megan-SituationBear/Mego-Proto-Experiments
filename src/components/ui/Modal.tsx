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
      className={`fixed inset-0 flex items-center justify-center z-50 ${overlayClassName}`}
      style={{ backgroundColor: '#8E9BAD' }}
      onClick={handleOverlayClick}
    >
      <div className="relative flex flex-col items-center">
        {/* Header section with logo, text, and X */}
        {showLogo && (
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 relative w-full max-w-[400px] px-4">
            {/* Logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" className="sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* COPADO AI text */}
            <h1 className="text-base sm:text-xl font-bold tracking-[0.2em] text-white">COPADO AI</h1>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="ml-auto w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                className="sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Modal content card */}
        <div 
          ref={modalRef}
          className={`flex flex-col w-full max-w-[400px] gap-4 sm:gap-6 px-6 py-6 sm:px-10 sm:py-8 rounded-xl bg-white shadow-2xl mx-4 sm:mx-6 max-h-[calc(100vh-120px)] overflow-y-auto ${contentClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title section */}
          {title && (
            <h2 className="text-2xl sm:text-[28px] font-roboto font-semibold text-center text-slate-950" style={{ letterSpacing: '-0.03em' }}>
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
