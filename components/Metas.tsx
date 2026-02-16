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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Metas */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Objetivos <span className="text-blue-600 not-italic">& Resultados</span>
          </h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-4">Monitoramento tático de KPIs e OKRs organizacionais</p>
        </div>

        <button 
          onClick={() => setIsNewGoalModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Configurar Meta
        </button>
      </div>

      {/* KPI Row */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between h-40 group hover:border-blue-100 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atingimento Médio</p>
            <div className="flex items-end justify-between">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{avgAtingimento}%</h3>
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
               </div>
            </div>
         </div>
         <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between h-40">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metas em Ciclo</p>
            <div className="flex items-end justify-between">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{goals.length}</h3>
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Target size={20} />
               </div>
            </div>
         </div>
         <div className="bg-[#203267] p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between h-40 relative overflow-hidden group">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Meta Master</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">Active</h3>
               {/* Fix: Added missing Sparkles import to lucide-react list above */}
               <Sparkles size={24} className="text-blue-400 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Target size={150} />
            </div>
         </div>
      </div>

      {/* Tabs Filter */}
      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm mb-10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['Empresa', 'Individuais', 'Squads'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as any)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all min-w-[120px] border ${
                activeTab === tab.toLowerCase() ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculando Execução...</p></div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-24 text-center opacity-30">
           <Database size={48} className="mx-auto mb-4" />
           <p className="text-sm font-black uppercase tracking-widest">Nenhuma meta configurada neste nível</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredGoals.map((goal) => {
            const perc = Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100);
            return (
              <div key={goal.id} className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col justify-between min-h-[300px] relative overflow-hidden">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-md border border-blue-100">{goal.metric}</span>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mt-4 leading-none">{goal.title}</h4>
                    </div>
                    <div className={`p-4 rounded-2xl border-2 transition-all ${perc >= 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-200 border-slate-100'}`}>
                      <Trophy size={28} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Execução Real</span>
                       <span className="text-3xl font-black text-slate-900 tracking-tighter italic">
                         {goal.current_value} <span className="text-slate-200 not-italic mx-2">/</span> <span className="text-slate-300">{goal.target_value}</span>
                       </span>
                    </div>
                    <div className="text-right">
                       <span className={`text-xl font-black ${perc >= 100 ? 'text-emerald-500' : 'text-blue-600'}`}>{perc.toFixed(1)}%</span>
                       <p className="text-[9px] text-slate-300 font-bold uppercase flex items-center gap-1 mt-1 justify-end"><Clock size={10}/> Ciclo {goal.period}</p>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div 
                      className={`h-full transition-all duration-[2000ms] rounded-full shadow-lg ${perc >= 100 ? 'bg-emerald-500 shadow-emerald-200' : 'bg-blue-600 shadow-blue-200'}`} 
                      style={{ width: `${perc}%` }}
                    ></div>
                  </div>
                </div>
                {/* Visual bar footer */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-blue-600"></div>
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
