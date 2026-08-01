import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <h1 className="text-[150px] md:text-[200px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-500/20 to-violet-500/20 select-none animate-pulse-glow">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold text-white shadow-black drop-shadow-xl animate-slide-up">
            Lost in the stacks?
          </span>
        </div>
      </div>
      
      <p className="text-slate-400 max-w-md text-lg mb-8 animate-fade-in stagger-1">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      
      <div className="animate-fade-in stagger-2">
        <Link to="/">
          <Button size="lg" className="px-8">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
