
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import NewProductModal from './NewProductModal';

const OperationalProdutos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos os tipos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Produtos</h2>
            <p className="text-sm text-gray-400 font-medium">Catálogo de produtos operacionais</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewProductModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm text-gray-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2.5 pl-4 pr-10 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-600 font-medium shadow-sm min-w-[160px]"
            >
              <option>Todos os tipos</option>
              <option>Produto</option>
              <option>Serviço</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2.5 pl-4 pr-10 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-600 font-medium shadow-sm min-w-[140px]"
            >
              <option>Todos</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="flex-1 min-h-[500px] bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center p-12 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
          <Package size={32} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1e293b]">Nenhum produto encontrado</h3>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">
            Crie seu primeiro produto para começar
          </p>
        </div>
      </div>

      <NewProductModal 
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
      />

    </div>
  );
};

export default OperationalProdutos;
