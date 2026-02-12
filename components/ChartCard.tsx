
import React from 'react';

interface ChartCardProps {
  title: string;
  legend?: { label: string; color: string }[];
  xAxisLabels: string[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, legend, xAxisLabels }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col h-[380px] hover:border-gray-300 transition-all shadow-sm">
      <h3 className="text-gray-900 font-bold text-base mb-6 tracking-tight">{title}</h3>
      
      <div className="flex-1 relative flex flex-col">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-10 w-10 flex flex-col justify-between text-[9px] text-gray-400 font-bold pr-1">
          <span>R$ 4</span>
          <span>R$ 3</span>
          <span>R$ 2</span>
          <span>R$ 1</span>
          <span>R$ 0</span>
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 ml-10 mb-10 relative border-l border-b border-gray-100">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="w-full h-px border-t border-dashed border-gray-100"></div>
            <div className="w-full h-px border-t border-dashed border-gray-100"></div>
            <div className="w-full h-px border-t border-dashed border-gray-100"></div>
            <div className="w-full h-px border-t border-dashed border-gray-100"></div>
            <div></div> {/* Bottom line */}
          </div>
          
          {/* SVG for Chart Lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Horizontal line at R$0 */}
            <line 
              x1="0" y1="100%" x2="100%" y2="100%" 
              stroke="#ef4444" strokeWidth="1.5" 
              strokeLinecap="round"
              className="opacity-20"
            />
            {/* Dots on the line matching the reference image style */}
            {xAxisLabels.map((_, i) => (
              <circle 
                key={i} 
                cx={`${(i / (xAxisLabels.length - 1)) * 100}%`} 
                cy="100%" 
                r="2" 
                fill="#ef4444" 
                className="opacity-30"
              />
            ))}
          </svg>
        </div>
        
        {/* X Axis Labels */}
        <div className="absolute bottom-2 left-10 right-0 flex justify-between text-[8px] text-gray-400 font-bold px-0.5">
          {xAxisLabels.map((label, idx) => (
            <span key={idx} className="transform -rotate-0 truncate">{label}</span>
          ))}
        </div>
      </div>

      {/* Legend Footer */}
      {legend && (
        <div className="flex items-center justify-center gap-6 mt-2">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className="w-2 h-1 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
