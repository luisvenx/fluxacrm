
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Células <span className="text-blue-600 not-italic">Operacionais</span>
          </h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-4">Estruturação organizacional e gestão de squads da conta</p>
        </div>

        <button 
          onClick={() => setIsNewSquadModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Provisionar Squad
        </button>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm mb-12 flex items-center justify-between gap-4">
        <div className="relative flex-1 group ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar squad ou líder de operação..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-600"
          />
        </div>
        <button onClick={fetchSquads} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm mr-2 transition-all">
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Squads...</p></div>
      ) : filteredSquads.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-24 text-center opacity-30">
           <Users size={48} className="mx-auto mb-4" />
           <p className="text-sm font-black uppercase tracking-widest">Nenhuma célula operacional configurada</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredSquads.map((squad) => (
            <div key={squad.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 transition-all duration-500 group shadow-sm hover:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[360px]">
               <div>
                 <div className="flex justify-between items-start mb-10">
                    <div className="w-20 h-20 bg-slate-900 text-blue-400 border border-slate-700 rounded-[1.75rem] flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition-transform italic">
                      {squad.name.substring(0,1).toUpperCase()}
                    </div>
                    <div className="flex gap-2">
                       <span className={`text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest border shadow-sm ${squad.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                         {squad.status || 'Active'}
                       </span>
                       <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={20}/></button>
                    </div>
                 </div>

                 <div className="space-y-5">
                    <div className="min-w-0">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase truncate italic">{squad.name}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 line-clamp-1 italic opacity-60">"{squad.mantra || 'Eficiência pura em cada entrega.'}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                      <div>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Operational Head</p>
                         <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">{squad.leader || 'A definir'}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Contingente</p>
                         <p className="text-sm font-black text-slate-800 tracking-tight">{Array.isArray(squad.members) ? squad.members.length : 0} Unidades</p>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="flex items-center gap-3 pt-10 mt-auto">
                   <div className="flex -space-x-3">
                      {(squad.members || []).slice(0, 4).map((member: string, i: number) => (
                        <div key={i} className="w-9 h-9 rounded-[0.75rem] border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-md transition-transform hover:scale-125 hover:z-10" title={member}>
                          {member.substring(0, 1).toUpperCase()}
                        </div>
                      ))}
                      {(squad.members || []).length > 4 && (
                        <div className="w-9 h-9 rounded-[0.75rem] border-4 border-white bg-[#203267] flex items-center justify-center text-[9px] font-black text-white shadow-md">
                           +{(squad.members || []).length - 4}
                        </div>
                      )}
                   </div>
                   <button className="ml-auto w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
                      <ChevronRight size={18} />
                   </button>
               </div>
               <div className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-1000 bg-blue-600"></div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsNewSquadModalOpen(true)} 
            className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center gap-5 hover:bg-white hover:border-blue-300 transition-all group min-h-[360px]"
          >
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-200 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all border border-slate-100 shadow-inner group-hover:rotate-90">
                <Plus size={32} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 block">Provisionar Squad</span>
                 <p className="text-[9px] text-slate-300 uppercase font-bold">Estruturação de novo time</p>
              </div>
          </button>
        </div>
      )}

      <NewSquadModal isOpen={isNewSquadModalOpen} onClose={() => { setIsNewSquadModalOpen(false); fetchSquads(); }} user={user} />
    </div>
  );
};

export default Squads;
