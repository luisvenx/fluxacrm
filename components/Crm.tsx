
import React, { useState, useEffect } from 'react';
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
  ArrowDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Crm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  
  // Dashboard Data State
  const [data, setData] = useState({
    potentialValue: 0,
    contactToMeeting: 0,
    closingRate: 0,
    leadsCount: 0,
    contactedCount: 0,
    meetingsScheduled: 0,
    meetingsDone: 0,
    noShow: 0,
    closings: 0,
    funnel: {
      lead: 0,
      contato: 0,
      reuniao: 0,
      proposta: 0,
      fechado: 0
    },
    ranking: [] as any[]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: leads, error } = await supabase.from('leads').select('*');
      if (error) throw error;

      if (leads) {
        // 1. Funnel Aggregation
        const funnel = leads.reduce((acc: any, lead: any) => {
          const stage = lead.stage?.toLowerCase();
          if (acc[stage] !== undefined) acc[stage]++;
          return acc;
        }, { lead: 0, contato: 0, reuniao: 0, proposta: 0, fechado: 0 });

        // 2. High Level Metrics
        const potential = leads
          .filter(l => l.status !== 'LOST' && l.stage !== 'fechado')
          .reduce((acc, l) => acc + (Number(l.value) || 0), 0);

        const convContactMeeting = funnel.contato > 0 ? (funnel.reuniao / funnel.contato) * 100 : 0;
        const closingRate = leads.length > 0 ? (funnel.fechado / leads.length) * 100 : 0;

        // 3. Ranking Generation
        const reps = ['Gabriel Dantras', 'Kyros', 'Luis Venx', 'Lucca Hurtado'];
        const ranking = reps.map(name => ({
          name,
          initials: name.split(' ').map(n => n[0]).join(''),
          value: leads.filter(l => l.assigned_to?.includes(name) && l.stage === 'fechado').length
        })).sort((a, b) => b.value - a.value);

        setData({
          potentialValue: potential,
          contactToMeeting: convContactMeeting,
          closingRate: closingRate,
          leadsCount: leads.length,
          contactedCount: funnel.contato + funnel.reuniao + funnel.proposta + funnel.fechado,
          meetingsScheduled: funnel.reuniao + funnel.proposta + funnel.fechado,
          meetingsDone: funnel.proposta + funnel.fechado,
          noShow: 0, // Dado não mapeado no schema atual
          closings: funnel.fechado,
          funnel,
          ranking
        });
      }
    } catch (err) {
      console.error('Erro ao processar dados CRM:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Dashboard Comercial...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-20 animate-in fade-in duration-700">
      
      {/* Header & Filter Bar */}
      <div className="px-8 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Comercial</h1>
          <p className="text-sm text-slate-400 font-medium">Acompanhe a performance do time comercial</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
             <Calendar size={14} className="text-slate-400 mx-3" />
             {['Hoje', 'Esta Semana', 'Este Mês', 'Este Trimestre', 'Este Ano'].map(p => (
               <button 
                key={p} 
                onClick={() => setActivePeriod(p)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activePeriod === p ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
               >
                 {p}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="bg-white border border-slate-200 rounded-lg py-2 px-4 text-[11px] font-bold text-slate-600 appearance-none pr-10 shadow-sm">
                <option>Todos os Squads</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            </div>
            <div className="relative">
              <select className="bg-white border border-slate-200 rounded-lg py-2 px-4 text-[11px] font-bold text-slate-600 appearance-none pr-10 shadow-sm">
                <option>Todos os Membros</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 mt-8 space-y-6">
        
        {/* Main 3 KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Valor Potencial Total</span>
                <Info size={12} className="text-slate-200" />
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={20}/></div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(data.potentialValue)}</h3>
            <p className="text-[11px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <ArrowUpRight size={14} /> +100.0% <span className="text-slate-300 ml-1">em pipeline ativo</span>
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">Taxa Contato → Reunião</span>
                <Info size={12} className="text-slate-200" />
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl"><TrendingUp size={20}/></div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{data.contactToMeeting.toFixed(0)}%</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-2">
              — 0.0% <span className="ml-1 font-medium">0 de 0 leads</span>
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Fechamento</span>
                <Info size={12} className="text-slate-200" />
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl shadow-sm shadow-rose-100"><Target size={20}/></div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{data.closingRate.toFixed(0)}%</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-2">
              — 0.0% <span className="ml-1 font-medium">0 de {data.leadsCount} leads</span>
            </p>
          </div>
        </div>

        {/* Activity Row - 6 Mini Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Leads Prospectados', val: data.leadsCount, icon: <Users size={14}/>, color: 'blue' },
            { label: 'Leads Contatados', val: data.contactedCount, icon: <UserCheck size={14}/>, color: 'blue' },
            { label: 'Reuniões Marcadas', val: data.meetingsScheduled, icon: <CalendarDays size={14}/>, color: 'blue' },
            { label: 'Reuniões Realizadas', val: data.meetingsDone, icon: <CheckCircle2 size={14}/>, color: 'blue' },
            { label: 'No-show', val: data.noShow, icon: <UserPlus size={14}/>, color: 'blue' },
            { label: 'Fechamentos', val: data.closings, icon: <Trophy size={14}/>, color: 'blue' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm group hover:border-blue-100 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{item.label}</span>
                <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity">{item.icon}</div>
              </div>
              <p className="text-2xl font-black text-slate-900">{item.val}</p>
              <p className="text-[9px] text-slate-300 font-bold mt-1">~ 0.0% vs ant.</p>
            </div>
          ))}
        </div>

        {/* Funnel & Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Visual Funnel Column */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Funil de Conversão</h4>
            
            <div className="space-y-6 relative">
              {[
                { label: 'Lead', count: data.funnel.lead, color: 'bg-blue-400' },
                { label: 'Contato Iniciado', count: data.funnel.contato, color: 'bg-blue-600' },
                { label: 'Reunião Marcada', count: data.funnel.reuniao, color: 'bg-purple-500' },
                { label: 'Proposta Enviada', count: data.funnel.proposta, color: 'bg-rose-400' },
                { label: 'Fechado', count: data.funnel.fechado, color: 'bg-emerald-500' },
              ].map((step, i) => {
                const perc = data.leadsCount > 0 ? (step.count / data.leadsCount) * 100 : 0;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.label}</span>
                      <span className="text-xs font-bold text-slate-900">{step.count} <span className="text-[10px] text-slate-300 font-medium ml-1">({perc.toFixed(0)}%)</span></span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded-lg overflow-hidden">
                      <div className={`h-full ${step.color} transition-all duration-1000 shadow-sm`} style={{ width: `${perc}%` }}></div>
                    </div>
                    {i < 4 && (
                      <div className="flex justify-center py-1 opacity-20">
                         <ArrowDown size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle Analytics Canvas */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col min-h-[220px]">
               <div className="flex items-center gap-2 mb-8">
                  <div className="w-5 h-5 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <Target size={12}/>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Progresso de Metas</h4>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Nenhuma meta ativa no período</p>
               </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm min-h-[300px]">
               <div className="flex justify-between items-center mb-10">
                 <h4 className="text-sm font-bold text-slate-800">Evolução de Atividades</h4>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Leads Criados</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Reuniões Marcadas</span>
                    </div>
                 </div>
               </div>
               <div className="h-40 w-full relative flex items-end justify-between px-2">
                  {/* Grid Mock */}
                  <div className="absolute inset-0 flex flex-col justify-between opacity-5 py-1">
                    {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-900 border-dashed"></div>)}
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <TrendingUp size={40} className="text-slate-100" />
                  </div>
               </div>
               <div className="flex justify-between mt-4 px-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
               </div>
            </div>
          </div>

          {/* Right Sidebar - Rankings & Conv */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Ranking de Fechamentos</h4>
               <div className="space-y-4">
                  {data.ranking.map((rep, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className={`w-3 flex justify-center text-[10px] font-black ${i === 0 ? 'text-amber-500' : 'text-slate-300'}`}>{i+1}</div>
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all">{rep.initials}</div>
                          <span className="text-xs font-bold text-slate-600">{rep.name}</span>
                          {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>}
                       </div>
                       <span className="text-sm font-black text-slate-900">{rep.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Taxas de Conversão</h4>
               <div className="space-y-5">
                  <div className="relative border-l border-b border-slate-50 ml-4 h-48 flex items-end justify-center">
                     {/* Empty State visual graph */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <BarChart3 size={100} />
                     </div>
                     <p className="text-[8px] text-slate-300 font-black uppercase text-center pb-4 tracking-[0.2em]">Processando performance de cohort...</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Alerts & Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm min-h-[250px] flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                 <AlertCircle size={14} className="text-amber-500"/>
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Alertas</h4>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={24} />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold text-slate-800">Tudo em ordem!</h5>
                    <p className="text-xs text-slate-400">Nenhum alerta crítico no momento</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col min-h-[250px]">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-500"/>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Briefing do Time</h4>
                 </div>
                 <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-tighter hover:bg-slate-100 transition-all">
                   <RefreshCcw size={10} /> Gerar
                 </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-sm">
                    <Sparkles size={28} />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold text-slate-800">Resumo com IA</h5>
                    <p className="text-xs text-slate-400 max-w-[280px]">Gere um resumo inteligente do desempenho do time baseado no pipeline atual.</p>
                 </div>
                 <button className="bg-blue-600 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all">
                    <Zap size={14} /> Gerar Briefing
                 </button>
              </div>
           </div>
        </div>

      </div>

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-[100]">
          <Loader2 size={16} className="animate-spin text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Leads...</span>
        </div>
      )}
    </div>
  );
};

export default Crm;
