import React from 'react';

interface InvoiceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

export const InvoiceInput = ({ label, error, ...props }: InvoiceInputProps) => {
  return (
    <div>
      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${error ? 'text-red-600' : 'text-gray-500'}`}>
        {label}
      </label>
      <input
        {...props}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
          error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-gray-300 focus:border-black'
        } ${props.className || ''}`}
      />
    </div>
  );
};
