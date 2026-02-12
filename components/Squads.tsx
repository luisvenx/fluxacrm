
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import NewSquadModal from './NewSquadModal';

const Squads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSquadModalOpen, setIsNewSquadModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Squads</h2>
          <p className="text-sm text-gray-400 font-medium">0 squads cadastrados</p>
        </div>

        <button 
          onClick={() => setIsNewSquadModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo Squad
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar squads..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Main Content Area - Empty State */}
      <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
          <Users size={32} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[#1e293b]">Nenhum squad encontrado</h3>
        </div>

        <button 
          onClick={() => setIsNewSquadModalOpen(true)}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          Criar primeiro squad
        </button>
      </div>

      <NewSquadModal 
        isOpen={isNewSquadModalOpen} 
        onClose={() => setIsNewSquadModalOpen(false)} 
      />

    </div>
  );
};

export default Squads;
