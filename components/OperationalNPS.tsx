
import React, { useState } from 'react';
import { 
  Star, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  BarChart, 
  Building2, 
  FileText 
} from 'lucide-react';

const OperationalNPS: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'Clientes' | 'Equipe'>('Clientes');
  const [activeView, setActiveView] = useState<'Cohort' | 'Cliente' | 'Pesquisas'>('Cohort');

  const metrics = [
    { label: 'NPS Geral', value: '0', sub: '0 promotores, 0 detratores', icon: <TrendingUp size={16} /> },
    { label: 'Taxa de Resposta', value: '0%', sub: '0 de 0 pesquisas', icon: <MessageSquare size={16} /> },
    { label: 'Média de Notas', value: '0.0', sub: '0 neutros', icon: <Users size={16} /> },
    { label: 'Pendentes', value: '0', sub: '0 expiradas', icon: <Clock size={16} /> },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">NPS – Net Promoter Score</h2>
            <p className="text-sm text-gray-400 font-medium">Acompanhe a satisfação dos clientes e da equipe</p>
          </div>

          {/* Top Tabs (Clientes / Equipe) */}
          <div className="inline-flex p-1 bg-gray-100/50 rounded-xl border border-gray-100">
            <button 
              onClick={() => setActiveSegment('Clientes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSegment === 'Clientes' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Building2 size={14} />
              Clientes
            </button>
            <button 
              onClick={() => setActiveSegment('Equipe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSegment === 'Equipe' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Users size={14} />
              Equipe (eNPS)
            </button>
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Settings size={18} className="text-gray-400" />
            Configurações
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
            <Plus size={20} />
            Nova Pesquisa
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-32 hover:border-blue-500/20 transition-all group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{m.label}</span>
              <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                {m.icon}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-3xl font-bold text-[#1e293b]">{m.value}</p>
              <p className="text-[11px] text-gray-400 font-medium">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-tabs (Cohort / Cliente / Pesquisas) */}
      <div className="flex items-center gap-2 bg-gray-100/30 p-1 rounded-xl w-fit border border-gray-50">
        <button 
          onClick={() => setActiveView('Cohort')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'Cohort' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <BarChart size={14} />
          Cohort Mensal
        </button>
        <button 
          onClick={() => setActiveView('Cliente')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'Cliente' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Building2 size={14} />
          Por Cliente
        </button>
        <button 
          onClick={() => setActiveView('Pesquisas')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'Pesquisas' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FileText size={14} />
          Pesquisas
        </button>
      </div>

      {/* Main Chart Card Area */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm min-h-[500px] flex flex-col p-8 overflow-hidden">
        <h3 className="text-xl font-bold text-[#1e293b] mb-6">NPS por Mês</h3>
        
        <div className="flex-1 flex items-center justify-center text-center p-12">
          <p className="text-sm font-medium text-gray-400 italic">Nenhum dado disponível</p>
        </div>
      </div>

    </div>
  );
};

export default OperationalNPS;
