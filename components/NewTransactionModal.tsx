
import React from 'react';
import { X, Calendar, Info, Paperclip, ChevronDown, Plus } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[600px] max-h-[95vh] overflow-y-auto rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Novo Lançamento</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="p-8 pt-2 space-y-5">
          {/* Tipo e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Tipo *</label>
              <div className="relative">
                <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 font-medium text-gray-700 cursor-pointer">
                  <option>Entrada</option>
                  <option>Saída</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <label className="text-sm font-bold text-gray-700">Status *</label>
                <Info size={14} className="text-gray-300" />
              </div>
              <div className="relative">
                <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 font-medium text-gray-700 cursor-pointer">
                  <option>Pendente</option>
                  <option>Pago</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Descrição *</label>
            <input 
              type="text" 
              placeholder="Ex: Pagamento de consultoria"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 text-gray-700"
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Valor (R$) *</label>
              <input 
                type="number" 
                defaultValue="0"
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 text-gray-700 font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Data de Competência *</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  defaultValue="12/02/2026"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 text-gray-700 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Cliente</label>
              <button type="button" className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                <Plus size={12} /> Novo
              </button>
            </div>
            <div className="relative">
              <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-400 cursor-pointer">
                <option>Selecione um cliente</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Fornecedor */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Fornecedor (opcional)</label>
              <button type="button" className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                <Plus size={12} /> Novo
              </button>
            </div>
            <div className="relative">
              <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-400 cursor-pointer">
                <option>Vincular a fornecedor</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Membro da Equipe */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Membro da Equipe (opcional)</label>
              <button type="button" className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                <Plus size={12} /> Novo
              </button>
            </div>
            <div className="relative">
              <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-400 cursor-pointer">
                <option>Vincular a membro</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Centro de Custo e Conta Contábil */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Centro de Custo</label>
              <div className="relative">
                <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-400 cursor-pointer">
                  <option>Selecione</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <label className="text-sm font-bold text-gray-700">Conta Contábil</label>
                <Info size={14} className="text-gray-300" />
              </div>
              <div className="relative">
                <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-400 cursor-pointer">
                  <option>Selecione</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Banco */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Banco</label>
            <div className="relative">
              <select className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-400 cursor-pointer">
                <option>Selecione o banco</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Meio de Pagamento */}
          <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
            <label className="text-sm font-bold text-gray-700 block mb-4">Meio de Pagamento</label>
            <div className="flex flex-wrap gap-5">
              {['Pix', 'Boleto', 'Transferência', 'Cartão', 'Outro'].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600/30 flex items-center justify-center transition-all group-hover:border-blue-600/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 scale-0 transition-transform group-hover:scale-50"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Parcelado Toggle */}
          <div className="flex items-center justify-between bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
            <div>
              <p className="text-sm font-bold text-gray-700">Parcelado</p>
              <p className="text-xs text-gray-400">Dividir em múltiplas parcelas</p>
            </div>
            <button type="button" className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors hover:bg-gray-300">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
            </button>
          </div>

          {/* Attachments Area */}
          <div className="border-2 border-dashed border-gray-100 rounded-[24px] p-8 flex flex-col items-center justify-center text-center gap-3 bg-gray-50/30">
            <Paperclip size={24} className="text-gray-300" />
            <p className="text-sm font-medium text-gray-400 px-10">Salve o lançamento primeiro para adicionar anexos</p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-[#1147b1] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
            >
              Criar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
