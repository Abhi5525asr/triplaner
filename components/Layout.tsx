
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, actions }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      {(title || onBack || actions) && (
        <header className="sticky top-0 z-40 bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1 -ml-1 text-[#282C3F]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
            )}
            {title && <h1 className="text-xl font-extrabold text-[#282C3F] tracking-tight">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </header>
      )}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
};
