
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown,
  Search,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import NewClientModal from './NewClientModal';

const OperationalClientes: React.FC = () => {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  
  const clients = [
    { id: 1, name: 'SIRIUS TECNOLOGIA', segment: 'Software/SaaS', mrr: 'R$ 15.000,00', status: 'Ativo', health: 'Saudável' },
    { id: 2, name: 'GRUPO OMNI', segment: 'Varejo', mrr: 'R$ 8.500,00', status: 'Ativo', health: 'Atencão' },
    { id: 3, name: 'LOGIC LOGÍSTICA', segment: 'Transporte', mrr: 'R$ 4.200,00', status: 'Inativo', health: 'Churn' },
    { id: 4, name: 'AGÊNCIA MATRIX', segment: 'Marketing', mrr: 'R$ 12.000,00', status: 'Ativo', health: 'Saudável' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Portfólio de Clientes</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Base consolidada e recorrência</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewClientModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#002147] text-white rounded text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between group hover:border-blue-400 transition-all">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Ativos</p>
               <p className="text-2xl font-black text-slate-900">42 Contas</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center"><ShieldCheck size={20}/></div>
         </div>
         <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between group hover:border-emerald-400 transition-all">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MRR Total</p>
               <p className="text-2xl font-black text-slate-900">R$ 184.200,00</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded flex items-center justify-center"><CreditCard size={20}/></div>
         </div>
         <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between group hover:border-orange-400 transition-all">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa de Churn</p>
               <p className="text-2xl font-black text-slate-900">2.1% (30d)</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded flex items-center justify-center">📉</div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
           <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="PESQUISAR CLIENTE..." className="w-full bg-white border border-slate-200 rounded py-2 pl-9 pr-4 text-[10px] font-black uppercase focus:outline-none" />
           </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Segmento</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">MRR (Ref)</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Saúde</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4">
                   <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">{client.name}</span>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                        {client.status} <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      </span>
                   </div>
                </td>
                <td className="px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">{client.segment}</td>
                <td className="px-8 py-4 text-[12px] font-black text-slate-900 text-right tracking-tighter">{client.mrr}</td>
                <td className="px-8 py-4 text-center">
                   <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                     client.health === 'Saudável' ? 'bg-emerald-50 text-emerald-600' : 
                     client.health === 'Atencão' ? 'bg-orange-50 text-orange-600' : 
                     'bg-red-50 text-red-600'
                   }`}>
                     {client.health}
                   </span>
                </td>
                <td className="px-8 py-4 text-right">
                   <button className="p-1.5 text-slate-300 hover:text-[#002147] transition-colors"><ExternalLink size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewClientModal isOpen={isNewClientModalOpen} onClose={() => setIsNewClientModalOpen(false)} />
    </div>
  );
};

export default OperationalClientes;
