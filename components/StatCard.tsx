
import React from 'react';
import { Info } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
  color: 'green' | 'red' | 'emerald' | 'blue';
  showInfo?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, showInfo }) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-500 border-emerald-100',
    red: 'bg-rose-50 text-rose-400 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-500 border-emerald-100',
    blue: 'bg-blue-50 text-blue-500 border-blue-100'
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 hover:shadow-sm transition-all group shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`p-1.5 rounded-lg border transition-transform ${colorMap[color]}`}>
          {icon && React.cloneElement(icon as React.ReactElement, { size: 14 })}
        </div>
      </div>
      <div className="space-y-0.5">
        <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">{value}</h3>
        <div className="flex items-center gap-1">
          <p className="text-[10px] font-medium text-slate-400">{subtitle}</p>
          {showInfo && <Info size={10} className="text-slate-300" />}
        </div>
      </div>
      {/* Background decoration */}
      <div className={`absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.03] group-hover:scale-110 transition-transform ${colorMap[color].split(' ')[1]}`}>
        {icon && React.cloneElement(icon as React.ReactElement, { size: 64 })}
      </div>
    </div>
  );
};

export default StatCard;
