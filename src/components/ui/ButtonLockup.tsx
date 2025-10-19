import React from 'react';

interface ButtonLockupProps {
  primaryText: string;
  secondaryText: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const ButtonLockup: React.FC<ButtonLockupProps> = ({
  primaryText,
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
  primaryDisabled = false,
  secondaryDisabled = false,
  orientation = 'horizontal',
  className = '',
}) => {
  const containerClasses = orientation === 'horizontal' 
    ? 'flex flex-row gap-3 items-center' 
    : 'flex flex-col gap-3 w-full';

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Primary Button */}
      <button
        onClick={onPrimaryClick}
        disabled={primaryDisabled}
        className="flex-1 px-6 py-2.5 rounded-lg bg-copado-blue text-white text-sm font-medium shadow-sm hover:bg-indigo-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-copado-blue disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {primaryText}
      </button>
      
      {/* Secondary Button */}
      <button
        onClick={onSecondaryClick}
        disabled={secondaryDisabled}
        className="flex-1 px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {secondaryText}
      </button>
    </div>
  );
};

export default ButtonLockup;
