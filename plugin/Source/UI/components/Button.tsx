import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, disabled = false, className = '', type = 'button' }) => {
  const baseStyle = 'px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 shadow-outer-md';
  const variantStyle = variant === 'primary' 
    ? 'bg-brand text-text_primary hover:bg-opacity-90' 
    : 'bg-panel text-text_secondary hover:bg-opacity-90 border border-gray-700';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
};
