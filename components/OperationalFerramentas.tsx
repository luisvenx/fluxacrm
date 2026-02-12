
import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  ChevronDown, 
  DollarSign, 
  CheckCircle2, 
  Clock,
  Building2,
  Tag,
  Search,
  Filter,
  MoreVertical,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Zap
} from 'lucide-react';
import NewToolModal from './NewToolModal';

const OperationalFerramentas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);

  const metrics = [
    { label: 'Assinaturas Ativas', value: '14', trend: '+1 este mês', icon: <Layers size={18} />, color: 'text-blue-600' },
    { label: 'Burn Rate (SaaS)', value: 'R$ 8.420,00', trend: 'Mensal', icon: <DollarSign size={18} />, color: 'text-slate-900' },
    { label: 'Próximas Renovações', value: '03', trend: 'Próx. 7 dias', icon: <Clock size={18} />, color: 'text-amber-500' },
    { label: 'Otimização de Custos', value: '12%', trend: 'Savings Q1', icon: <Zap size={18} />, color: 'text-emerald-500' },
  ];

  const tools = [
    { id: 1, name: 'OpenAI API', provider: 'OpenAI', category: 'IA/Dev', value: 'R$ 1.250,00', nextBilling: 'Dia 15', status: 'Ativo', costCenter: 'Operacional' },
    { id: 2, name: 'Slack Pro', provider: 'Salesforce', category: 'Comunicação', value: 'R$ 450,00', nextBilling: 'Dia 02', status: 'Ativo', costCenter: 'Administrativo' },
    { id: 3, name: 'Google Workspace', provider: 'Google', category: 'Produtividade', value: 'R$ 890,00', nextBilling: 'Dia 10', status: 'Ativo', costCenter: 'Todos' },
    { id: 4, name: 'Adobe Creative Cloud', provider: 'Adobe', category: 'Design', value: 'R$ 320,00', nextBilling: 'Dia 22', status: 'Inativo', costCenter: 'Marketing' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Tech Stack & Subscriptions</h2>
            <p className="text-slate-500 font-medium mt-1">Gestão centralizada de ferramentas, licenças e custos recorrentes.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewToolModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Nova Ferramenta
        </button>
      </div>

      {/* Subscription Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                {m.icon}
              </div>
            </div>
            <h3 className={`text-2xl font-bold tracking-tight ${m.color}`}>{m.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{m.trend}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="relative flex-1 lg:max-w-md ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por ferramenta, fornecedor ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 pr-2">
           <div className="relative">
              <select className="bg-slate-50 border-none rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[160px] tracking-widest">
                <option>Todas as Categorias</option>
                <option>IA/Dev</option>
                <option>Marketing</option>
                <option>Comunicação</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
           </div>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all"><Filter size={18}/></button>
        </div>
      </div>

      {/* Tools Inventory Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ferramenta & Fornecedor</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Centro de Custo</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor Mensal</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Cobrança</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform ${tool.status === 'Ativo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {tool.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">{tool.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{tool.category} • {tool.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-wider border border-slate-100">
                      {tool.costCenter}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">{tool.value}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">recorrência</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold text-slate-700">{tool.nextBilling}</span>
                       <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${tool.status === 'Ativo' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Total stack: 14 apps</p>
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest flex items-center gap-2">
            Ver stack completa <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <NewToolModal isOpen={isNewToolModalOpen} onClose={() => setIsNewToolModalOpen(false)} />
    </div>
  );
};

export default OperationalFerramentas;
