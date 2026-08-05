import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const InputField = ({ label, icon, ...props }: InputFieldProps) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-[#050A22] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full ${icon ? 'ps-10' : 'ps-3'} pe-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#050A22] focus:ring-1 focus:ring-[#050A22] ${props.className || ''}`}
        />
      </div>
    </div>
  );
};
