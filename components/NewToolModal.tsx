
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface NewToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewToolModal: React.FC<NewToolModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[480px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 p-8 border border-white">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Nova ferramenta</h2>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Nome e Fornecedor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Nome *</label>
              <input 
                type="text" 
                placeholder="Ex: OpenAI API"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400 font-medium"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Fornecedor</label>
              <input 
                type="text" 
                placeholder="Ex: OpenAI"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Valor, Dia de cobrança e Recorrência */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Valor mensal</label>
              <input 
                type="text" 
                defaultValue="0"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
            <div className="col-span-4 space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Dia de cobrança</label>
              <input 
                type="text" 
                defaultValue="1"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
            <div className="col-span-4 space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Recorrência</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Mensal</option>
                  <option>Anual</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Categoria e Centro de custo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Categoria</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Nenhuma</option>
                  <option>SaaS</option>
                  <option>Marketing</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Centro de custo</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Nenhum</option>
                  <option>Operacional</option>
                  <option>Comercial</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Meio de pagamento padrão */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Meio de pagamento padrão</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                <option>Nenhum</option>
                <option>Pix</option>
                <option>Cartão</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <p className="text-[12px] text-gray-400 font-medium">Este meio de pagamento será usado nos lançamentos automáticos</p>
          </div>

          {/* Ativa Toggle */}
          <div className="flex items-center gap-3 py-2">
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full relative transition-all duration-200 ${isActive ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isActive ? 'left-[22px]' : 'left-1'}`} />
            </button>
            <span className="text-[14px] font-semibold text-[#1e293b]">Ferramenta ativa</span>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-9 py-3 bg-[#1147b1] text-white rounded-[14px] text-[14px] font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewToolModal;
