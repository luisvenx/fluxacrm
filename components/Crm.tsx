
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
  CalendarDays,
  Info,
  RefreshCcw,
  ArrowDown,
  ChevronRight,
  Zap
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
  
  const fetchData = async () => {
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
    fetchData();
  }, [user]);

  // Lógica de Processamento de Dados
  const dashboardData = useMemo(() => {
    const totalLeads = leads.length;
    const potentialValue = leads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    
    // Contagens por Etapa
    const stages = {
      lead: leads.filter(l => l.stage === 'lead').length,
      contato: leads.filter(l => l.stage === 'qualificacao' || l.stage === 'contato').length,
      reuniao: leads.filter(l => l.stage === 'reuniao').length,
      proposta: leads.filter(l => l.stage === 'proposta').length,
      fechado: leads.filter(l => l.stage === 'fechado').length
    };

    // Taxas de Conversão
    const contactedLeads = totalLeads - stages.lead;
    const contactRate = contactedLeads > 0 ? Math.round((stages.reuniao / contactedLeads) * 100) : 0;
    const closingRate = totalLeads > 0 ? Math.round((stages.fechado / totalLeads) * 100) : 0;

    // Ranking (Agrupado por Corretor)
    const rankingMap: Record<string, number> = {};
    leads.filter(l => l.stage === 'fechado').forEach(l => {
      const name = l.assigned_to || 'Sem Atribuição';
      rankingMap[name] = (rankingMap[name] || 0) + 1;
    });
    const ranking = Object.entries(rankingMap)
      .map(([name, val]) => ({ name, val, initial: name.substring(0, 2).toUpperCase() }))
      .sort((a, b) => b.val - a.val);

    // Alertas de Metas em Risco
    const now = new Date();
    const alerts = goals.filter(g => {
      const start = new Date(g.start_date);
      const end = new Date(g.end_date);
      const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      const daysPassed = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);
      const expectedProgress = Math.max(0, (daysPassed / totalDays) * 100);
      const currentProgress = (Number(g.current_value) / Number(g.target_value)) * 100;
      
      return currentProgress < (expectedProgress * 0.8) && g.status === 'Active';
    }).map(g => {
      const start = new Date(g.start_date);
      const end = new Date(g.end_date);
      const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      const daysPassed = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);
      return {
        title: `Meta em risco: ${g.title}`,
        desc: `Progresso ${(Number(g.current_value)/Number(g.target_value)*100).toFixed(0)}% vs esperado ${((daysPassed/totalDays)*100).toFixed(0)}%`
      };
    });

    // Dados do Gráfico de Atividades (Últimos 30 dias)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    const chartPoints = last30Days.map(date => ({
      date: date.split('-').reverse().slice(0, 2).join('/'),
      leads: leads.filter(l => l.created_at?.startsWith(date)).length,
      meetings: leads.filter(l => l.stage === 'reuniao' && l.updated_at?.startsWith(date)).length
    }));

    return {
      totalLeads,
      potentialValue,
      contactRate,
      closingRate,
      stages,
      ranking,
      alerts,
      chartPoints,
      goals
    };
  }, [leads, goals]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Processando Dados do Supabase...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700 relative overflow-hidden font-['Inter']">
      
      {/* HEADER SECTION */}
      <div className="px-6 md:px-10 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Dashboard Comercial</h1>
          <p className="text-sm text-slate-400 font-medium">Acompanhe a performance do time comercial em tempo real</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm mr-4">
             <div className="p-2 text-slate-400 border-r border-slate-100 mr-1"><Calendar size={14} /></div>
             {['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'].map(p => (
               <button 
                key={p} 
                onClick={() => setActivePeriod(p)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${activePeriod === p ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {p}
               </button>
             ))}
          </div>
          <button onClick={fetchData} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
             <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 space-y-6">
        
        {/* TOP KPI ROW (TIER 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex justify-between items-start group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Potencial Total</span>
                <Info size={14} className="text-slate-200 cursor-help" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(dashboardData.potentialValue)}</h3>
              <p className="text-[10px] font-medium text-slate-400">Total acumulado em pipeline</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#01223d] shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <DollarSign size={20} />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex justify-between items-start group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa Contato → Reunião</span>
                <Info size={14} className="text-slate-200 cursor-help" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{dashboardData.contactRate}%</h3>
              <p className="text-[10px] font-medium text-slate-400">Eficiência de agendamento</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#01223d] shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex justify-between items-start group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Fechamento</span>
                <Info size={14} className="text-slate-200 cursor-help" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{dashboardData.closingRate}%</h3>
              <p className="text-[10px] font-medium text-slate-400">Conversão final de vendas</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#b4a183] shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Target size={20} />
            </div>
          </div>
        </div>

        {/* VOLUME KPI ROW (TIER 2) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Leads Base', val: dashboardData.totalLeads, icon: <Users size={14}/> },
            { label: 'Qualificados', val: dashboardData.stages.contato, icon: <UserPlus size={14}/> },
            { label: 'Reuniões', val: dashboardData.stages.reuniao, icon: <Calendar size={14}/> },
            { label: 'Propostas', val: dashboardData.stages.proposta, icon: <CalendarDays size={14}/> },
            { label: 'No-show', val: '0', icon: <Users size={14}/> }, 
            { label: 'Fechamentos', val: dashboardData.stages.fechado, icon: <Trophy size={14}/> },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm group hover:border-[#b4a183] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{kpi.label}</span>
                <div className="p-1.5 bg-slate-50 text-[#01223d] rounded-lg">{kpi.icon}</div>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-1">{kpi.val}</h4>
              <p className="text-[8px] font-bold text-slate-300 uppercase">Auditado SQL</p>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          
          {/* COLUNA ESQUERDA - FUNIL + ALERTAS */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
               <h4 className="text-[13px] font-bold text-slate-900 mb-6 uppercase tracking-widest">Funil de Conversão</h4>
               <div className="space-y-6">
                  {[
                    { label: 'Lead', count: dashboardData.totalLeads, perc: '100%', color: 'bg-[#01223d]' },
                    { label: 'Qualificação', count: dashboardData.stages.contato, perc: dashboardData.totalLeads > 0 ? `${(dashboardData.stages.contato/dashboardData.totalLeads*100).toFixed(0)}%` : '0%', color: 'bg-[#0a3556]' },
                    { label: 'Reunião Marcada', count: dashboardData.stages.reuniao, perc: dashboardData.totalLeads > 0 ? `${(dashboardData.stages.reuniao/dashboardData.totalLeads*100).toFixed(0)}%` : '0%', color: 'bg-[#b4a183]' },
                    { label: 'Proposta Enviada', count: dashboardData.stages.proposta, perc: dashboardData.totalLeads > 0 ? `${(dashboardData.stages.proposta/dashboardData.totalLeads*100).toFixed(0)}%` : '0%', color: 'bg-[#01223d]/50' },
                    { label: 'Fechado', count: dashboardData.stages.fechado, perc: dashboardData.totalLeads > 0 ? `${(dashboardData.stages.fechado/dashboardData.totalLeads*100).toFixed(0)}%` : '0%', color: 'bg-emerald-600' },
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{step.label}</span>
                        <div className="flex items-center gap-1.5">
                           <span className="text-[11px] font-black text-slate-900">{step.count}</span>
                           <span className="text-[9px] font-bold text-slate-300">({step.perc})</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div className={`h-full ${step.color} transition-all duration-1000`} style={{ width: step.perc }}></div>
                      </div>
                      {i < 4 && (
                        <div className="flex justify-center py-1 opacity-20">
                           <ArrowDown size={10} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-[#b4a183]" />
                    <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">Alertas</h4>
                 </div>
                 <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-md">{dashboardData.alerts.length}</span>
               </div>

               <div className="space-y-3">
                  {dashboardData.alerts.length === 0 ? (
                    <p className="text-[10px] text-slate-300 font-bold uppercase text-center py-4">Sem alertas de metas</p>
                  ) : dashboardData.alerts.map((alert, idx) => (
                    <div key={idx} className="bg-rose-50/50 border-l-4 border-rose-400 p-4 rounded-r-lg group cursor-pointer hover:bg-rose-50 transition-all relative">
                       <h5 className="text-[11px] font-bold text-slate-800 line-clamp-1 pr-4">{alert.title}</h5>
                       <p className="text-[10px] text-slate-400 mt-1">{alert.desc}</p>
                       <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-rose-500 transition-colors" />
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* COLUNA CENTRAL - PROGRESSO DE METAS + EVOLUÇÃO ATIVIDADES */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
               <div className="flex items-center gap-2 mb-8">
                  <div className="p-1.5 bg-slate-50 text-[#01223d] rounded-lg"><Target size={18} /></div>
                  <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">Progresso de Metas Estratégicas</h4>
               </div>

               <div className="space-y-10">
                  {dashboardData.goals.length === 0 ? (
                    <div className="py-10 text-center opacity-30">
                       <Target size={40} className="mx-auto mb-2" />
                       <p className="text-xs font-black uppercase tracking-widest">Nenhuma meta configurada</p>
                    </div>
                  ) : dashboardData.goals.slice(0, 3).map((goal, idx) => {
                    const perc = Math.min(100, (Number(goal.current_value) / Number(goal.target_value)) * 100);
                    return (
                      <div key={idx} className="space-y-3">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{goal.scope} SQL Node</span>
                         <div className="flex justify-between items-end">
                            <div className="space-y-1">
                               <p className="text-sm font-bold text-slate-800 uppercase tracking-tight italic">{goal.title}</p>
                               <p className="text-[10px] text-slate-400 font-medium">{goal.current_value} / {goal.target_value}</p>
                            </div>
                            <div className="text-right">
                               <span className={`text-sm font-black ${perc >= 100 ? 'text-emerald-500' : 'text-[#01223d]'}`}>{perc.toFixed(1)}%</span>
                               <p className="text-[9px] text-slate-300 font-bold uppercase flex items-center gap-1 mt-0.5 justify-end"><Clock size={10}/> Ativo</p>
                            </div>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className={`h-full transition-all duration-[2000ms] ${perc >= 100 ? 'bg-emerald-500' : 'bg-[#01223d]'}`} style={{ width: `${perc}%` }}></div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
               <h4 className="text-[13px] font-bold text-slate-900 mb-8 uppercase tracking-widest">Evolução de Atividades (30d)</h4>
               <div className="h-64 relative flex items-end justify-between px-2">
                  {dashboardData.chartPoints.map((p, i) => {
                    const max = Math.max(...dashboardData.chartPoints.map(p => p.leads), 1);
                    const h = (p.leads / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                         <div className="absolute bottom-full mb-2 bg-[#01223d] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{p.leads} leads</div>
                         <div 
                           className="w-1.5 bg-[#01223d] rounded-t-full transition-all duration-1000 group-hover:bg-[#b4a183] shadow-sm" 
                           style={{ height: `${h}%` }}
                         ></div>
                      </div>
                    );
                  })}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-100"></div>
               </div>
               <div className="flex justify-between px-2 mt-4 text-[9px] font-bold text-slate-300 uppercase">
                  <span>{dashboardData.chartPoints[0].date}</span>
                  <span>{dashboardData.chartPoints[15].date}</span>
                  <span>{dashboardData.chartPoints[29].date}</span>
               </div>
            </div>
          </div>

          {/* COLUNA DIREITA - RANKING + TAXAS + BRIEFING */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                <h4 className="text-[13px] font-bold text-slate-900 mb-6 uppercase tracking-widest">Top Performers</h4>
                <div className="space-y-2">
                   {dashboardData.ranking.length === 0 ? (
                     <p className="text-[10px] text-slate-300 font-bold uppercase text-center py-6">Sem dados de vendas</p>
                   ) : dashboardData.ranking.slice(0, 5).map((member, i) => (
                     <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                        <div className="flex items-center gap-4">
                           <span className="text-[11px] font-black text-slate-400 w-4">{i + 1}</span>
                           <div className={`w-8 h-8 rounded-lg bg-[#01223d] flex items-center justify-center text-[10px] font-black text-[#b4a183] border border-slate-700 shadow-sm`}>
                              {member.initial}
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight truncate max-w-[100px]">{member.name}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           </div>
                        </div>
                        <span className="text-sm font-black text-slate-900">{member.val}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm text-center flex flex-col items-center justify-center gap-6 min-h-[350px] relative overflow-hidden group">
                <div className="w-full flex justify-between items-center mb-4 relative z-10">
                   <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#b4a183]" />
                      <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">Briefing AI</h4>
                   </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl text-[#b4a183] mb-2 relative z-10 group-hover:scale-110 transition-transform">
                   <Sparkles size={32} />
                </div>
                <div className="relative z-10">
                   <h5 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight">Relatório de Performance</h5>
                   <p className="text-[11px] text-slate-400 leading-relaxed px-4 font-medium">
                      O agente Gemini analisará seus {dashboardData.totalLeads} leads e {dashboardData.goals.length} metas para sugerir ações de fechamento.
                   </p>
                </div>
                <button className="bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 relative z-10 group/btn">
                   <Zap size={16} fill="#b4a183" className="text-[#b4a183] group-hover/btn:scale-125 transition-transform" /> Gerar Briefing
                </button>
                <div className="absolute -right-10 -bottom-10 opacity-[0.02] group-hover:scale-110 transition-transform">
                   <Target size={200} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crm;
