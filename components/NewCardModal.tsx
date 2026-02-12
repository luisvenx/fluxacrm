
import React, { useState } from 'react';
import { X, ChevronDown, Building2 } from 'lucide-react';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCardModal: React.FC<NewCardModalProps> = ({ isOpen, onClose }) => {
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
      <div className="relative bg-white w-full max-w-[440px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[19px] font-bold text-[#1e293b]">Novo cartão</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5">
          {/* Nome do cartão */}
          <div className="space-y-2">
            <label className="text-[15px] font-medium text-gray-700">Nome do cartão *</label>
            <input 
              type="text" 
              placeholder="Ex: Nubank Empresa"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-[15px] font-medium text-gray-700">Tipo *</label>
            <div className="relative">
              <div className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3.5 px-4 text-[14px] flex items-center gap-3 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                <Building2 size={18} className="text-gray-700" />
                <span className="flex-1">Cartão Empresa</span>
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#eef2ff] border border-[#dbeafe] rounded-[14px] p-5 flex gap-4">
            <Building2 size={20} className="text-[#1e293b] mt-0.5 shrink-0" />
            <p className="text-[14px] text-[#3b5998] leading-relaxed">
              Cartão empresa <span className="font-bold">impacta</span> o financeiro. Gastos entram no caixa, Dashboard e Centros de Custo.
            </p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between bg-white border border-[#e2e8f0] rounded-[14px] p-4">
            <span className="text-[15px] font-medium text-gray-700">Cartão ativo</span>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 rounded-full relative transition-all duration-200 ${isActive ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isActive ? 'left-[26px]' : 'left-1'}`} />
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] text-[15px] font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-8 py-3 bg-[#1d4ed8] text-white rounded-[14px] text-[15px] font-medium hover:bg-[#1e40af] transition-all shadow-sm"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCardModal;
