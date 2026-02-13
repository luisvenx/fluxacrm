
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Users, 
  User, 
  Building2,
  ChevronRight,
  ArrowUpRight,
  Trophy,
  Loader2,
  Database,
  ArrowRight
} from 'lucide-react';
import NewGoalModal from './NewGoalModal';
import { supabase } from '../lib/supabase';

const Metas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'individuais' | 'squads'>('empresa');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('goals').select('*');
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
  }, []);

  const stats = useMemo(() => {
    const active = goals.length;
    const avgProgress = goals.length > 0 
      ? goals.reduce((acc, g) => acc + (Math.min(Number(g.current_value) / Number(g.target_value), 1) * 100), 0) / goals.length 
      : 0;
    
    return [
      { label: 'Metas Ativas', value: active.toString(), subtitle: 'Em processamento', icon: <Target />, color: 'blue' },
      { label: 'Atingimento Médio', value: `${avgProgress.toFixed(1)}%`, subtitle: 'Base SQL Realtime', icon: <TrendingUp />, color: 'emerald' },
      { label: 'Escopo Individual', value: goals.filter(g => g.scope === 'Individual').length.toString(), subtitle: 'Performance pessoal', icon: <User />, color: 'blue' },
      { label: 'Escopo Squads', value: goals.filter(g => g.scope === 'Squad').length.toString(), subtitle: 'Performance coletiva', icon: <Users />, color: 'purple' },
    ];
  }, [goals]);

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: <Building2 size={16} /> },
    { id: 'individuais', label: 'Individuais', icon: <User size={16} /> },
    { id: 'squads', label: 'Squads', icon: <Users size={16} /> },
  ];

  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.scope?.toLowerCase() === activeTab.substring(0, activeTab.length - (activeTab.endsWith('s') ? 1 : 0)).toLowerCase() || 
                       (activeTab === 'empresa' && g.scope === 'Empresa'));
  }, [goals, activeTab]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">OKR Data Engine</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Metas & Performance</h2>
          <p className="text-slate-500 font-medium mt-1">Gestão estratégica de OKRs e objetivos táticos.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Sparkles size={18} className="text-blue-500" /> AI Generator
          </button>
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} /> Nova Meta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon && React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl w-full lg:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando OKRs...</p>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden transition-all hover:border-blue-100">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Trophy size={250} />
          </div>
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 shadow-sm">
              <Target size={40} />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Configure seus objetivos de {activeTab}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Defina metas claras para alinhar seu time. Acompanhe leads criados, reuniões agendadas ou volume de vendas em tempo real.</p>
            </div>
            <button onClick={() => setIsNewGoalModalOpen(true)} className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Criar primeira meta</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const perc = Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100);
            return (
              <div key={goal.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">{goal.metric}</span>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight mt-2 uppercase">{goal.title}</h4>
                    <p className="text-xs text-slate-400 font-medium italic">{goal.period}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-slate-50 ${perc >= 100 ? 'text-emerald-500' : 'text-slate-300'}`}>
                    <CheckCircle2 size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Progresso</span>
                       <span className="text-2xl font-black text-slate-900 tracking-tighter">{goal.current_value} <span className="text-slate-300">/ {goal.target_value}</span></span>
                    </div>
                    <span className="text-sm font-black text-blue-600">{perc.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 shadow-sm ${perc >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewGoalModal isOpen={isNewGoalModalOpen} onClose={() => { setIsNewGoalModalOpen(false); fetchGoals(); }} />
    </div>
  );
};

export default Metas;
