import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Dialog = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: DialogProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Prevent body scroll and trigger animation when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow the DOM to render before triggering the transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Dialog Container */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {title ? (
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 z-20 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full p-2 transition-all border border-gray-100 shadow-sm"
          >
            <X size={20} />
          </button>
        )}
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto w-full h-full rounded-b-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};
