
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  User, 
  Building2,
  Trophy,
  Loader2,
  Database,
  Users,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import NewGoalModal from './NewGoalModal';
import { supabase } from '../lib/supabase';

interface MetasProps {
  user: any;
}

const Metas: React.FC<MetasProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'individuais' | 'squads'>('empresa');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('goals').select('*').eq('user_id', user.id);
      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const avgAtingimento = useMemo(() => {
    if (goals.length === 0) return 0;
    const totalPerc = goals.reduce((acc, g) => {
      const p = Math.min((Number(g.current_value) / Number(g.target_value)) * 100, 100);
      return acc + p;
    }, 0);
    return Math.round(totalPerc / goals.length);
  }, [goals]);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => 
      g.scope?.toLowerCase() === activeTab.substring(0, activeTab.length - (activeTab.endsWith('s') ? 1 : 0)).toLowerCase() || 
      (activeTab === 'empresa' && g.scope === 'Empresa')
    );
  }, [goals, activeTab]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Objetivos <span className="text-[#01223d] not-italic">& Performance</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Auditoria tática de KPIs e OKRs corporativos SQL</p>
        </div>

        <button 
          onClick={() => setIsNewGoalModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Definir OKR
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:border-[#b4a183] transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atingimento Real</p>
            <div className="flex items-end justify-between">
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{avgAtingimento}%</h3>
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-100 shadow-sm">
                  <TrendingUp size={20} />
               </div>
            </div>
         </div>
         <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm flex flex-col justify-between h-40">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metas em Ciclo</p>
            <div className="flex items-end justify-between">
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{goals.length}</h3>
               <div className="w-10 h-10 bg-slate-50 text-[#01223d] rounded-lg border border-slate-100 flex items-center justify-center shadow-sm">
                  <Target size={20} />
               </div>
            </div>
         </div>
         <div className="bg-[#01223d] p-8 rounded-xl shadow-2xl flex flex-col justify-between h-40 relative overflow-hidden group">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Meta Master</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">Sincronizado</h3>
               <Sparkles size={20} className="text-[#b4a183] group-hover:rotate-12 transition-transform" />
            </div>
            <Target size={150} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700" />
         </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm mb-10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Empresa', 'Individuais', 'Squads'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as any)}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all min-w-[120px] ${
                activeTab === tab.toLowerCase() ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando Resultados...</p></div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-xl p-24 text-center opacity-30">
           <Database size={48} className="mx-auto mb-4" />
           <p className="text-sm font-black uppercase tracking-widest italic">Nenhuma meta configurada</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredGoals.map((goal) => {
            const perc = Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100);
            return (
              <div key={goal.id} className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between min-h-[300px] relative overflow-hidden">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-slate-50 text-[#01223d] px-3 py-1 rounded-md border border-slate-100">{goal.metric} SQL</span>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mt-5 leading-none">{goal.title}</h4>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all ${perc >= 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-200 border-slate-100'}`}>
                      <Trophy size={28} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-slate-50">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Execução Realizada</span>
                       <span className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">
                         {goal.current_value} <span className="text-slate-200 not-italic mx-2">/</span> <span className="text-slate-300">{goal.target_value}</span>
                       </span>
                    </div>
                    <div className="text-right">
                       <span className={`text-xl font-black ${perc >= 100 ? 'text-emerald-500' : 'text-[#01223d]'}`}>{perc.toFixed(1)}%</span>
                       <p className="text-[9px] text-slate-300 font-bold uppercase flex items-center gap-1 mt-1 justify-end"><Clock size={10}/> Ciclo {goal.period}</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                    <div 
                      className={`h-full transition-all duration-[2000ms] rounded-full ${perc >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-[#01223d]'}`} 
                      style={{ width: `${perc}%` }}
                    ></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 bg-[#b4a183]"></div>
              </div>
            );
          })}
        </div>
      )}
      <NewGoalModal isOpen={isNewGoalModalOpen} onClose={() => { setIsNewGoalModalOpen(false); fetchGoals(); }} user={user} />
    </div>
  );
};

export default Metas;
