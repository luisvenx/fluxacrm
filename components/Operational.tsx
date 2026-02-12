
import React from 'react';
import { ClipboardList, CheckSquare, ListTodo, Activity, Play } from 'lucide-react';

const Operational: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestão Operacional</h2>
          <p className="text-sm font-medium text-gray-400">Acompanhamento de processos e entregas</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
          <Activity size={14} className="animate-pulse" /> Operação Saudável
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><ListTodo size={20} className="text-blue-600" /> Atividades Críticas</h3>
           <div className="space-y-4">
              {[
                { task: 'Conciliação Bancária Semanal', due: 'Hoje', priority: 'Alta' },
                { task: 'Backup de Notas Fiscais', due: 'Amanhã', priority: 'Média' },
                { task: 'Envio de Pro labore', due: '20/05', priority: 'Alta' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl hover:border-blue-100 transition-all">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                     <span className="text-sm font-bold text-gray-700">{item.task}</span>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase text-gray-400">{item.due}</p>
                     <span className={`text-[9px] font-black uppercase ${item.priority === 'Alta' ? 'text-red-500' : 'text-yellow-500'}`}>{item.priority}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-8 text-white space-y-6 shadow-xl">
           <h3 className="text-lg font-bold">Resumo da Logística</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                 <p className="text-3xl font-black mb-1">12</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Em Trânsito</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                 <p className="text-3xl font-black mb-1">45</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Finalizadas</p>
              </div>
           </div>
           <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2">
             <Play size={14} fill="white" /> Iniciar Novo Fluxo
           </button>
        </div>
      </div>
    </div>
  );
};

export default Operational;
