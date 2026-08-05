import React from 'react';

interface InvoiceCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const InvoiceCard = ({ title, children, className = '' }: InvoiceCardProps) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
      {title && (
        <>
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <hr className="border-gray-100 mb-6" />
        </>
      )}
      {children}
    </div>
  );
};
