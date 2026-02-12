
import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Package, FileText, Plus } from 'lucide-react';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewContractModal: React.FC<NewContractModalProps> = ({ isOpen, onClose }) => {
  const [duration, setDuration] = useState('12');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Contrato</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Cliente *</label>
            <div className="relative">
              <select className="w-full bg-white border-2 border-blue-600 rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none text-gray-700 cursor-pointer font-medium shadow-sm shadow-blue-500/10">
                <option>Selecione o cliente</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Status</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                <option>Ativo</option>
                <option>Pausado</option>
                <option>Encerrado</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-4" />

          {/* Produtos Vendidos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-gray-400" />
              <label className="text-[14px] font-semibold text-[#1e293b]">Produtos Vendidos *</label>
            </div>
            <div className="relative">
              <div className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] flex items-center justify-between text-gray-400 cursor-pointer hover:border-blue-200 transition-colors">
                <span>Selecionar produtos...</span>
                <div className="flex flex-col items-center justify-center scale-75 text-gray-400">
                   <ChevronDown size={14} className="rotate-180 mb-[-6px]" />
                   <ChevronDown size={14} />
                </div>
              </div>
            </div>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <Plus size={16} className="text-gray-400" />
              Criar novo produto
            </button>
          </div>

          <div className="h-px bg-gray-100 w-full my-4" />

          {/* Vigência do Contrato */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              <label className="text-[14px] font-semibold text-[#1e293b]">Vigência do Contrato</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-600">Data de Início</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Selecionar"
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium pl-10"
                  />
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-600">Duração (meses)</label>
                <input 
                  type="text" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-gray-600">Data de Término</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Calculado automaticamente"
                  disabled
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] text-gray-400 font-medium pl-10 cursor-not-allowed"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-4" />

          {/* Taxas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Taxa de Implantação</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="0,00"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Valor Mensal Recorrente</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="0,00"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-4" />

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Observações</label>
            <textarea 
              rows={4}
              placeholder="Anotações sobre o contrato..."
              className="w-full bg-white border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-10 py-3 bg-[#1147b1] text-white rounded-[14px] text-[14px] font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContractModal;
