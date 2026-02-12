
import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  ChevronDown,
  FileSearch
} from 'lucide-react';

const OperationalContratos: React.FC = () => {
  const [filter, setFilter] = useState('Todos');

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Contratos</h2>
            <p className="text-sm text-gray-400 font-medium">Gerencie contratos e valores recorrentes</p>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Novo Contrato
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="max-w-[120px]">
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2 px-4 text-xs appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-bold"
            >
              <option>Todos</option>
              <option>Ativos</option>
              <option>Encerrados</option>
              <option>Pausados</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="flex-1 min-h-[500px] bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center p-12 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
          <FileSearch size={32} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1e293b]">Nenhum contrato encontrado</h3>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">
            Crie um novo contrato para começar
          </p>
        </div>
      </div>

    </div>
  );
};

export default OperationalContratos;
