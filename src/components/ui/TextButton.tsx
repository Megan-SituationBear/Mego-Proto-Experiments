import React from 'react';

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({
  children,
  underline = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-copado-blue disabled:opacity-50 disabled:cursor-not-allowed';
  
  const underlineClass = underline ? 'underline underline-offset-2' : '';
  
  const classes = `${baseClasses} ${underlineClass} text-copado-blue hover:text-indigo-600 ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default TextButton;
