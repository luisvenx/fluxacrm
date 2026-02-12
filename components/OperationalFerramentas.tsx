
import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  ChevronDown, 
  DollarSign, 
  CheckCircle2, 
  Clock,
  Building2,
  Tag
} from 'lucide-react';

const OperationalFerramentas: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [costCenterFilter, setCostCenterFilter] = useState('Todos os centros');
  const [periodFilter, setPeriodFilter] = useState('Todas');

  const metrics = [
    { label: 'Ferramentas Ativas', value: '0', icon: <Wrench size={18} />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Custo Mensal (Ref)', value: 'R$ 0,00', sub: 'Valor de referência', icon: <DollarSign size={18} />, color: 'text-gray-400', bgColor: 'bg-gray-50' },
    { label: 'Total Pago', value: 'R$ 0,00', icon: <CheckCircle2 size={18} />, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Total Pendente', value: 'R$ 0,00', icon: <Clock size={18} />, color: 'text-orange-400', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Ferramentas & Assinaturas</h2>
          <p className="text-sm text-gray-400 font-medium">Gerencie seus custos recorrentes</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Nova ferramenta
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-start justify-between group hover:border-gray-200 transition-all">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
              <p className={`text-2xl font-bold ${m.color === 'text-gray-400' ? 'text-[#1e293b]' : m.color}`}>{m.value}</p>
              {m.sub && <p className="text-[10px] text-gray-400 font-medium">{m.sub}</p>}
            </div>
            <div className={`w-10 h-10 ${m.bgColor} ${m.color} rounded-xl flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative group">
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl py-2 px-6 text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[120px]"
          >
            <option>Todas</option>
            <option>Ativas</option>
            <option>Inativas</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <select 
            value={costCenterFilter}
            onChange={(e) => setCostCenterFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl py-2 px-6 text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[180px]"
          >
            <option>Todos os centros</option>
            <option>Operacional</option>
            <option>Marketing</option>
            <option>Administrativo</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </div>

        <div className="relative group">
          <select 
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl py-2 px-6 text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[120px]"
          >
            <option>Todas</option>
            <option>Mensal</option>
            <option>Anual</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="bg-white border border-gray-100 rounded-3xl min-h-[500px] flex flex-col items-center justify-center p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-400 italic">Nenhuma ferramenta cadastrada</p>
      </div>

    </div>
  );
};

export default OperationalFerramentas;
