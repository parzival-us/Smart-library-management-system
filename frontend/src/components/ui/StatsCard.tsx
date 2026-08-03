import React, { ReactNode } from 'react';
import Card from './Card';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, className = '' }) => {
  return (
    <Card hoverable padding="md" className={`overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold tracking-[-0.035em] text-slate-50">{value}</h3>
          
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        
        <div className="rounded-xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 p-3 text-indigo-300 shadow-inner">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
