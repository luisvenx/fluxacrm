
import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const RecentEntries: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Entradas', 'Saídas', 'Pendentes'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[500px] shadow-sm group transition-all overflow-hidden">
      <div className="p-8 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
        <div>
          <h3 className="text-slate-900 font-bold text-base tracking-tight uppercase italic">Movimentações <span className="text-[#01223d] not-italic">Recentes</span></h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Journal Operacional SQL</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#01223d] text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/10 relative overflow-hidden">
          <div className="space-y-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Aguardando novos registros no ledger...</p>
          </div>
          <div className="absolute inset-0 bg-slate-50/5 pointer-events-none"></div>
      </div>

      <div className="p-6 border-t border-slate-50 bg-white">
        <button className="flex items-center gap-2 text-[#01223d] text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all group/btn">
          Ver Auditoria Completa <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-[#b4a183]" />
        </button>
      </div>
    </div>
  );
};

export default RecentEntries;
