
import React, { useState } from 'react';
import { X, Upload, Building2, FileText, ChevronDown } from 'lucide-react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('Ativo');
  const [statusNf, setStatusNf] = useState('OK');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Cliente</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section: Identidade Visual */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Building2 size={18} />
            <span className="text-sm font-bold text-[#1e293b]">Identidade Visual</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-xl font-medium text-gray-400 border border-gray-100 shadow-inner">
              C
            </div>
            <div className="space-y-2">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                <Upload size={16} className="text-gray-400" />
                Enviar logo
              </button>
              <p className="text-[11px] text-gray-400 font-medium">PNG, JPG ou WebP. Máx 5MB.</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-8" />

          {/* Section: Dados da Empresa */}
          <div className="flex items-center gap-2 text-gray-500 mb-6">
            <FileText size={18} />
            <span className="text-sm font-bold text-[#1e293b]">Dados da Empresa</span>
          </div>

          <div className="space-y-5">
            {/* Nome da Empresa */}
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Nome da empresa *</label>
              <input 
                type="text" 
                placeholder="Razão social ou nome fantasia"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400 font-medium"
                autoFocus
              />
            </div>

            {/* Documento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Tipo de documento</label>
                <div className="relative">
                  <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-500 cursor-pointer font-medium">
                    <option>Selecionar</option>
                    <option>CNPJ</option>
                    <option>CPF</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Documento</label>
                <input 
                  type="text" 
                  placeholder="Selecione o tipo"
                  disabled
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Status e Status NF */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Status</label>
                <div className="relative">
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium"
                  >
                    <option>Ativo</option>
                    <option>Inativo</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Status NF</label>
                <div className="relative">
                  <select 
                    value={statusNf}
                    onChange={(e) => setStatusNf(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium"
                  >
                    <option>OK</option>
                    <option>Pendente</option>
                    <option>Bloqueado</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-8" />

          {/* Section: Observações */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Observações</label>
            <textarea 
              rows={4}
              placeholder="Anotações sobre o cliente..."
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

export default NewClientModal;
