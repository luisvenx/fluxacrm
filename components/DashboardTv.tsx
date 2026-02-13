
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sun, 
  Moon,
  BarChart2, 
  EyeOff, 
  Eye,
  Maximize2, 
  TrendingUp, 
  Calendar,
  DollarSign,
  ArrowLeft,
  Minimize2,
  Loader2,
  Database
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardTvProps {
  onBack: () => void;
}

const DashboardTv: React.FC<DashboardTvProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estados de UI
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de Dados Reais
  const [metrics, setMetrics] = useState({
    currentAmount: 0,
    goalAmount: 150000,
    thisWeek: 0,
    nextWeek: 0,
    totalProjected: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      // 1. Fetch Realized Revenue (Month)
      const { data: monthTxs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'IN')
        .eq('status', 'PAID')
        .gte('competence_date', startOfMonth)
        .lte('competence_date', endOfMonth);

      const realized = monthTxs?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;

      // 2. Fetch Goal
      const { data: goalData } = await supabase
        .from('goals')
        .select('target_value')
        .eq('scope', 'Empresa')
        .limit(1)
        .single();

      // 3. Upcoming Income (Weekly Windows)
      const today = new Date();
      const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const next14Days = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

      const { data: pendingTxs } = await supabase
        .from('transactions')
        .select('amount, competence_date')
        .eq('type', 'IN')
        .eq('status', 'PENDING');

      const thisWeekSum = pendingTxs?.filter(t => t.competence_date >= today.toISOString() && t.competence_date <= next7Days)
        .reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      
      const nextWeekSum = pendingTxs?.filter(t => t.competence_date > next7Days && t.competence_date <= next14Days)
        .reduce((acc, t) => acc + Number(t.amount), 0) || 0;

      // 4. MRR Projection (Active Contracts)
      const { data: contracts } = await supabase
        .from('contracts')
        .select('amount')
        .eq('status', 'ACTIVE');
      
      const mrrSum = contracts?.reduce((acc, c) => acc + Number(c.amount), 0) || 0;

      setMetrics({
        currentAmount: realized,
        goalAmount: goalData?.target_value || 150000,
        thisWeek: thisWeekSum,
        nextWeek: nextWeekSum,
        totalProjected: mrrSum
      });

    } catch (err) {
      console.error('Erro TV Dashboard Data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh a cada 5 minutos
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getDaysRemaining = () => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDayOfMonth.getDate() - now.getDate();
  };

  const daysRemaining = getDaysRemaining();
  const progressPercentage = Math.min((metrics.currentAmount / metrics.goalAmount) * 100, 100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatValue = (val: number | string) => {
    if (isPrivate) return '••••••';
    return typeof val === 'number' ? `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : val;
  };

  const formatShortValue = (val: number) => {
    if (isPrivate) return 'R$ •';
    if (val >= 1000000) return `R$ ${(val/1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val/1000).toFixed(1)}k`;
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col transition-colors duration-700 overflow-hidden select-none ${isDarkMode ? 'bg-[#0a0c10] text-white' : 'bg-white text-slate-900'}`}
    >
      
      {/* Botão Voltar */}
      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={onBack}
          className={`flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border transition-all duration-300 group active:scale-95 shadow-xl ${
            isDarkMode 
              ? 'bg-slate-800/50 border-white/10 text-white hover:bg-slate-700 hover:border-white/20' 
              : 'bg-white border-slate-100 text-slate-900 hover:bg-slate-50 hover:shadow-slate-200'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sair do Modo</span>
            <span className="text-[13px] font-bold tracking-tight">Dashboard TV</span>
          </div>
        </button>
      </div>

      {/* Controles Superiores */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-10">
        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-xl text-blue-400">
             <Loader2 size={16} className="animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
          </div>
        )}
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3.5 rounded-2xl transition-all shadow-lg ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={() => setIsPrivate(!isPrivate)}
          className={`p-3.5 rounded-2xl transition-all shadow-lg ${isPrivate ? 'bg-rose-500 text-white shadow-rose-500/20' : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
          {isPrivate ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>

        <button 
          onClick={toggleFullscreen}
          className={`p-3.5 rounded-2xl transition-all shadow-lg ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between relative px-20">
        
        {/* Gráfico Central */}
        <div className="flex-1 flex flex-col items-center justify-center pr-20">
          <div className="relative w-[800px] h-[400px]">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path 
                d="M 10 45 A 40 40 0 0 1 90 45" 
                fill="none" 
                stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M 10 45 A 40 40 0 0 1 90 45" 
                fill="none" 
                stroke={metrics.currentAmount === 0 ? "#f43f5e" : "#3b82f6"} 
                strokeWidth="2.2" 
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (progressPercentage / 100))}
                className="transition-all duration-[2000ms] ease-out"
              />
              {[0, 25, 50, 75, 100].map((mark) => {
                const angle = (mark / 100) * 180 + 180;
                const rad = (angle * Math.PI) / 180;
                const r = 42;
                const lx = 50 + (r + 8) * Math.cos(rad);
                const ly = 45 + (r + 8) * Math.sin(rad);
                return (
                  <g key={mark}>
                    <text x={lx} y={ly} textAnchor="middle" className={`text-[2.8px] font-black ${isDarkMode ? 'fill-slate-600' : 'fill-slate-300'}`}>
                      {mark}%
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-12">
              <h1 className={`text-[130px] font-black tracking-tighter leading-none transition-all duration-500 ${metrics.currentAmount === 0 ? 'text-[#f43f5e]' : 'text-blue-500'} ${isPrivate ? 'blur-2xl opacity-50' : ''}`}>
                {formatShortValue(metrics.currentAmount)}
              </h1>
              
              <div className="text-center space-y-4 mt-2">
                 <p className={`text-3xl font-black transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                    {progressPercentage.toFixed(1)}% da meta de {formatShortValue(metrics.goalAmount)}
                 </p>
                 <p className={`text-6xl font-medium tracking-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                   {daysRemaining === 0 ? (
                     <span className="text-emerald-500 font-black uppercase tracking-[0.2em] animate-pulse">Meta Finalizada</span>
                   ) : (
                     <>Faltam <span className="text-rose-500 font-black">{daysRemaining}</span> {daysRemaining === 1 ? 'dia' : 'dias'}</>
                   )}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Projeções */}
        <div className={`w-[450px] h-[85vh] rounded-[3rem] border transition-all duration-500 p-12 shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#11141a] border-white/5 shadow-black/50' : 'bg-white border-slate-50 shadow-slate-200/50'}`}>
           <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <TrendingUp size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Próximas Entradas</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Forecast Engine Realtime</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-5 mb-8">
              <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-[#eef2ff] border-blue-50'}`}>
                 <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-blue-400/60' : 'text-blue-400'}`}>Esta Semana</p>
                 <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                   {formatValue(metrics.thisWeek)}
                 </p>
              </div>
              <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-800/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                 <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Próx. Semana</p>
                 <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                    {formatValue(metrics.nextWeek)}
                 </p>
              </div>
           </div>

           <div className={`p-8 rounded-[2.5rem] border flex items-center justify-between mb-16 transition-all ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                    <DollarSign size={20} />
                 </div>
                 <div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-700'}`}>MRR Contratual</span>
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-emerald-500/40' : 'text-emerald-500'}`}>Garantido por Recorrência</p>
                 </div>
              </div>
              <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                 {formatValue(metrics.totalProjected)}
              </p>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 group cursor-default">
              <div className="relative">
                 <Database size={80} strokeWidth={1} className={`mb-8 transition-transform group-hover:scale-110 duration-500 ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`} />
                 {isLoading && <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-blue-500" size={32} />}
              </div>
              <p className={`text-xl font-medium ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Dados sincronizados em tempo real</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isDarkMode ? 'text-slate-800' : 'text-slate-300'}`}>Criptografia SQL Ativa</p>
           </div>
        </div>
      </div>
      
      {/* Visual Glow */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 blur-3xl transition-opacity duration-1000 ${isDarkMode ? 'bg-blue-500/20 opacity-50' : 'bg-blue-500/10 opacity-100'}`}></div>
    </div>
  );
};

export default DashboardTv;
