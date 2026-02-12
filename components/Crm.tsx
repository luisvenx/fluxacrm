
import React, { useState } from 'react';
import { 
  ChevronDown, 
  Calendar, 
  TrendingUp, 
  Target, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  CalendarDays, 
  UserX, 
  Trophy,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Sparkles,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter
} from 'lucide-react';

const Crm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');
  const periods = ['Hoje', 'Semana', 'Mês', 'Ano'];

  const ranking = [
    { name: 'Gabriel Dantras', initial: 'GD', value: 12, status: 'green', val: 'R$ 45.000' },
    { name: 'Kyros Financial', initial: 'K', value: 9, status: 'blue', val: 'R$ 38.200' },
    { name: 'Luis Venx', initial: 'LV', value: 7, status: 'emerald', val: 'R$ 21.000' },
    { name: 'Lucca Hurtado', initial: 'LH', value: 5, status: 'orange', val: 'R$ 15.400' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
             <Target size={24} />
           </div>
           <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Comando Comercial</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Revenue Ops & Pipeline Management</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
           <div className="flex bg-white border border-slate-200 rounded p-1 shadow-sm">
             {periods.map(period => (
               <button
                 key={period}
                 onClick={() => setSelectedPeriod(period)}
                 className={`px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all ${selectedPeriod === period ? 'bg-[#002147] text-white' : 'text-slate-400 hover:text-slate-900'}`}
               >
                 {period}
               </button>
             ))}
           </div>
           <button className="p-2 border border-slate-200 rounded bg-white text-slate-400 hover:text-slate-900"><Filter size={16}/></button>
           <button className="bg-[#002147] text-white px-6 py-2.5 rounded text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
             <UserPlus size={16} /> Novo Lead
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Valor em Pipeline', val: 'R$ 1.340.000', sub: '+12% vs jan', color: 'text-blue-600', icon: '$' },
          { label: 'Leads Ativos', val: '154', sub: '24 novos hoje', color: 'text-slate-900', icon: <Users size={18}/> },
          { label: 'Taxa de Win', val: '24.5%', sub: 'Target: 20%', color: 'text-emerald-600', icon: <Trophy size={18}/> },
          { label: 'Cycle Time', val: '18 dias', sub: '-2 dias vs média', color: 'text-orange-600', icon: <CalendarDays size={18}/> },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm group hover:border-blue-400 transition-all">
             <div className="flex justify-between items-start mb-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
               <div className={`w-8 h-8 rounded bg-slate-50 flex items-center justify-center font-black ${item.color}`}>{item.icon}</div>
             </div>
             <div className="space-y-1">
               <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.val}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase">{item.sub}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm flex flex-col min-h-[450px]">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-10">Sales Funnel Execution</h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Prospecção', val: '80', perc: '100%', color: 'bg-slate-200' },
              { label: 'Qualificação', val: '45', perc: '56%', color: 'bg-slate-400' },
              { label: 'Proposta', val: '22', perc: '27%', color: 'bg-[#002147]' },
              { label: 'Negociação', val: '12', perc: '15%', color: 'bg-blue-600' },
              { label: 'Fechamento', val: '8', perc: '10%', color: 'bg-emerald-600' },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5 group">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                  <span>{step.label}</span>
                  <span className="text-slate-900">{step.val} <span className="text-slate-300 ml-1">({step.perc})</span></span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} transition-all duration-1000 group-hover:brightness-110`} style={{ width: step.perc }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm flex flex-col">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-10">Top Closers Ranking</h3>
          <div className="flex-1 space-y-5">
            {ranking.map((member, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-transparent hover:border-slate-100 rounded-lg transition-all group">
                <div className="w-4 text-[10px] font-black text-slate-300">#{i + 1}</div>
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-[11px] font-black text-white">
                  {member.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">{member.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.value} deals</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-black text-slate-900 tracking-tighter">{member.val}</p>
                  <div className="h-1 w-12 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${100 - i * 20}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-500 hover:bg-slate-100 flex items-center justify-center gap-2">
            Ver Leaderboard Completo <ArrowRight size={12}/>
          </button>
        </div>

        <div className="space-y-6 flex flex-col">
           <div className="bg-[#002147] rounded-lg p-8 text-white flex-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Sparkles size={150} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">IA Deal Forecast</h4>
                  <RefreshCcw size={14} className="text-white/30 cursor-pointer hover:rotate-180 transition-all duration-500"/>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black leading-tight tracking-tighter uppercase italic">Probabilidade de fechar R$ 120k nos próximos 7 dias: <span className="text-emerald-400">82%</span></p>
                  <p className="text-[11px] text-white/60 leading-relaxed">Foque nos leads Sirius e Omni; ambos mostraram sinais de urgência elevados nos últimos 3 emails.</p>
                </div>
                <button className="px-6 py-2 bg-white text-[#002147] rounded text-[10px] font-black uppercase hover:bg-slate-100 transition-all shadow-xl">
                  Executar Plano de Ação
                </button>
              </div>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm h-44 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-orange-600 mb-2">
                <AlertTriangle size={18}/>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Atenção Crítica</h4>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase leading-tight tracking-tight">
                3 Leads estão sem contato há mais de 48h. Risco de perda estimado em <span className="text-red-600">R$ 15.000</span>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Crm;
