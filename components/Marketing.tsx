
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  Target, 
  Zap, 
  Globe, 
  Instagram, 
  Linkedin,
  Loader2,
  Database,
  RefreshCcw,
  ArrowUpRight,
  AlertCircle,
  ChevronDown,
  // Added LayoutGrid to fix 'Cannot find name' error
  LayoutGrid
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MarketingProps {
  user: any;
}

const Marketing: React.FC<MarketingProps> = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMarketingData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('marketing_tasks').select('*').eq('user_id', user.id);
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Erro ao carregar marketing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, [user]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.stage === 'live').length;
    const inProd = tasks.filter(t => t.stage === 'prod' || t.stage === 'review').length;

    return [
      { label: 'Projetos', value: total.toString(), trend: 'Ativos', icon: <Globe size={18} /> },
      { label: 'Publicados', value: completed.toString(), trend: 'Status Live', icon: <Target size={18} /> },
      { label: 'Em Produção', value: inProd.toString(), trend: 'Work-in-progress', icon: <Zap size={18} /> },
      { label: 'Taxa de Entrega', value: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%', trend: 'Performance', icon: <Share2 size={18} /> },
    ];
  }, [tasks]);

  const kanbanStages = useMemo(() => {
    const stages = [
      { id: 'idea', name: 'Ideação', color: 'bg-slate-300' },
      { id: 'prod', name: 'Produção', color: 'bg-[#01223d]' },
      { id: 'review', name: 'Revisão', color: 'bg-[#b4a183]' },
      { id: 'sched', name: 'Agendado', color: 'bg-slate-900' },
      { id: 'live', name: 'Publicado', color: 'bg-emerald-600' },
    ];

    const total = tasks.length || 1;
    return stages.map(s => ({
      ...s,
      count: tasks.filter(t => t.stage === s.id).length,
      perc: (tasks.filter(t => t.stage === s.id).length / total) * 100
    }));
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
        <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Auditando Marketing...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-10 px-6 md:px-10 pt-8 font-['Inter']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-[#01223d] rounded-xl flex items-center justify-center text-[#b4a183] shadow-lg shrink-0 border border-slate-700">
             <Megaphone size={24} />
           </div>
           <div>
             <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Marketing <span className="text-[#01223d] not-italic">Intelligence</span>
             </h2>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Análise tática de conteúdo e presença digital SQL</p>
           </div>
        </div>
        <button onClick={fetchMarketingData} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
          <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 bg-slate-50 text-[#01223d] rounded-lg border border-slate-100 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{stat.value}</h3>
            <p className="text-[10px] text-[#b4a183] font-black uppercase tracking-widest mt-4">{stat.trend}</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-[#b4a183]"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Fluxo de <span className="text-[#01223d] not-italic">Produção</span></h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status de execução por estágio</p>
            </div>
            <LayoutGrid size={18} className="text-slate-100" />
          </div>
          
          <div className="space-y-10">
            {kanbanStages.map((stage, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-3">
                     <div className={`w-2 h-2 ${stage.color} rounded-full`}></div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stage.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 italic">{stage.count} <span className="text-[9px] text-slate-300 not-italic ml-1">tarefas</span></span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div 
                    className={`h-full ${stage.color} rounded-full transition-all duration-1000 shadow-sm`} 
                    style={{ width: `${stage.perc}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#01223d] p-10 rounded-xl shadow-2xl text-white relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="relative z-10">
                 <Sparkles size={32} className="text-[#b4a183] mb-6 group-hover:rotate-12 transition-transform" />
                 <h4 className="text-xl font-black uppercase tracking-tight italic mb-3">Relatório AI</h4>
                 <p className="text-xs text-white/50 font-medium leading-relaxed">
                   Baseado nas {tasks.length} tarefas atuais, sua equipe de marketing está com maior concentração na fase de **Produção**.
                 </p>
              </div>
              <button className="mt-8 bg-white text-[#01223d] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b4a183] hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 relative z-10">
                 <Zap size={14} fill="currentColor" /> Analisar Performance
              </button>
              <Megaphone size={180} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform pointer-events-none" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
