
import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface NewNPSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewNPSModal: React.FC<NewNPSModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#f9fafb] w-full max-w-[440px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 p-8 border border-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1e293b]">Nova Pesquisa NPS</h2>
            <p className="text-[14px] text-gray-400 font-medium">
              Crie uma pesquisa de NPS manual para um cliente
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6 mt-8">
          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-[15px] font-semibold text-[#1e293b]">Cliente</label>
            <div className="relative">
              <select className="w-full bg-white border-2 border-[#1d4ed8] rounded-[14px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none text-gray-700 cursor-pointer font-medium shadow-sm">
                <option>Selecione um cliente</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Contexto (opcional) */}
          <div className="space-y-2">
            <label className="text-[15px] font-semibold text-[#1e293b]">Contexto (opcional)</label>
            <textarea 
              rows={4}
              placeholder="Ex: Após entrega do projeto X"
              className="w-full bg-white border border-[#e2e8f0] rounded-[14px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-y placeholder:text-gray-400 font-medium min-h-[100px]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-3 bg-white border border-[#e2e8f0] rounded-[14px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-8 py-3 bg-[#1147b1] text-white rounded-[14px] text-[14px] font-bold hover:bg-blue-800 transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar Pesquisa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNPSModal;
