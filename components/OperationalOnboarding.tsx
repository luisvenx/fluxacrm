
import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  ChevronDown 
} from 'lucide-react';

const OperationalOnboarding: React.FC = () => {
  const stats = [
    { label: 'Total Ativos', value: '0', icon: <Rocket size={20} />, color: 'text-blue-600', borderColor: 'border-blue-100' },
    { label: 'No Prazo', value: '0', icon: <CheckCircle2 size={20} />, color: 'text-emerald-500', borderColor: 'border-emerald-100' },
    { label: 'Em Risco', value: '0', icon: <AlertTriangle size={20} />, color: 'text-orange-500', borderColor: 'border-orange-100' },
    { label: 'Atrasados', value: '0', icon: <XCircle size={20} />, color: 'text-red-500', borderColor: 'border-red-100' },
  ];

  const columns = [
    { id: 'venda', label: 'Venda concluída', dotColor: 'bg-indigo-600', bgColor: 'bg-indigo-50/50', count: 0 },
    { id: 'doc', label: 'Documentação inicial', dotColor: 'bg-purple-600', bgColor: 'bg-purple-50/50', count: 0 },
    { id: 'kickoff', label: 'Kickoff agendado', dotColor: 'bg-violet-600', bgColor: 'bg-violet-50/50', count: 0 },
    { id: 'setup', label: 'Setup em andamento', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50/50', count: 0 },
    { id: 'entrega', label: 'Primeira entrega', dotColor: 'bg-blue-500', bgColor: 'bg-blue-50/50', count: 0 },
    { id: 'ajustes', label: 'Ajustes', dotColor: 'bg-pink-500', bgColor: 'bg-pink-50/50', count: 0 },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
          <Rocket size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">On-Boarding</h2>
          <p className="text-sm text-gray-400 font-medium">Gerencie a passagem de bastão entre vendas e execução</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-gray-200 transition-all">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-transparent">
        <div className="flex items-center gap-2 text-gray-400 mr-2">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Filtros</span>
        </div>
        
        {['Todos Status', 'Todas...', 'Todas Fases', 'Todos Clientes', 'Todos Produtos', 'Todos'].map((filter, i) => (
          <div key={i} className="relative">
            <select className="bg-white border border-gray-100 rounded-xl py-2 pl-4 pr-10 text-[11px] font-bold text-gray-600 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[130px]">
              <option>{filter}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto no-scrollbar pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((col) => (
            <div key={col.id} className="w-[280px] flex flex-col gap-3">
              {/* Column Header */}
              <div className={`${col.bgColor} border border-gray-100/50 rounded-xl p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></div>
                  <span className="text-[13px] font-bold text-gray-700">{col.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-400">{col.count}</span>
              </div>

              {/* Column Content */}
              <div className="flex-1 bg-white/40 border border-gray-100/50 rounded-2xl p-4 min-h-[400px] flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-medium text-gray-300 italic">Nenhum on-boarding</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OperationalOnboarding;
