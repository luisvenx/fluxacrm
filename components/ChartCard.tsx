
import React from 'react';
// Import Calendar from lucide-react to fix the "Cannot find name 'Calendar'" error.
import { Calendar } from 'lucide-react';

interface ChartCardProps {
  title: string;
  legend?: { label: string; color: string }[];
  xAxisLabels: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, legend, xAxisLabels }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col h-[450px] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-slate-900 font-semibold text-base">{title}</h3>
        <button className="text-slate-300 hover:text-slate-900 transition-colors">
          <Calendar size={18} />
        </button>
      </div>
      
      <div className="flex-1 relative flex flex-col">
        {/* Simplified Y Axis */}
        <div className="absolute left-0 top-0 bottom-10 w-10 flex flex-col justify-between text-[10px] text-slate-300 font-bold">
          <span>150k</span>
          <span>100k</span>
          <span>50k</span>
          <span>0</span>
        </div>
        
        {/* Minimalist Grid & Chart */}
        <div className="flex-1 ml-12 mb-10 relative">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full border-t border-slate-50"></div>
            ))}
          </div>
          
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,120 50,80 100,100 150,30 200,60 250,10 300,40"
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeDasharray="6 6"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,150 50,140 100,130 150,120 200,110 250,100 300,90"
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
          </svg>
        </div>
        
        {/* Clean X Axis */}
        <div className="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-slate-300 font-bold">
          {xAxisLabels.map((label, idx) => (
            <span key={idx}>{label}</span>
          ))}
        </div>
      </div>

      {legend && (
        <div className="flex items-center justify-start gap-6 mt-6 pt-6 border-t border-slate-50">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
