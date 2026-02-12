
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown 
} from 'lucide-react';
import NewClientModal from './NewClientModal';

const OperationalClientes: React.FC = () => {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'Todos',
    statusNf: 'Todos',
    pendencias: 'Todos'
  });

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Clientes</h2>
            <p className="text-sm text-gray-400 font-medium">Gerencie seus clientes e acompanhe o faturamento</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewClientModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
            <div className="relative">
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium"
              >
                <option>Todos</option>
                <option>Ativos</option>
                <option>Inativos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status NF</label>
            <div className="relative">
              <select 
                value={filters.statusNf}
                onChange={(e) => setFilters({...filters, statusNf: e.target.value})}
                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium"
              >
                <option>Todos</option>
                <option>Emitida</option>
                <option>Pendente</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pendências</label>
            <div className="relative">
              <select 
                value={filters.pendencias}
                onChange={(e) => setFilters({...filters, pendencias: e.target.value})}
                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium"
              >
                <option>Todos</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="flex-1 min-h-[500px] bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center p-12 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
          <Users size={32} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1e293b]">Nenhum cliente encontrado</h3>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">
            Clique em "Novo Cliente" para começar
          </p>
        </div>
      </div>

      <NewClientModal 
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
      />

    </div>
  );
};

export default OperationalClientes;
