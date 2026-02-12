
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
  color: 'green' | 'red' | 'emerald' | 'blue';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all group shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`p-2.5 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          {icon && React.cloneElement(icon as React.ReactElement, { size: 18 })}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-xs font-medium text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;
