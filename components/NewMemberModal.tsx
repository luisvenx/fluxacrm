
import React, { useState } from 'react';
import { X, User, Upload, ChevronDown } from 'lucide-react';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMemberModal: React.FC<NewMemberModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const [hasContract, setHasContract] = useState(false);

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
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Membro da Equipe</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Photo Upload Area */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-10">
          <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
            <User size={40} className="text-gray-300" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Upload size={16} className="text-gray-400" />
            Adicionar foto
          </button>
        </div>

        <div className="h-px bg-gray-100 w-full mb-8" />

        {/* Form Body */}
        <div className="space-y-6">
          <p className="text-[14px] font-bold text-gray-500 mb-2">Dados Básicos</p>

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Nome *</label>
            <input 
              type="text" 
              placeholder="Nome completo"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium transition-all placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Cargo & Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Cargo *</label>
              <input 
                type="text" 
                placeholder="Ex: Desenvolvedor"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Tipo</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Funcionário</option>
                  <option>Sócio</option>
                  <option>Terceiro</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Email & Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Email</label>
              <input 
                type="email" 
                placeholder="email@exemplo.com"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Telefone</label>
              <input 
                type="text" 
                placeholder="(11) 99999-9999"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Tipo Doc. & Número */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Tipo Doc.</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>CPF</option>
                  <option>CNPJ</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="col-span-8 space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Número do Documento</label>
              <input 
                type="text" 
                placeholder="000.000.000-00"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Ativo Toggle */}
          <div className="flex items-center gap-3 py-2">
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 rounded-full relative transition-all duration-200 ${isActive ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isActive ? 'left-[26px]' : 'left-1'}`} />
            </button>
            <span className="text-[14px] font-semibold text-[#1e293b]">Ativo</span>
          </div>

          <div className="h-px bg-gray-100 w-full my-2" />

          {/* Possui Contrato Toggle */}
          <div className="flex items-center gap-3 py-2">
            <button 
              type="button"
              onClick={() => setHasContract(!hasContract)}
              className={`w-12 h-6 rounded-full relative transition-all duration-200 ${hasContract ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${hasContract ? 'left-[26px]' : 'left-1'}`} />
            </button>
            <span className="text-[14px] font-semibold text-[#1e293b]">Possui contrato</span>
          </div>

          {/* Centro de Custo & Valor Mensal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Centro de Custo</label>
              <div className="relative">
                <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                  <option>Nenhum</option>
                  <option>Operacional</option>
                  <option>Comercial</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Valor Mensal (Ref)</label>
              <input 
                type="text" 
                defaultValue="0"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-2" />

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Observações</label>
            <div className="relative">
              <textarea 
                rows={4}
                placeholder="Anotações adicionais sobre o membro..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-y placeholder:text-gray-400 font-medium min-h-[100px]"
              />
              <div className="absolute bottom-2 right-2 text-gray-300 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
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
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMemberModal;
