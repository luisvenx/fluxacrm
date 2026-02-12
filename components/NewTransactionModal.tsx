
import React from 'react';
import { X, Calendar, Info, Paperclip, ChevronDown, Plus, DollarSign, Tag, CreditCard } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[650px] max-h-[90vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Lançamento</h2>
              <p className="text-xs text-slate-400 font-medium">Registre uma nova entrada ou saída de caixa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
          <form className="space-y-8">
            {/* Amount Section */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-4">Valor da Transação</label>
              <div className="flex items-center text-4xl font-bold text-slate-900 tracking-tighter">
                <span className="text-slate-300 mr-2 text-2xl">R$</span>
                <input 
                  type="text" 
                  defaultValue="0,00"
                  className="bg-transparent border-none p-0 focus:ring-0 w-48 text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Fluxo</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button type="button" className="flex-1 py-3 bg-white text-emerald-600 rounded-xl text-xs font-bold shadow-sm border border-slate-100">Entrada</button>
                  <button type="button" className="flex-1 py-3 text-slate-400 rounded-xl text-xs font-bold hover:text-slate-600 transition-all">Saída</button>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status do Pagamento</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button type="button" className="flex-1 py-3 bg-white text-blue-600 rounded-xl text-xs font-bold shadow-sm border border-slate-100">Pago</button>
                  <button type="button" className="flex-1 py-3 text-slate-400 rounded-xl text-xs font-bold hover:text-slate-600 transition-all">Pendente</button>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento</label>
              <input 
                type="text" 
                placeholder="Ex: Consultoria Financeira Mensal"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                    <option>Selecione uma categoria</option>
                    <option>Serviços</option>
                    <option>Infraestrutura</option>
                    <option>Marketing</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Competência</label>
                <div className="relative">
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Banco/Meio de Pagamento */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vincular a Banco / Cartão</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>Itaú Unibanco - Principal</option>
                  <option>Nubank - Digital</option>
                  <option>Cartão Corporativo Visa</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Attachments Placeholder */}
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                <Paperclip size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Anexar Comprovante / Nota Fiscal</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Confirmar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionModal;
