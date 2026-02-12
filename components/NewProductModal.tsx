
import React, { useState } from 'react';
import { X, Package, Users, Clock, ChevronDown } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
  const [involvedTeams, setInvolvedTeams] = useState<string[]>([]);

  const toggleTeam = (team: string) => {
    setInvolvedTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

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
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Produto</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-8">
          {/* Section: Informações Básicas */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Package size={18} />
              <span className="text-sm font-bold text-[#1e293b]">Informações Básicas</span>
            </div>

            <div className="space-y-5">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Nome do Produto *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Gestão de Redes Sociais"
                  className="w-full bg-white border-2 border-blue-600 rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none text-gray-700 font-medium shadow-sm shadow-blue-500/10 transition-all placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              {/* Tipo e Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#1e293b]">Tipo *</label>
                  <div className="relative">
                    <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                      <option>Recorrente</option>
                      <option>Único</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#1e293b]">Status</label>
                  <div className="relative">
                    <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                      <option>Ativo</option>
                      <option>Inativo</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Descrição Interna */}
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Descrição interna</label>
                <textarea 
                  rows={3}
                  placeholder="Descreva o que este produto entrega..."
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Section: Configurações Operacionais */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Users size={18} />
              <span className="text-sm font-bold text-[#1e293b]">Configurações Operacionais</span>
            </div>

            <div className="space-y-5">
              {/* Times Envolvidos */}
              <div className="space-y-3">
                <label className="text-[14px] font-semibold text-[#1e293b]">Times Envolvidos</label>
                <div className="grid grid-cols-2 gap-y-3">
                  {['CX', 'Técnico', 'Marketing', 'Comercial'].map((team) => (
                    <button 
                      key={team}
                      onClick={() => toggleTeam(team)}
                      className="flex items-center gap-3 group w-fit cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${involvedTeams.includes(team) ? 'bg-[#1d4ed8] border-[#1d4ed8]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                        {involvedTeams.includes(team) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-[14px] font-medium text-gray-700">{team}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SLA e Unidade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#1e293b]">SLA Padrão</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 5"
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#1e293b]">Unidade</label>
                  <div className="relative">
                    <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-500 cursor-pointer font-medium">
                      <option>Selecionar</option>
                      <option>Dias úteis</option>
                      <option>Horas</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Responsável Padrão */}
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#1e293b]">Responsável Padrão</label>
                <div className="relative">
                  <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-500 cursor-pointer font-medium">
                    <option>Selecionar responsável</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Section: Escopo de On-Boarding */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={18} />
              <span className="text-sm font-bold text-[#1e293b]">Escopo de On-Boarding</span>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#1e293b]">Descrição do On-Boarding</label>
              <textarea 
                rows={4}
                placeholder="Descreva como funciona o on-boarding deste produto, etapas esperadas, dependências, observações..."
                className="w-full bg-white border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none placeholder:text-gray-400 font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-3 bg-white border border-[#e2e8f0] rounded-[14px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
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

export default NewProductModal;
