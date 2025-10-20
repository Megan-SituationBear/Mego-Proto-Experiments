import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`flex justify-center items-center flex-grow relative gap-2 px-6 py-2 rounded-lg bg-white border border-[#90A1B9] shadow-sm hover:bg-slate-100 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      {...props}
    >
      <p className="flex-grow-0 flex-shrink-0 text-[15px] font-medium text-center capitalize text-gray-600">
        {children}
      </p>
    </button>
  );
};

export default SecondaryButton;
