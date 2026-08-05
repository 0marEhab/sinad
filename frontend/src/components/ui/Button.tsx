import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full bg-brand-primary text-white py-2.5 rounded text-sm font-medium hover:bg-opacity-90 transition-colors ${props.className || ''}`}
    >
      {children}
    </button>
  );
};
