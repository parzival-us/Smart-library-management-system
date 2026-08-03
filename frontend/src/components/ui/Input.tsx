import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-slate-950/65 border rounded-xl py-2.5 px-4
              text-slate-100 placeholder-slate-500
              transition-all duration-300 outline-none backdrop-blur-sm
              ${icon ? 'pl-10' : ''}
              ${error 
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                : 'border-white/10 hover:border-white/20 input-glow'
              }
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-rose-400 animate-fade-in flex items-center">
            <span className="w-1 h-1 rounded-full bg-rose-400 mr-1.5"></span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
