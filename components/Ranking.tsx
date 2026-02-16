
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  PhoneCall, 
  CalendarDays, 
  Star, 
  Sparkles,
  Medal,
  TrendingUp,
  Target,
  Loader2,
  Database,
  RefreshCcw,
  LayoutGrid,
  Zap,
  ArrowUpRight,
  MousePointer2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RankingProps {
  user: any;
}

const Ranking: React.FC<RankingProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('Este Mês');

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*').eq('user_id', user.id);
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const rankings = useMemo(() => {
    const grouped: Record<string, { prospects: number, meetings: number, sales: number, value: number }> = {};
    leads.forEach(lead => {
      const rep = lead.assigned_to || 'Sem Atribuição';
      if (!grouped[rep]) grouped[rep] = { prospects: 0, meetings: 0, sales: 0, value: 0 };
      grouped[rep].prospects++;
      if (lead.stage?.toLowerCase() === 'reuniao') grouped[rep].meetings++;
      if (lead.stage?.toLowerCase() === 'fechado') {
        grouped[rep].sales++;
        grouped[rep].value += Number(lead.value) || 0;
      }
    });

    const createRank = (key: 'prospects' | 'meetings' | 'sales') => {
      return Object.entries(grouped)
        .map(([name, stats]) => ({
          name,
          initial: name.substring(0, 2).toUpperCase(),
          value: stats[key]
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
    };

    return {
      prospeccoes: createRank('prospects'),
      reunioes: createRank('meetings'),
      vendas: createRank('sales'),
      myStats: grouped[user?.user_metadata?.full_name] || { prospects: 0, meetings: 0, sales: 0, value: 0 }
    };
  }, [leads, user]);

  const RenderMetricCard = ({ title, icon, items, colorClass }: { title: string, icon: React.ReactNode, items: any[], colorClass: string }) => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col min-h-[450px] hover:shadow-2xl transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 bg-[#01223d] rounded-[1.5rem] flex items-center justify-center text-[#b4a183] border border-slate-700 shadow-lg group-hover:scale-110 transition-transform ${colorClass}`}>
            {icon}
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">{title}</h3>
        </div>
        <TrendingUp size={22} className="text-slate-100" />
      </div>
      
      <div className="space-y-3 flex-1">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4">
            <Database size={64} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest">Aguardando dados</p>
          </div>
        ) : items.slice(0, 5).map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
              idx === 0 ? 'bg-[#01223d] border-[#01223d] text-white shadow-xl scale-[1.03] z-10' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-white hover:border-[#b4a183]'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-xs font-black w-4 ${idx === 0 ? 'text-[#b4a183]' : 'text-slate-300'}`}>{idx + 1}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border ${
                idx === 0 ? 'bg-slate-800 border-slate-700 text-[#b4a183]' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {item.initial}
              </div>
              <span className={`text-xs font-bold uppercase truncate max-w-[140px] ${idx === 0 ? 'text-white italic' : 'text-slate-700'}`}>
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xl font-black tracking-tighter ${idx === 0 ? 'text-[#b4a183]' : 'text-slate-900'}`}>{item.value}</span>
              {idx === 0 ? <Trophy size={16} className="text-[#b4a183] fill-[#b4a183]" /> : <Medal size={16} className="text-slate-200" />}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 bg-[#b4a183]"></div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      {/* Pattern Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Leaderboard <span className="text-[#01223d] not-italic">Realtime</span>
          </h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-4">Ranking de performance e eficiência operacional do time</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
           {['Hoje', 'Este Mês', 'Geral'].map(range => (
             <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
             >
               {range}
             </button>
           ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <RenderMetricCard title="Prospecções" icon={<PhoneCall size={22} />} items={rankings.prospeccoes} colorClass="group-hover:text-[#b4a183]" />
        <RenderMetricCard title="Visitas" icon={<CalendarDays size={22} />} items={rankings.reunioes} colorClass="group-hover:text-[#b4a183]" />
        <RenderMetricCard title="Fechamentos" icon={<Trophy size={22} />} items={rankings.vendas} colorClass="group-hover:text-[#b4a183]" />
      </div>

      {/* Your Stats Footer Area */}
      <div className="relative z-10 bg-[#01223d] rounded-[3rem] p-12 text-white shadow-2xl overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="relative shrink-0">
              <div className="w-32 h-32 bg-white/5 backdrop-blur-md text-[#b4a183] rounded-[2.5rem] flex items-center justify-center text-5xl font-black italic border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-700">
                {(user?.user_metadata?.full_name || 'U').substring(0,1).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#b4a183] border-4 border-[#01223d] rounded-2xl flex items-center justify-center text-[#01223d] text-sm font-black shadow-xl italic">MVP</div>
            </div>

            <div className="flex-1 w-full space-y-10">
              <div>
                <h4 className="text-3xl font-black text-white tracking-tight uppercase italic">{user?.user_metadata?.full_name}</h4>
                <div className="flex items-center gap-3 mt-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b4a183]">Sua Performance Auditada SQL</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Volume em Vendas</p>
                    <p className="text-2xl font-black text-white tracking-tighter italic">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rankings.myStats.value)}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Total Prospecções</p>
                    <p className="text-2xl font-black text-white tracking-tighter italic">{rankings.myStats.prospects}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Eficiência Operacional</p>
                    <p className="text-2xl font-black text-emerald-400 tracking-tighter italic">92.4%</p>
                 </div>
                 <div className="flex items-center justify-end">
                    <button className="bg-white text-[#01223d] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b4a183] hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2">
                       <Zap size={14} fill="currentColor" /> Gerar Report AI
                    </button>
                 </div>
              </div>
            </div>
          </div>
          <Target size={300} className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none" />
      </div>
    </div>
  );
};

export default Ranking;
