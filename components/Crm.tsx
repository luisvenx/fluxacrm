
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
  UserPlus,
  Loader2,
  Database,
  BarChart3,
  CalendarDays,
  UserCheck,
  Zap,
  Info,
  RefreshCcw,
  ArrowDown,
  ChevronRight,
  CheckCircle2
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

    // Gerar Ranking Agregado
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

    // Alertas de Metas
    const alerts = goals.filter(g => {
      const p = (g.current_value / g.target_value) * 100;
      return p < (g.alert_threshold || 80);
    }).map(g => ({
      title: `Meta em risco: ${g.title}`,
      prog: `${((g.current_value / g.target_value) * 100).toFixed(0)}%`,
      exp: `${g.alert_threshold}%`
    }));

    // Evolução de Atividades (Últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const chartData = last7Days.map(date => {
      const leadsOnDay = leads.filter(l => l.created_at?.startsWith(date)).length;
      return { date, count: leadsOnDay };
    });

    // Calcular máximo para escala do gráfico
    const maxLeads = Math.max(...chartData.map(d => d.count), 1);

    return {
      totalLeads,
      potentialValue,
      contactToMeetingRate,
      closingRate,
      contacted,
      meetings,
      closings,
      stages,
      ranking: sortedRanking,
      alerts,
      chartData,
      maxLeads
    };
  }, [leads, goals]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Processando Engine Comercial SQL...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700">
      
      {/* Row 1: Header & Control Bar */}
      <div className="px-4 md:px-8 pt-6 md:pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Performance Comercial</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Insights táticos baseados em dados reais do banco</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
             <Calendar size={14} className="text-slate-400 mx-3 shrink-0" />
             <div className="flex gap-1">
               {['Mês', 'Tri', 'Ano'].map(p => (
                 <button 
                  key={p} 
                  onClick={() => setActivePeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${activePeriod === p ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
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
        
        {/* Row 2: Key KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-blue-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Potencial Total</h4>
                   <Info size={12} className="text-slate-200" />
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 transition-transform group-hover:scale-110">
                   <DollarSign size={20} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(metrics.potentialValue)}</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.totalLeads} leads em prospecção</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 opacity-5 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-indigo-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa Contato → Reunião</h4>
                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100 transition-transform group-hover:scale-110">
                   <TrendingUp size={20} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metrics.contactToMeetingRate}%</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.meetings} reuniões de {metrics.contacted} contatos</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-indigo-600 opacity-5 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm group hover:border-emerald-500 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Fechamento</h4>
                <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl border border-emerald-100 transition-transform group-hover:scale-110">
                   <Target size={20} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metrics.closingRate}%</h3>
             <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">{metrics.closings} de {metrics.totalLeads} leads fechados</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-600 opacity-5 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Row 3: Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Leads Prospectados', val: metrics.totalLeads, icon: <Users size={16}/> },
            { label: 'Leads Contatados', val: metrics.contacted, icon: <UserCheck size={16}/> },
            { label: 'Reuniões Marcadas', val: metrics.meetings, icon: <CalendarDays size={16}/> },
            { label: 'Reuniões Realizadas', val: metrics.closings, icon: <Calendar size={16}/> }, // Simplificado para fins de dashboard
            { label: 'No-show', val: 0, icon: <UserPlus size={16}/> }, // Dependeria de log de agenda
            { label: 'Fechamentos', val: metrics.closings, icon: <Trophy size={16}/> },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-tight max-w-[80px]">{item.label}</span>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">{item.icon}</div>
              </div>
              <p className="text-xl font-black text-slate-900">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Row 4: Funnel, Goals & Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Real Conversion Funnel */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Funil de Conversão Real</h4>
            <div className="space-y-6 flex-1">
              {[
                { label: 'Lead', count: metrics.stages.lead, color: 'bg-blue-500', perc: metrics.totalLeads > 0 ? (metrics.stages.lead / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Contato Iniciado', count: metrics.stages.contato, color: 'bg-indigo-500', perc: metrics.totalLeads > 0 ? (metrics.stages.contato / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Reunião Marcada', count: metrics.stages.reuniao, color: 'bg-purple-500', perc: metrics.totalLeads > 0 ? (metrics.stages.reuniao / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
                { label: 'Proposta Enviada', count: metrics.stages.proposta, color: 'bg-rose-400', perc: metrics.totalLeads > 0 ? (metrics.stages.proposta / metrics.totalLeads * 100).toFixed(0) + '%' : '0%' },
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

          {/* OKR Progress */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Progresso de Metas</h4>
            <div className="space-y-10 flex-1">
              {goals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <Target size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Sem metas configuradas para esta conta</p>
                </div>
              ) : goals.slice(0, 3).map((goal, i) => {
                const perc = Math.min((goal.current_value / goal.target_value) * 100, 100);
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 uppercase">{goal.title}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{goal.current_value} / {goal.target_value} ({goal.metric})</p>
                      </div>
                      <div className="text-right">
                         <span className={`text-lg font-black ${perc >= 80 ? 'text-emerald-500' : 'text-blue-600'}`}>{perc.toFixed(1)}%</span>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1 justify-end">
                           <Clock size={10} /> {goal.period}
                         </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className={`h-full transition-all duration-1000 ${perc >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'}`} style={{ width: `${perc}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ranking */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
             <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Ranking Performance</h4>
             <div className="space-y-4 flex-1">
                {metrics.ranking.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <Trophy size={40} />
                    <p className="text-[9px] font-black uppercase mt-4">Aguardando fechamentos</p>
                  </div>
                ) : metrics.ranking.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black italic shadow-sm group-hover:scale-105 transition-transform">{item.initials}</div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-emerald-500"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[80px]">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.count}</span>
                  </div>
                ))}
             </div>
             <button className="mt-8 w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all">Relatório Completo</button>
          </div>
        </div>

        {/* Row 5: Alerts, Activity Chart & AI Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          
          {/* Critical Alerts */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-500" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Alertas Críticos</h4>
              </div>
              <span className="w-6 h-6 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center text-[10px] font-black border border-rose-100">{metrics.alerts.length}</span>
            </div>

            <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[350px]">
              {metrics.alerts.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Tudo em conformidade</p>
                </div>
              ) : metrics.alerts.map((alert, i) => (
                <div key={i} className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5 hover:bg-rose-50 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                           <Target size={12} strokeWidth={3} />
                        </div>
                        <div>
                           <p className="text-[11px] font-bold text-slate-800 leading-snug">{alert.title}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-1">Progresso {alert.prog} vs esperado {alert.exp}</p>
                           <span className="inline-block mt-2 text-[8px] font-black bg-rose-500 text-white px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm shadow-rose-200">Meta em Risco</span>
                        </div>
                     </div>
                     <ChevronRight size={16} className="text-rose-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Evolution (Dynamic Chart from Database) */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-tight">Evolução de Atividades (Leads Criados)</h4>
            
            <div className="flex-1 relative flex flex-col">
               <div className="absolute left-0 top-0 bottom-10 w-8 flex flex-col justify-between text-[9px] font-black text-slate-300">
                  <span>{Math.ceil(metrics.maxLeads)}</span>
                  <span>{Math.ceil(metrics.maxLeads * 0.75)}</span>
                  <span>{Math.ceil(metrics.maxLeads * 0.5)}</span>
                  <span>{Math.ceil(metrics.maxLeads * 0.25)}</span>
                  <span>0</span>
               </div>
               
               <div className="flex-1 ml-10 mb-10 relative border-l border-b border-slate-50">
                  <div className="absolute inset-0 flex flex-col justify-between opacity-50">
                     {[0, 1, 2, 3].map(i => <div key={i} className="w-full h-px border-t border-slate-100 border-dashed"></div>)}
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                      d={`M ${metrics.chartData.map((d, i) => `${(i / 6) * 100},${100 - (d.count / metrics.maxLeads * 100)}`).join(' L ')}`}
                      fill="none" 
                      stroke="#2563eb" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-xl"
                    />
                    <path 
                      d={`M 0,100 L ${metrics.chartData.map((d, i) => `${(i / 6) * 100},${100 - (d.count / metrics.maxLeads * 100)}`).join(' L ')} L 100,100 Z`}
                      fill="url(#blueGradient)" 
                      className="opacity-10"
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="white" opacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
               </div>

               <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[8px] font-black text-slate-300 uppercase px-2">
                  {metrics.chartData.map(d => <span key={d.date}>{d.date.split('-').reverse().slice(0, 2).join('/')}</span>)}
               </div>
            </div>

            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leads Criados SQL</span>
               </div>
            </div>
          </div>

          {/* AI Briefing Card */}
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="bg-[#002147] rounded-[2rem] p-8 shadow-xl relative group overflow-hidden flex flex-col items-center justify-center text-center flex-1">
              <div className="absolute top-4 right-4">
                 <div className="p-1.5 bg-white/10 rounded-lg text-white/30"><Database size={12} /></div>
              </div>
              
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-2xl border border-blue-500/30">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              
              <h5 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Briefing do Time</h5>
              <p className="text-[10px] text-slate-400 font-medium mb-6 uppercase tracking-widest opacity-80">Insights da sua base de dados</p>
              
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-900/50 transition-all active:scale-95 group-hover:scale-105">
                <Zap size={14} fill="currentColor" /> Gerar Briefing
              </button>

              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Persistence Indicator */}
      {!isLoading && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] border border-white/10 animate-in slide-in-from-right duration-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">SQL Live Feed</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-tight">Dashboard Comercial Sincronizado</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crm;
