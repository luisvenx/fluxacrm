
import React from 'react';
import { X } from 'lucide-react';

interface NewCostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCostCenterModal: React.FC<NewCostCenterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[440px] rounded-[24px] shadow-xl animate-in zoom-in-95 duration-200 p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[19px] font-bold text-[#1e293b]">Novo Centro de Custo</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[15px] font-medium text-gray-700">Nome</label>
            <input 
              type="text" 
              placeholder="Ex: Marketing, TI, Operacional..."
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-white border border-[#e2e8f0] rounded-[14px] text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-8 py-3 bg-[#8ca1db] text-white rounded-[14px] text-[14px] font-medium hover:bg-[#7a8ec9] transition-all shadow-sm"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCostCenterModal;
