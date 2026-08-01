import React, { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  status?: string;
  className?: string;
}

const statusMap: Record<string, BadgeVariant> = {
  ACTIVE: 'info',
  RETURNED: 'success',
  OVERDUE: 'danger',
  AVAILABLE: 'success',
  BORROWED: 'warning',
  PENDING: 'warning',
  PAID: 'success',
  UNPAID: 'danger',
  ADMIN: 'primary',
  LIBRARIAN: 'info',
  STUDENT: 'neutral',
};

const Badge: React.FC<BadgeProps> = ({ children, variant, status, className = '' }) => {
  const activeVariant = variant || (status ? statusMap[status.toUpperCase()] || 'neutral' : 'neutral');

  const variantClasses = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    neutral: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md ${variantClasses[activeVariant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
