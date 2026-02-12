
import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const RecentEntries: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todos');
  const tabs = ['Todos', 'Entradas', 'Saídas'];

  const dummyData = [
    { id: 1, desc: 'Assinatura SaaS mensal', value: 'R$ 1.240,50', type: 'out', status: 'Pago', date: 'Hoje' },
    { id: 2, desc: 'Faturamento Projeto Alpha', value: 'R$ 15.000,00', type: 'in', status: 'Pendente', date: 'Ontem' }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] flex flex-col h-[450px] shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-slate-900 font-semibold text-lg">Atividade Recente</h3>
          <p className="text-xs text-slate-400 font-medium">Últimos lançamentos registrados</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="divide-y divide-slate-50">
          {dummyData.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-5 px-4 hover:bg-slate-50 transition-all rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${item.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {item.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.desc}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{item.value}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Pago' ? 'text-emerald-500' : 'text-orange-400'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-50">
        <button className="flex items-center justify-center w-full gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
          Acessar Ledger Completo <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RecentEntries;
