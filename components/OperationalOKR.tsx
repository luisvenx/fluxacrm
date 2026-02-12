
import React, { useState } from 'react';
import { 
  CircleDot, 
  Plus, 
  Target, 
  KeyRound, 
  TrendingUp, 
  AlertTriangle,
  Building2,
  Calendar,
  ChevronDown
} from 'lucide-react';

const OperationalOKR: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('Todos os tipos');
  const [statusFilter, setStatusFilter] = useState('Ativo');
  const [periodFilter, setPeriodFilter] = useState('Todos os períodos');

  const metrics = [
    { label: 'Objetivos', value: '0', icon: <Target size={20} />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Key Results', value: '0', icon: <KeyRound size={20} />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Progresso Médio', value: '0%', icon: <TrendingUp size={20} />, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Em Risco', value: '0', icon: <AlertTriangle size={20} />, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
            <CircleDot size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">OKR – Objectives & Key Results</h2>
            <p className="text-sm text-gray-400 font-medium">Defina objetivos ambiciosos e acompanhe resultados-chave</p>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Novo Objetivo
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-gray-200 transition-all group">
            <div className={`w-12 h-12 ${m.bgColor} ${m.color} rounded-xl flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
              {m.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
              <p className="text-3xl font-bold text-[#1e293b]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Building2 size={16} />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-10 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[160px]"
          >
            <option>Todos os tipos</option>
            <option>Empresa</option>
            <option>Squad</option>
            <option>Individual</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl py-2.5 px-6 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[120px]"
          >
            <option>Ativo</option>
            <option>Finalizado</option>
            <option>Pausado</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Calendar size={16} />
          </div>
          <select 
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-10 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[180px]"
          >
            <option>Todos os períodos</option>
            <option>Q1 - 2026</option>
            <option>Q2 - 2026</option>
            <option>Q3 - 2026</option>
            <option>Q4 - 2026</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-8">
          <CircleDot size={48} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1e293b]">Nenhum objetivo encontrado</h3>
          <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto">
            Crie seu primeiro objetivo para começar a acompanhar seus OKRs
          </p>
        </div>
      </div>

    </div>
  );
};

export default OperationalOKR;
