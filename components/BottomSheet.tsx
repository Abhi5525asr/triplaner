
import React, { useEffect, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        onTransitionEnd={handleAnimationEnd}
        className={`
          relative w-full max-w-md bg-white rounded-t-[32px] overflow-hidden transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[90vh] flex flex-col
        `}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2" />
        
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#282C3F] tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1 bg-gray-100 rounded-full text-gray-400">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-8 px-6">
          {children}
        </div>
      </div>
    </div>
  );
};
