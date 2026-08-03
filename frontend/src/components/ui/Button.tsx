import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center overflow-hidden rounded-xl font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-indigo-400/20',
    secondary: 'glass text-slate-100 hover:bg-white/10 focus:ring-slate-400 border border-white/10',
    outline: 'border-2 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 focus:ring-indigo-500',
    danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-400 hover:to-red-400 focus:ring-rose-500 shadow-lg shadow-rose-500/25 border border-rose-400/20',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5 focus:ring-slate-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed transform-none shadow-none hover:shadow-none' : 'hover:-translate-y-0.5 active:translate-y-0';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="button-shine" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center justify-center">
        {loading && <Spinner size="sm" className="mr-2" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default Button;
