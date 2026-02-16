
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CircleDot, 
  Plus, 
  Target, 
  KeyRound, 
  TrendingUp, 
  AlertTriangle,
  ChevronDown,
  Filter,
  Search,
  Zap,
  Loader2,
  Database,
  RefreshCcw,
  MoreVertical,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewOKRModal from './NewOKRModal';

interface OperationalOKRProps {
  user: any;
}

const OperationalOKR: React.FC<OperationalOKRProps> = ({ user }) => {
  const [okrs, setOkrs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOKRs = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('okrs')
        .select('*')
        .eq('user_id', user.id) 
        .order('title');
      if (error) throw error;
      setOkrs(data || []);
    } catch (err) {
      console.error('Erro OKR:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOKRs();
  }, [user]);

  const filteredOKRs = useMemo(() => {
    return okrs.filter(o => o.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [okrs, searchTerm]);

  const stats = useMemo(() => {
    const total = okrs.length;
    const avgProgress = total > 0 ? Math.round(okrs.reduce((acc, o) => acc + (Math.min(o.current / o.target, 1) * 100), 0) / total) : 0;
    return [
      { label: 'Objetivos em Ciclo', value: total.toString(), trend: 'Execução SQL', icon: <Target size={18}/> },
      { label: 'Atingimento Real', value: `${avgProgress}%`, trend: 'Performance', icon: <TrendingUp size={18}/> },
    ];
  }, [okrs]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            OKR <span className="text-[#01223d] not-italic">& Strategy</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Auditoria tática de resultados-chave e metas críticas SQL</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Definir Objetivo
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group hover:border-[#b4a183] transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{isLoading ? '...' : stat.value}</h3>
              <div className={`p-3 bg-slate-50 text-[#01223d] rounded-xl border border-slate-100 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-40 group lg:col-span-2">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Meta Master do Ciclo</p>
           <h3 className="text-3xl font-black tracking-tighter italic relative z-10 uppercase">Sincronizado</h3>
           <Target size={140} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
           <button onClick={fetchOKRs} className="relative z-10 w-fit p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
             <RefreshCcw size={14} className={`text-[#b4a183] ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando Estratégia...</p>
        </div>
      ) : filteredOKRs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl min-h-[400px] flex flex-col items-center justify-center p-12 text-center opacity-30">
           <Target size={48} className="mb-4" />
           <p className="text-sm font-black uppercase tracking-widest italic">Nenhum OKR configurado no nó atual</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
           {filteredOKRs.map(okr => {
             const perc = Math.min((okr.current / okr.target) * 100, 100);
             return (
               <div key={okr.id} className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between min-h-[300px] relative overflow-hidden">
                 <div>
                   <div className="flex justify-between items-start mb-10">
                     <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-widest bg-slate-50 text-[#01223d] px-3 py-1 rounded-md border border-slate-100 italic">{okr.period || 'Ciclo 2026'} SQL</span>
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-6 uppercase italic leading-none">{okr.title}</h4>
                     </div>
                     <button className="p-3 text-slate-200 hover:text-slate-900 transition-colors bg-white rounded-xl border border-transparent hover:border-slate-200 shadow-sm"><MoreHorizontal size={20}/></button>
                   </div>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-slate-50">
                   <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Execução Realizada</span>
                         <span className="text-3xl font-black text-slate-900 tracking-tighter italic">
                           {okr.current} <span className="text-slate-200 not-italic mx-2">/</span> <span className="text-slate-300">{okr.target}</span>
                         </span>
                      </div>
                      <div className="text-right">
                         <span className={`text-xl font-black ${perc >= 100 ? 'text-emerald-500' : 'text-[#01223d]'}`}>{perc.toFixed(1)}%</span>
                         <p className="text-[9px] text-slate-300 font-bold uppercase flex items-center gap-1 mt-1 justify-end"><Zap size={10} fill="currentColor"/> Ativo</p>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                      <div className={`h-full transition-all duration-[2000ms] rounded-full ${perc >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-[#01223d]'}`} style={{ width: `${perc}%` }}></div>
                   </div>
                 </div>
                 <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 bg-[#b4a183]"></div>
               </div>
             );
           })}
        </div>
      )}

      <NewOKRModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchOKRs(); }} user={user} />
    </div>
  );
};

const MoreHorizontal = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

export default OperationalOKR;
