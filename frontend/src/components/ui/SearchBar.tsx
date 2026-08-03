import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
        <FiSearch size={18} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.1] bg-slate-950/65 py-3 pl-11 pr-10 text-slate-100 shadow-lg shadow-black/5 outline-none transition-all placeholder:text-slate-500 backdrop-blur-sm hover:border-white/[0.18] input-glow"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
