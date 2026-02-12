
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const RecentEntries: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Entradas', 'Saídas', 'Pendentes'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col h-[340px] hover:border-gray-300 transition-all overflow-hidden shadow-sm">
      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-bold text-lg">Lançamentos Recentes</h3>
          <p className="text-xs text-gray-400 font-medium">Últimas movimentações financeiras</p>
        </div>
        
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-t border-gray-50">
        <span className="text-sm font-medium text-gray-300 uppercase tracking-widest font-black">Nenhum lançamento encontrado</span>
      </div>

      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <button className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:gap-3 transition-all uppercase tracking-widest">
          Ver todos os lançamentos <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RecentEntries;
