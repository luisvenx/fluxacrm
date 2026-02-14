
import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  Clock, 
  Trophy, 
  AlertCircle, 
  Sparkles, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  UserPlus,
  CheckCircle2,
  Bell,
  Loader2,
  Database,
  BarChart3,
  CalendarDays,
  UserCheck,
  Zap,
  Info,
  RefreshCcw,
  ArrowDown,
  MoreVertical,
  ChevronRight,
  MousePointer2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CrmProps {
  user: any;
}

const Crm: React.FC<CrmProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  const [leads, setLeads] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  
  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [leadsRes, goalsRes] = await Promise.all([
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id)
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados comerciais:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Cálculos de Métricas em tempo real
  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const potentialValue = leads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    
    const stages = {
      lead: leads.filter(l => l.stage === 'lead').length,
      contato: leads.filter(l => l.stage === 'contato' || l.stage === 'qualificacao').length,
      reuniao: leads.filter(l => l.stage === 'reuniao').length,
      proposta: leads.filter(l => l.stage === 'proposta' || l.stage === 'negociacao').length,
      fechado: leads.filter(l => l.stage === 'fechado').length
    };

    const closings = stages.fechado;
    const meetings = stages.reuniao;
    const contacted = totalLeads - stages.lead;

    const contactToMeetingRate = contacted > 0 ? Math.round((meetings / contacted) * 100) : 0;
    const closingRate = totalLeads > 0 ? Math.round((closings / totalLeads) * 100) : 0;

    // Gerar Ranking para o Dashboard
    const rankingData = leads
      .filter(l => l.stage === 'fechado')
      .reduce((acc: any, curr) => {
        const name = curr.assigned_to || 'Sem Atribuição';
        if (!acc[name]) acc[name] = 0;
        acc[name]++;
        return acc;
      }, {});

    const sortedRanking = Object.entries(rankingData)
      .map(([name, count]) => ({ 
        name, 
        count: count as number,
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalLeads,
      potentialValue,
      contactToMeetingRate,
      closingRate,
      contacted,
      meetings,
      closings,
      stages,
      ranking: sortedRanking
    };
  }, [leads]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Consultando Database Comercial...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700">
      
      {/* Header & Filter Bar */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Dashboard de Vendas</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Indicadores baseados na sua conta isolada</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
             <Calendar size={14} className="text-slate-400 mx-3 shrink-0" />
             <div className="flex gap-1">
               {['Mês', 'Tri', 'Ano'].map(p => (
                 <button 
                  key={p} 
                  onClick={() => setActivePeriod(p === 'Mês' ? 'Este Mês' : p)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${activePeriod.includes(p) || activePeriod === p ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   {p}
                 </button>
               ))}
             </div>
          </div>
          <button onClick={fetchDashboardData} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all active:scale-95">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6 md:mt-8 space-y-6">
        
        {/* Row 1: Large KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-blue-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Potencial</h4>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100"><DollarSign size={20} /></div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(metrics.potentialValue)}</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">Volume total em pipeline</p>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-indigo-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Reunião</h4>
                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100"><TrendingUp size={20} /></div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metrics.contactToMeetingRate}%</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.meetings} reuniões de {metrics.contacted} contatos</p>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-emerald-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Fechamento</h4>
                <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl border border-emerald-100"><Target size={20} /></div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metrics.closingRate}%</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.closings} vendas de {metrics.totalLeads} leads</p>
          </div>
        </div>

        {/* Row 2: Secondary Activity Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            { label: 'Prospectados', val: metrics.totalLeads, icon: <Users size={16}/>, color: 'text-blue-500' },
            { label: 'Contatados', val: metrics.contacted, icon: <UserCheck size={16}/>, color: 'text-indigo-500' },
            { label: 'Reuniões', val: metrics.meetings, icon: <CalendarDays size={16}/>, color: 'text-purple-500' },
            { label: 'Fechamentos', val: metrics.closings, icon: <Trophy size={16}/>, color: 'text-emerald-500' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                <div className={`p-1.5 bg-slate-50 ${item.color} rounded-lg`}>{item.icon}</div>
              </div>
              <p className="text-xl font-black text-slate-900">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Row 3: Funnel & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Funil Comercial Real</h4>
            <div className="space-y-6 flex-1">
              {[
                { label: 'Lead', count: metrics.stages.lead, color: 'bg-blue-500', perc: metrics.totalLeads > 0 ? (metrics.stages.lead / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Qualificação/Contato', count: metrics.stages.contato, color: 'bg-indigo-500', perc: metrics.totalLeads > 0 ? (metrics.stages.contato / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Reunião', count: metrics.stages.reuniao, color: 'bg-purple-500', perc: metrics.totalLeads > 0 ? (metrics.stages.reuniao / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Proposta/Negócio', count: metrics.stages.proposta, color: 'bg-rose-400', perc: metrics.totalLeads > 0 ? (metrics.stages.proposta / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Fechado', count: metrics.stages.fechado, color: 'bg-emerald-500', perc: metrics.totalLeads > 0 ? (metrics.stages.fechado / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
              ].map((step, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{step.label}</span>
                    <span className="text-xs font-black text-slate-900">{step.count} <span className="text-slate-300 ml-1">({step.perc})</span></span>
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: step.perc }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Progresso de Metas SQL</h4>
            {goals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                <Target size={40} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhuma meta configurada</p>
              </div>
            ) : (
              <div className="space-y-8">
                {goals.slice(0, 3).map((goal, i) => {
                  const perc = Math.min((goal.current_value / goal.target_value) * 100, 100);
                  return (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <h5 className="text-xs font-bold text-slate-700 uppercase">{goal.title}</h5>
                          <p className="text-[10px] text-slate-400 font-medium">{goal.current_value} / {goal.target_value} ({goal.metric})</p>
                        </div>
                        <span className={`text-lg font-black ${perc >= 80 ? 'text-emerald-500' : 'text-blue-500'}`}>{perc.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div className={`h-full transition-all duration-1000 ${perc >= 80 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${perc}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
             <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Ranking Performance</h4>
             <div className="space-y-4 flex-1">
                {metrics.ranking.length === 0 ? (
                  <p className="text-[10px] font-black text-slate-300 uppercase py-10 text-center">Nenhum fechamento</p>
                ) : (
                  metrics.ranking.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black italic shadow-sm">{item.initials}</div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{item.count}</span>
                    </div>
                  ))
                )}
             </div>
             <button className="mt-8 w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all">Ver Completo</button>
          </div>
        </div>

        {/* Row 4: AI Briefing Section */}
        <div className="pb-10">
          <div className="bg-[#002147] rounded-[2rem] p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Sparkles size={28} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Inteligência Comercial AI</h3>
              <p className="text-slate-400 text-sm max-w-md font-medium">O algoritmo detectou que o seu funil está concentrado na etapa de <span className="text-blue-400 font-bold">Qualificação</span>. Gere um briefing para estratégias de avanço.</p>
            </div>
            
            <button className="relative z-10 flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-900 transition-all active:scale-95">
              <Zap size={18} fill="white" /> Gerar Briefing do Time
            </button>

            <BarChart3 className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 group-hover:scale-110 transition-transform duration-[2000ms]" />
          </div>
        </div>

      </div>

      {!isLoading && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 z-[100] border border-white/10">
          <Database size={14} className="text-blue-400" />
          <span className="text-[9px] font-black uppercase tracking-widest">Base Realtime Sincronizada</span>
        </div>
      )}
    </div>
  );
};

export default Crm;
