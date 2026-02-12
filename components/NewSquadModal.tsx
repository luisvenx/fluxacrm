
import React, { useState } from 'react';
import { X, Upload, ChevronDown, Users } from 'lucide-react';

interface NewSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewSquadModal: React.FC<NewSquadModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const members = [
    { id: '1', name: 'Gabriel Dantras', initials: 'GD' },
    { id: '2', name: 'Kyros', initials: 'KY' },
    { id: '3', name: 'Lucca Hurtado', initials: 'LU' },
  ];

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
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
      <div className="relative bg-white w-full max-w-[480px] max-h-[95vh] overflow-y-auto rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Squad</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Flag Upload Section */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#eef2ff] rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
              <Users size={28} />
            </div>
            <div className="space-y-1.5">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                <Upload size={16} className="text-gray-400" />
                Enviar bandeira
              </button>
              <p className="text-[11px] text-gray-400 font-medium">PNG, JPG. Máx 5MB</p>
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Nome *</label>
            <input 
              type="text" 
              placeholder="Ex: Squad Alpha"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400 font-medium"
              autoFocus
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Descrição</label>
            <textarea 
              rows={3}
              placeholder="Descreva o objetivo do squad..."
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Líder */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Líder</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] appearance-none focus:outline-none focus:border-blue-400 text-gray-700 cursor-pointer font-medium">
                <option>Selecione o líder</option>
                <option>Gabriel Dantras</option>
                <option>Kyros</option>
                <option>Lucca Hurtado</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Mantra do Time */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Mantra do Time</label>
            <input 
              type="text" 
              placeholder="Ex: Juntos somos invencíveis!"
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all placeholder:text-gray-400 font-medium"
            />
            <p className="text-[11px] text-gray-400 font-medium leading-tight">
              Frase motivacional exibida quando o squad está em primeiro lugar
            </p>
          </div>

          {/* Membros */}
          <div className="space-y-3">
            <label className="text-[14px] font-semibold text-[#1e293b]">Membros</label>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[18px] overflow-hidden divide-y divide-gray-100 shadow-sm">
              {members.map((member) => (
                <div 
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className="flex items-center gap-4 p-4 hover:bg-white transition-colors cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMembers.includes(member.id) ? 'bg-[#1d4ed8] border-[#1d4ed8]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                    {selectedMembers.includes(member.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-100">
                    {member.initials}
                  </div>
                  <span className="text-[14px] font-bold text-gray-700">{member.name}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 font-medium ml-1">O membro(s) selecionado(s)</p>
          </div>

          {/* Ativo Status Box */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[18px] p-5 flex items-center justify-between group transition-colors hover:border-blue-200">
            <div className="space-y-1">
              <p className="text-[15px] font-bold text-gray-800 tracking-tight">Ativo</p>
              <p className="text-[12px] text-gray-400 font-medium leading-tight">
                Squads inativos não aparecem nas opções
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 ${isActive ? 'bg-[#1d4ed8]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isActive ? 'left-[26px]' : 'left-1'}`} />
            </button>
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
              className="px-10 py-3 bg-[#1d4ed8] text-white rounded-[14px] text-[14px] font-bold hover:bg-[#1e40af] transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Criar Squad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSquadModal;
