
import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  CreditCard, 
  User, 
  DollarSign, 
  AlertCircle,
  Building2
} from 'lucide-react';
import NewCardModal from './NewCardModal';

const Cards: React.FC = () => {
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Cartões</h2>
          <p className="text-sm text-gray-500 font-medium">Gerencie cartões da empresa e pessoais</p>
        </div>
        
        <button 
          onClick={() => setIsNewCardModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo cartão
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cartões Empresa */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cartões Empresa</p>
            <p className="text-2xl font-bold text-blue-700">0 ativos</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Building2 size={22} />
          </div>
        </div>

        {/* Cartões Pessoais */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-orange-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cartões Pessoais</p>
            <p className="text-2xl font-bold text-orange-400">0 ativos</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-400 rounded-xl flex items-center justify-center">
            <User size={22} />
          </div>
        </div>

        {/* Gasto Empresa */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-emerald-200 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gasto Empresa</p>
            <p className="text-2xl font-bold text-emerald-500">R$ 0,00</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Impacta o financeiro</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg">
            $
          </div>
        </div>

        {/* Gasto Pessoal */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center group hover:border-gray-300 transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gasto Pessoal</p>
            <p className="text-2xl font-bold text-gray-500">R$ 0,00</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Não impacta o financeiro</p>
          </div>
          <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center">
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tipo</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700">
                <option>Todos</option>
                <option>Empresa</option>
                <option>Pessoal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Status</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700">
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Data inicial</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="01/02/2026"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 text-gray-700"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Data final</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="28/02/2026"
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 text-gray-700"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Empty State Content Area */}
      <div className="flex-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl min-h-[400px] flex flex-col items-center justify-center p-12 text-center transition-all hover:border-gray-300">
        <p className="text-gray-400 font-medium text-lg tracking-tight">Nenhum cartão cadastrado</p>
      </div>

      {/* New Card Modal */}
      <NewCardModal 
        isOpen={isNewCardModalOpen} 
        onClose={() => setIsNewCardModalOpen(false)} 
      />

    </div>
  );
};

export default Cards;
