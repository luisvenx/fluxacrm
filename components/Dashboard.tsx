
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users, 
  Target, 
  RefreshCcw, 
  Loader2, 
  Calendar, 
  Filter, 
  ChevronDown, 
  Wallet,
  Receipt,
  CircleDashed,
  Maximize2,
  Edit2,
  FileText,
  User,
  Database
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
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
    countIn: 0,
    saidas: 0,
    countOut: 0,
    lucro: 0,
    ticketMedio: 0,
    aReceber: 0,
    contasPagar: 0,
    countPagar: 0,
    mrr: 0,
    countContracts: 0,
    activeClients: 0
  });

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    setIsLoading(true);
    try {
      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      const { data: contracts } = await supabase.from('contracts').select('amount').eq('status', 'ACTIVE').eq('user_id', user.id);
      const { count: clientCount } = await supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

      if (txs) {
        const stats = txs.reduce((acc, curr) => {
          const val = Number(curr.amount);
          if (curr.type === 'IN') {
            if (curr.status === 'PAID') {
              acc.entradas += val;
              acc.countIn += 1;
            } else {
              acc.aReceber += val;
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
        }, { entradas: 0, countIn: 0, saidas: 0, countOut: 0, aReceber: 0, contasPagar: 0, countPagar: 0 });

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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-10">
      
      {/* Header Responsivo */}
      <div className="px-4 md:px-8 pt-6 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-[#111827] tracking-tight">Dashboard Financeiro</h1>
          <p className="text-[12px] text-slate-400 font-medium">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchDashboardData} className="p-2 border border-slate-100 rounded-lg text-slate-300 hover:text-blue-600 transition-all">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 mb-6 mt-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[11px] font-medium text-slate-400">Período:</span>
            </div>
            {['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'].map(p => (
              <button 
                key={p} 
                onClick={() => setActivePeriod(p)}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${activePeriod === p ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50">
               Realizado <ChevronDown size={12} />
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50">
               <Filter size={12} /> Avançado <ChevronDown size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
             <span>Visualizando: <strong className="text-slate-600">{activePeriod}</strong></span>
             <span className="mx-1">|</span>
             <span>Modo: <strong className="text-slate-600">Realizado</strong></span>
             <span className="mx-1">|</span>
             <span>Meta: <strong className="text-slate-600">Mensal</strong></span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Indicadores Principais</p>
      </div>

      {/* Main Content Area */}
      <div className="px-4 md:px-8 space-y-6">
        
        {/* Row 1: Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <StatCard 
            title="Entradas" 
            value={formatCurrency(metrics.entradas)} 
            subtitle={`${metrics.countIn} transações`}
            icon={<ArrowDownLeft />} 
            color="emerald" 
          />
          <StatCard 
            title="Saídas" 
            value={formatCurrency(metrics.saidas)} 
            subtitle={`${metrics.countOut} transações`}
            icon={<ArrowUpRight />} 
            color="red" 
          />
          <StatCard 
            title="Lucro Líquido" 
            value={formatCurrency(metrics.lucro)} 
            subtitle="% do LL — "
            icon={<TrendingUp />} 
            color="blue" 
            showInfo
          />
          <StatCard 
            title="Ticket Médio" 
            value={formatCurrency(metrics.ticketMedio)} 
            subtitle={`${metrics.activeClients} clientes ativos`}
            icon={<Users />} 
            color="blue" 
          />
        </div>

        {/* Row 2: Secondary Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card Meta */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center group hover:border-blue-100 transition-all relative">
            <div className="absolute top-4 left-4">
              <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-bold text-slate-400">
                Mensal <ChevronDown size={10} />
              </button>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Edit2 size={12} className="text-slate-300 cursor-pointer hover:text-slate-600" />
              <Maximize2 size={12} className="text-slate-300 cursor-pointer hover:text-slate-600" />
            </div>

            <div className="relative mb-4 mt-4">
              <CircleDashed size={60} strokeWidth={1} className="text-slate-100 animate-[spin_20s_linear_infinite]" />
              <Target size={24} className="absolute inset-0 m-auto text-slate-300" />
            </div>
            <h4 className="text-[12px] font-semibold text-slate-400 mb-4">Meta não definida</h4>
            <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-all shadow-sm">
              <Target size={12} /> Definir Meta
            </button>
          </div>

          {/* Card A Receber */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm group hover:border-blue-100 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={16} className="text-amber-500" />
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">A Receber</h4>
            </div>
            <div>
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight">{formatCurrency(metrics.aReceber)}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Total em aberto (atual + futuro)</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-slate-400">Recebido</span>
                <span className="text-slate-400">Em aberto</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                 <div className="h-full bg-blue-600/10 w-[5%] shadow-sm" />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-900">
                <span>R$ 0,00</span>
                <span>R$ 0,00</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><FileText size={12} /></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400">Pendências</span><span className="text-[12px] font-bold text-slate-800">0</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><User size={12} /></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400">Clientes</span><span className="text-[12px] font-bold text-slate-800">0</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Contas a Pagar */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm group hover:border-blue-100 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={16} className="text-rose-500" />
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contas a Pagar</h4>
            </div>
            <div>
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight">{formatCurrency(metrics.contasPagar)}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{metrics.countPagar} contas pendentes</p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center opacity-20">
               <Receipt size={40} className="text-slate-300" />
            </div>
          </div>

          {/* Card MRR */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm group hover:border-blue-100 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCcw size={16} className="text-blue-500" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRR</h4>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg border border-blue-100">{metrics.countContracts} contratos</span>
            </div>
            <div>
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight">{formatCurrency(metrics.mrr)}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Garantido mensalmente • Clique para detalhes</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6 opacity-30">
               <p className="text-[11px] font-medium text-slate-400">Nenhum contrato recorrente ativo</p>
            </div>
          </div>
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <ChartCard 
            title="Entradas x Saídas" 
            xAxisLabels={['01/02', '02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
            legend={[
              { label: 'Entradas', color: '#2563eb' },
              { label: 'Saídas', color: '#f43f5e' }
            ]}
          />
          <ChartCard 
            title="Lucro Líquido por Período" 
            xAxisLabels={['01/02', '02/02', '04/02', '06/02', '08/02', '10/02', '12/02', '14/02', '16/02', '18/02', '20/02', '22/02', '24/02', '26/02', '28/02']}
          />
        </div>

        {/* Row 4: Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-10">
          <div className="lg:col-span-7">
            <RecentEntries />
          </div>
          <div className="lg:col-span-5">
            <CustomersTable />
          </div>
        </div>

      </div>

      {isLoading && (
        <div className="fixed bottom-24 md:bottom-12 right-4 md:right-12 bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-bounce z-50 border border-white/10 backdrop-blur-md">
          <Loader2 size={20} className="animate-spin text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Engine Sincronizada</span>
            <span className="text-xs font-medium text-slate-400 tracking-tight">Consolidando Matriz de Dados...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
