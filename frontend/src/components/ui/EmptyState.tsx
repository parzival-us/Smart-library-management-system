import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center animate-fade-in ${className}`}>
      <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-indigo-400 mb-6 border border-white/5 shadow-inner">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-8">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
