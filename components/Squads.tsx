
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Loader2, 
  Database, 
  MoreVertical, 
  Users2,
  RefreshCcw,
  LayoutGrid,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';
import NewSquadModal from './NewSquadModal';
import { supabase } from '../lib/supabase';

interface SquadsProps {
  user: any;
}

const Squads: React.FC<SquadsProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSquadModalOpen, setIsNewSquadModalOpen] = useState(false);
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSquads = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('squads').select('*').eq('user_id', user.id);
      if (error) throw error;
      setSquads(data || []);
    } catch (err) {
      console.error('Erro ao buscar squads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, [user]);

  const filteredSquads = useMemo(() => {
    return squads.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.leader?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [squads, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Células <span className="text-[#01223d] not-italic">Comerciais</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Estruturação de times e gestão de squads da conta SQL</p>
        </div>

        <button 
          onClick={() => setIsNewSquadModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Provisionar Unidade
        </button>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-12 flex items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar squad ou líder de operação..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 outline-none text-slate-600 transition-all shadow-inner"
          />
        </div>
        <button onClick={fetchSquads} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Células...</p></div>
      ) : filteredSquads.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-xl p-24 text-center opacity-30">
           <Users size={48} className="mx-auto mb-4" />
           <p className="text-sm font-black uppercase tracking-widest italic">Nenhuma célula operacional configurada</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredSquads.map((squad) => (
            <div key={squad.id} className="bg-white border border-slate-200 rounded-xl p-10 transition-all duration-500 group shadow-sm hover:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[360px]">
               <div>
                 <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-[#01223d] text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition-transform italic">
                      {squad.name.substring(0,1).toUpperCase()}
                    </div>
                    <div className="flex gap-2">
                       <span className={`text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest border shadow-sm ${squad.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                         {squad.status || 'Active'}
                       </span>
                       <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={20}/></button>
                    </div>
                 </div>

                 <div className="space-y-5">
                    <div className="min-w-0">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase truncate italic">{squad.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 line-clamp-1 italic opacity-60">"{squad.mantra || 'Eficiência pura em cada entrega.'}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                      <div>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Squad Head</p>
                         <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tight italic">{squad.leader || 'A definir'}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Membros</p>
                         <p className="text-sm font-black text-slate-800 tracking-tight">{Array.isArray(squad.members) ? squad.members.length : 0} Ativos</p>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="flex items-center gap-3 pt-10 mt-auto">
                   <div className="flex -space-x-3">
                      {(squad.members || []).slice(0, 4).map((member: string, i: number) => (
                        <div key={i} className="w-9 h-9 rounded-lg border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-md transition-transform hover:scale-125 hover:z-10" title={member}>
                          {member.substring(0, 1).toUpperCase()}
                        </div>
                      ))}
                      {(squad.members || []).length > 4 && (
                        <div className="w-9 h-9 rounded-lg border-4 border-white bg-[#01223d] flex items-center justify-center text-[9px] font-black text-[#b4a183] shadow-md">
                           +{(squad.members || []).length - 4}
                        </div>
                      )}
                   </div>
                   <button className="ml-auto w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#01223d] hover:border-[#b4a183] transition-all">
                      <ChevronRight size={18} />
                   </button>
               </div>
               <div className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-1000 bg-[#b4a183]"></div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsNewSquadModalOpen(true)} 
            className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-5 hover:bg-white hover:border-[#b4a183] transition-all group min-h-[360px]"
          >
              <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:text-[#01223d] group-hover:bg-slate-50 transition-all border border-slate-100 shadow-inner group-hover:rotate-90">
                <Plus size={32} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-[#01223d] block">Novo Squad Comercial</span>
                 <p className="text-[9px] text-slate-300 uppercase font-bold">Provisão de nova célula</p>
              </div>
          </button>
        </div>
      )}

      <NewSquadModal isOpen={isNewSquadModalOpen} onClose={() => { setIsNewSquadModalOpen(false); fetchSquads(); }} user={user} />
    </div>
  );
};

export default Squads;
