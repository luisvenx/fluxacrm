
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users, 
  Target, 
  Plus, 
  Maximize2, 
  CircleDashed,
  Wallet,
  Receipt,
  RefreshCcw,
  Loader2,
  Calendar,
  Filter,
  ChevronDown,
  Info,
  Tv,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('Este Mês');
  
  const [metrics, setMetrics] = useState({
    entradas: 0,
    countIn: 0,
    saidas: 0,
    countOut: 0,
    lucro: 0,
    ticketMedio: 0,
    aReceber: 0,
    aReceberTotal: 0,
    contasPagar: 0,
    countPagar: 0,
    mrr: 0,
    countContracts: 0,
    activeClients: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setIsLoading(true);
    try {
      // 1. Fetch Transactions
      const { data: txs } = await supabase.from('transactions').select('*');
      
      // 2. Fetch Contracts for MRR
      const { data: contracts } = await supabase.from('contracts').select('amount').eq('status', 'ACTIVE');
      
      // 3. Fetch Customers count
      const { count: clientCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });

      if (txs) {
        const stats = txs.reduce((acc, curr) => {
          const val = Number(curr.amount);
          if (curr.type === 'IN') {
            if (curr.status === 'PAID') {
              acc.entradas += val;
              acc.countIn += 1;
            } else {
              acc.aReceber += val;
              acc.aReceberTotal += val;
            }
          } else {
            if (curr.status === 'PAID') {
              acc.saidas += val;
              acc.countOut += 1;
            } else {
              acc.contasPagar += val;
              acc.countPagar += 1;
            }
          }
          return acc;
        }, { entradas: 0, countIn: 0, saidas: 0, countOut: 0, aReceber: 0, aReceberTotal: 0, contasPagar: 0, countPagar: 0 });

        const totalMRR = contracts?.reduce((acc, c) => acc + Number(c.amount), 0) || 0;

        setMetrics({
          ...stats,
          lucro: stats.entradas - stats.saidas,
          ticketMedio: stats.countIn > 0 ? stats.entradas / stats.countIn : 0,
          mrr: totalMRR,
          countContracts: contracts?.length || 0,
          activeClients: clientCount || 0
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-10">
      
      {/* Header Estilo Imagem */}
      <div className="px-8 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Financeiro</h1>
          <p className="text-xs text-slate-400 font-medium">Visão geral das suas finanças</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Tv size={14} /> Modo TV
        </button>
      </div>

      {/* Filter Bar Estilo Imagem */}
      <div className="px-8 mb-6">
        <div className="bg-white border border-slate-100 rounded-xl p-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100/50">
               <Calendar size={14} className="text-slate-400 ml-2" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Período:</span>
               {['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'].map(p => (
                 <button 
                  key={p} 
                  onClick={() => setActivePeriod(p)}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${activePeriod === p ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   {p}
                 </button>
               ))}
            </div>
            
            <div className="relative">
              <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-4 text-[10px] font-bold text-slate-600 appearance-none pr-10">
                <option>Realizado</option>
                <option>Previsto</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-slate-900">
               <Filter size={14} /> Avançado
            </button>
          </div>

          <div className="flex items-center gap-4 pr-4">
             <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
               Visualizando: <span className="text-slate-900 font-bold">{activePeriod}</span> | Modo: <span className="text-slate-900 font-bold">Realizado</span> | Meta: <span className="text-slate-900 font-bold">Mensal</span>
             </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-8 space-y-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">Indicadores Principais</span>

        {/* Row 1: Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Entradas */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm relative group hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entradas</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg"><ArrowDownLeft size={14}/></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{isLoading ? '...' : formatCurrency(metrics.entradas)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{metrics.countIn} transações</p>
          </div>

          {/* Saídas */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm relative group hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saídas</span>
              <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg"><ArrowUpRight size={14}/></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{isLoading ? '...' : formatCurrency(metrics.saidas)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{metrics.countOut} transações</p>
          </div>

          {/* Lucro Líquido */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm relative group hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lucro Líquido</span>
              <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><TrendingUp size={14}/></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{isLoading ? '...' : formatCurrency(metrics.lucro)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
              % do LL — <Info size={10} className="text-slate-300" />
            </p>
          </div>

          {/* Ticket Médio */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm relative group hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Médio</span>
              <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg"><Users size={14}/></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{isLoading ? '...' : formatCurrency(metrics.ticketMedio)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{metrics.activeClients} clientes ativos</p>
          </div>
        </div>

        {/* Row 2: Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Meta Widget */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
            <CircleDashed size={32} strokeWidth={1.5} className="text-slate-200 mb-2 animate-[spin_15s_linear_infinite]" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-3">Meta não definida</p>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              <Target size={12} /> Definir Meta
            </button>
          </div>

          {/* A Receber */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={14} className="text-amber-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A Receber</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{formatCurrency(metrics.aReceber)}</h3>
            <p className="text-[9px] text-slate-400 font-medium mb-4">Total em aberto (atual + futuro)</p>
            
            <div className="space-y-4">
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-400 w-[70%]" />
                  <div className="h-full bg-amber-400 w-[30%]" />
               </div>
               <div className="flex justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Pendências</p>
                    <p className="text-xs font-bold text-slate-900">0</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Clientes</p>
                    <p className="text-xs font-bold text-slate-900">0</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Contas a Pagar */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Receipt size={14} className="text-rose-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contas a Pagar</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{formatCurrency(metrics.contasPagar)}</h3>
            <p className="text-[9px] text-slate-400 font-medium">{metrics.countPagar} contas pendentes</p>
          </div>

          {/* MRR */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <RefreshCcw size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRR</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{metrics.countContracts} contratos</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{formatCurrency(metrics.mrr)}</h3>
            <p className="text-[9px] text-slate-400 font-medium mb-6">Garantido mensalmente • Clique para detalhes</p>
            <div className="flex flex-col items-center justify-center py-4 border-t border-slate-50 mt-2">
               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Nenhum contrato recorrente ativo</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-xl p-8 h-[380px] shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-10">Entradas x Saídas</h3>
            <div className="flex-1 flex items-center justify-center border-b border-l border-slate-50 relative">
               {/* Empty Grid Mockup */}
               <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-50">
                  {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-50 border-dashed" />)}
               </div>
               <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">Aguardando dados históricos...</span>
               <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-4 text-[8px] font-bold text-slate-300">
                  <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
               </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-8 h-[380px] shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-10">Lucro Líquido por Período</h3>
            <div className="flex-1 flex items-center justify-center border-b border-l border-slate-50 relative">
               <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">Processando performance...</span>
               <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-4 text-[8px] font-bold text-slate-300">
                  <span>02/02</span><span>08/02</span><span>14/02</span><span>20/02</span><span>28/02</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          {/* Lançamentos Recentes */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Lançamentos Recentes</h3>
                <p className="text-[10px] text-slate-400 font-medium">Últimas movimentações financeiras</p>
              </div>
              <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                 {['Todos', 'Entradas', 'Saídas', 'Pendentes'].map(tab => (
                   <button key={tab} className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${tab === 'Todos' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                     {tab}
                   </button>
                 ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-40">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum lançamento encontrado</p>
            </div>
            <button className="p-4 text-center text-[10px] font-black text-blue-600 uppercase tracking-widest border-t border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              Ver todos os lançamentos <ArrowRight size={12} />
            </button>
          </div>

          {/* Clientes Table */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col min-h-[300px]">
             <div className="p-6 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Clientes</h3>
                <p className="text-[10px] text-slate-400 font-medium">Visão geral por cliente</p>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      {['CLIENTE', 'FATURADO', 'RECEBIDO', 'EM ABERTO', 'STATUS'].map(h => (
                        <th key={h} className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                      <td colSpan={5} className="py-20 text-center opacity-40">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum cliente encontrado</p>
                      </td>
                    </tr>
                 </tbody>
               </table>
             </div>
             <button className="p-4 text-center text-[10px] font-black text-blue-600 uppercase tracking-widest border-t border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 mt-auto">
              Ver todos os clientes <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </div>

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Loader2 size={16} className="animate-spin text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Banco de Dados...</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
