import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`flex justify-center items-center flex-grow relative gap-1 px-6 py-2 rounded bg-copado-blue text-white shadow-sm hover:bg-indigo-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-copado-blue disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white">
        {children}
      </span>
    </button>
  );
};

export default PrimaryButton;
