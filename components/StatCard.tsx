
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
  color: 'green' | 'red' | 'emerald' | 'blue';
  info?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, info }) => {
  const colorMap = {
    green: 'text-green-600 bg-green-50 dark:bg-green-900/10 dark:text-green-400',
    red: 'text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400'
  };

  const iconBorderMap = {
    green: 'border-green-100 dark:border-green-800/30',
    red: 'border-red-100 dark:border-red-800/30',
    emerald: 'border-emerald-100 dark:border-emerald-800/30',
    blue: 'border-blue-100 dark:border-blue-800/30'
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#1e293b] rounded-xl p-5 hover:border-gray-300 dark:hover:border-[#334155] transition-all group relative overflow-hidden h-32 flex flex-col justify-center shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
             <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">{title}</p>
             {info && <span className="text-gray-300 dark:text-gray-600 hover:text-gray-500 cursor-pointer">{info}</span>}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight mt-1">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg border ${iconBorderMap[color]} ${colorMap[color]} transition-transform group-hover:scale-105 shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
