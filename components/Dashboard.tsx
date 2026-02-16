
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users, 
  Target, 
  RefreshCcw, 
  Loader2, 
  Calendar, 
  ChevronDown, 
  Wallet,
  Receipt,
  CircleDashed,
  Database,
  Tv,
  Info,
  Zap,
  Sparkles,
  Clock,
  User,
  LayoutGrid,
  Filter,
  Maximize2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import RecentEntries from './RecentEntries';
import CustomersTable from './CustomersTable';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  
  const [metrics, setMetrics] = useState({
    entradas: 0,
    saidas: 0,
    lucro: 0,
    ticketMedio: 0,
    aReceber: 0,
    aReceberRecebido: 0,
    contasPagar: 0,
    mrr: 0,
    countContracts: 0,
    activeClients: 0
  });

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [txsRes, contractsRes, customersRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('contracts').select('amount').eq('status', 'ACTIVE').eq('user_id', user.id),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      if (txsRes.data) {
        const stats = txsRes.data.reduce((acc, curr) => {
          const val = Number(curr.amount);
          if (curr.type === 'IN') {
            if (curr.status === 'PAID') acc.entradas += val;
            else acc.aReceber += val;
          } else {
            if (curr.status === 'PAID') acc.saidas += val;
            else acc.contasPagar += val;
          }
          return acc;
        }, { entradas: 0, saidas: 0, aReceber: 0, aReceberRecebido: 0, contasPagar: 0 });

        const totalMRR = contractsRes.data?.reduce((acc, c) => acc + Number(c.amount), 0) || 0;

        setMetrics({
          ...stats,
          lucro: stats.entradas - stats.saidas,
          ticketMedio: stats.entradas > 0 ? stats.entradas / (customersRes.count || 1) : 0,
          mrr: totalMRR,
          countContracts: contractsRes.data?.length || 0,
          activeClients: customersRes.count || 0
        });
      }
    } catch (err) {
      console.error('Erro dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
         <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Sincronizando Dashboards...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700 font-['Inter']">
      
      <div className="px-6 md:px-8 pt-8 flex flex-col gap-6">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Monitoramento <span className="text-[#01223d] not-italic">Financeiro</span></h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Inteligência de Dados v2.9</p>
           </div>
           <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Tv size={14} className="text-[#b4a183]" /> Modo TV
           </button>
        </div>

        {/* Filter Bar Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-white border border-slate-200 rounded-xl p-2 shadow-sm gap-4">
           <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 border-r border-slate-100 mr-2">
                 <Calendar size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Período:</span>
              </div>
              {['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setActivePeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${activePeriod === p ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
              <div className="relative ml-2">
                 <select className="bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-8 py-1.5 text-[11px] font-bold text-slate-600 appearance-none outline-none">
                    <option>Realizado</option>
                    <option>Previsto</option>
                 </select>
                 <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-500 text-[11px] font-bold hover:bg-slate-50 rounded-lg ml-2">
                 <Filter size={14} /> Avançado <ChevronDown size={12} />
              </button>
           </div>

           <div className="flex items-center gap-6 px-4">
              <div className="flex flex-col items-end leading-tight">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Visualizando:</span>
                 <span className="text-[11px] font-bold text-slate-700">{activePeriod}</span>
              </div>
              <div className="flex flex-col items-end leading-tight">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Modo:</span>
                 <span className="text-[11px] font-bold text-slate-700">Realizado</span>
              </div>
              <div className="flex flex-col items-end leading-tight">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Meta:</span>
                 <span className="text-[11px] font-bold text-slate-700">Mensal</span>
              </div>
           </div>
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Métricas de Performance</p>

        {/* ROW 1: 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-[#b4a183] transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entradas</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(metrics.entradas)}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">SQL Realtime</p>
                 </div>
                 <div className="p-2 bg-slate-50 text-[#01223d] rounded-lg border border-slate-100 shadow-sm">
                    <TrendingUp size={16} />
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-rose-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saídas</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(metrics.saidas)}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Despesa Operacional</p>
                 </div>
                 <div className="p-2 bg-rose-50 text-rose-500 rounded-lg shadow-sm">
                    <ArrowUpRight size={16} />
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lucro Líquido</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(metrics.lucro)}</h3>
                    <div className="flex items-center gap-1 mt-1">
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">% LL —</span>
                       <Info size={12} className="text-slate-300" />
                    </div>
                 </div>
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg opacity-50 shadow-sm">
                    <TrendingUp size={16} />
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Médio</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(metrics.ticketMedio)}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{metrics.activeClients} Clientes</p>
                 </div>
                 <div className="p-2 bg-slate-50 text-[#b4a183] rounded-lg border border-slate-100 shadow-sm">
                    <Users size={16} />
                 </div>
              </div>
           </div>
        </div>

        {/* ROW 2: Intermediate KPI Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[280px] relative">
              <div className="absolute top-4 left-4">
                 <div className="relative group">
                    <select className="bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-6 py-1 text-[10px] font-bold text-slate-500 appearance-none outline-none">
                       <option>Mensal</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                 <button className="text-slate-300 hover:text-[#01223d]"><Zap size={14}/></button>
                 <button className="text-slate-300 hover:text-[#01223d]"><Maximize2 size={14}/></button>
              </div>

              <div className="relative flex flex-col items-center gap-6 mt-4">
                 <div className="relative w-24 h-24">
                    <CircleDashed size={96} strokeWidth={1.5} className="text-slate-100 animate-spin-slow" />
                    <Target size={32} className="absolute inset-0 m-auto text-slate-300" />
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-slate-400 font-medium uppercase">Meta não definida</p>
                    <button className="mt-4 px-6 py-2 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2 hover:bg-[#01223d] hover:text-white transition-all shadow-sm">
                       <Target size={14} className="text-[#b4a183]" /> Definir Meta
                    </button>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <Wallet size={16} className="text-[#b4a183]" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A Receber</p>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(metrics.aReceber)}</h3>
                 <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Vencimentos Futuros</p>
                 
                 <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                       <span className="text-slate-400">Recebido</span>
                       <span className="text-slate-400">Pendente</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-[#b4a183]/40" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-slate-800 italic">
                       <span>{formatCurrency(0)}</span>
                       <span>{formatCurrency(metrics.aReceber)}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50 mt-auto">
                 <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                       <Receipt size={12} />
                       <span className="text-[9px] font-black uppercase">Faturas</span>
                    </div>
                    <p className="text-sm font-black text-[#01223d]">0</p>
                 </div>
                 <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                       <Users size={12} />
                       <span className="text-[9px] font-black uppercase">Leads</span>
                    </div>
                    <p className="text-sm font-black text-[#01223d]">0</p>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                 <Receipt size={16} className="text-rose-500" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contas a Pagar</p>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(metrics.contasPagar)}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Obrigações Exigíveis</p>
              
              <div className="mt-8 flex-1 border-t border-slate-50 pt-6">
                 <div className="h-2 w-full bg-slate-50 rounded-full" />
              </div>
           </div>

           <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                    <RefreshCcw size={16} className="text-[#01223d]" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRR</p>
                 </div>
                 <span className="bg-slate-900 text-[#b4a183] text-[9px] font-black px-2 py-0.5 rounded uppercase">{metrics.countContracts} Ativos</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(metrics.mrr)}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Recorrência Mensal</p>
              
              <div className="mt-auto py-8 text-center opacity-30">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Nenhum contrato recorrente</p>
              </div>
           </div>
        </div>

        {/* ROW 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-slate-900 font-bold text-[14px] uppercase tracking-tight italic">Fluxo de <span className="text-[#01223d] not-italic">Caixa</span></h3>
              </div>
              <div className="h-[250px] w-full relative">
                 <div className="absolute inset-0 flex flex-col justify-between">
                   {[0,1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-50 border-dashed"></div>)}
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] font-bold text-slate-300">
                    <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
                 </div>
                 <div className="absolute bottom-1/4 left-0 right-0 h-px bg-[#b4a183] opacity-30 shadow-[0_0_10px_#b4a183]"></div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Entradas</div>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Saídas</div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-slate-900 font-bold text-[14px] uppercase tracking-tight italic">Evolução do <span className="text-[#01223d] not-italic">Patrimônio</span></h3>
              </div>
              <div className="h-[250px] w-full relative">
                 <div className="absolute inset-0 flex flex-col justify-between">
                   {[0,1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-50 border-dashed"></div>)}
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] font-bold text-slate-300">
                    <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
                 </div>
              </div>
           </div>
        </div>

        {/* ROW 4: Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
           <div className="lg:col-span-7">
              <RecentEntries />
           </div>
           <div className="lg:col-span-5">
              <CustomersTable />
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
