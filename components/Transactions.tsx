
import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Upload, 
  MousePointer2, 
  Calendar,
  ArrowUp,
  ReceiptText,
  Trash2,
  CheckCircle,
  Tag,
  X
} from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import ImportModal from './ImportModal';

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 relative pb-32">
      
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
            <ReceiptText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Lançamentos</h2>
            <p className="text-sm text-gray-500 font-medium">Gerencie todas as entradas e saídas financeiras</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isSelectionMode 
              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-blue-100/50' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MousePointer2 size={18} className={isSelectionMode ? 'text-blue-600' : 'text-gray-400'} />
            {isSelectionMode ? 'Sair da Seleção' : 'Selecionar'}
          </button>
          
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload size={18} className="text-gray-400" />
            Importar Extrato
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pesquisar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por descrição..." 
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tipo</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
                <option>Entrada</option>
                <option>Saída</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Status</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
                <option>Pago</option>
                <option>Pendente</option>
                <option>Atrasado</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Data Início</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <button className="w-full flex items-center justify-between bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-400 hover:border-blue-300 transition-all">
                  Selecionar
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Data Fim</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <button className="w-full flex items-center justify-between bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-400 hover:border-blue-300 transition-all">
                  Selecionar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Centro de Custo</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Cliente</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Conta Contábil</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-medium">
                <option>Todos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Entradas</p>
          <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Saídas</p>
          <p className="text-2xl font-bold text-red-500">R$ 0,00</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Realizados</p>
          <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Pendentes</p>
          <p className="text-2xl font-bold text-orange-400">R$ 0,00</p>
        </div>
      </div>

      {/* Main Content Area / Empty State */}
      <div className="flex-1 bg-white border-2 border-dashed border-gray-200 rounded-3xl min-h-[400px] flex flex-col items-center justify-center p-12 text-center group transition-all hover:border-blue-200 hover:bg-blue-50/20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300">
          <div className="relative">
            <ArrowUp size={32} />
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-current rounded-full"></div>
          </div>
        </div>
        <h3 className="mt-8 text-xl font-bold text-[#1e293b]">Nenhum lançamento encontrado</h3>
        <p className="mt-2 text-gray-500 font-medium">
          {isSelectionMode ? "O modo de seleção está ativo, mas não há itens para selecionar." : "Clique em 'Novo Lançamento' ou importe um extrato para começar."}
        </p>
      </div>

      {/* Bulk Action Bar (Visible in Selection Mode) */}
      {isSelectionMode && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 duration-300 z-50 border border-white/10 ring-8 ring-black/5">
          <div className="flex items-center gap-4 border-r border-white/10 pr-8">
            <span className="text-sm font-bold">0 itens selecionados</span>
            <button 
              onClick={() => setIsSelectionMode(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <CheckCircle size={16} />
              Marcar Pago
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Tag size={16} />
              Mudar Centro
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </div>
      )}

      {/* Modals Integration */}
      <NewTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />

      {/* Floating Button Placeholder */}
      <div className="fixed bottom-8 right-8 lg:hidden">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-700 transition-all"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
};

export default Transactions;
