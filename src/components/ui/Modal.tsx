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
      className={`fixed inset-0 flex items-center justify-center z-50 bg-[#45556C] ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`flex flex-col justify-start items-center w-full max-w-[436px] h-[400px] overflow-hidden gap-6 p-6 rounded-xl bg-white shadow-xl mx-6 max-h-[calc(100vh-48px)] md:w-[436px] md:mx-0 md:max-h-none ${contentClassName}`}
        style={{ boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - X icon positioned in top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600"
          >
            <path
              d="M8 6.223L13.223 1L14 1.778L8.777 7L14 12.223L13.223 13L8 7.778L2.777 13L2 12.223L7.223 7L2 1.778L2.777 1L8 6.223Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Title section */}
        {title && (
          <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-3">
            <h2 className="self-stretch flex-grow-0 flex-shrink-0 w-full text-2xl font-semibold text-center capitalize text-slate-950 font-roboto tracking-header">
              {title}
            </h2>
          </div>
        )}
        
        {/* Content */}
        <div className={`flex flex-col justify-start items-start self-stretch flex-grow relative ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
