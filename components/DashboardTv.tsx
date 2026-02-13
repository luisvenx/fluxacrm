
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
  user: any;
}

const DashboardTv: React.FC<DashboardTvProps> = ({ onBack, user }) => {
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
    if (!user) return;
    setIsLoading(true);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      // 1. Fetch Realized Revenue (Month)
      const { data: monthTxs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'IN')
        .eq('status', 'PAID')
        .gte('competence_date', startOfMonth)
        .lte('competence_date', endOfMonth);

      const realized = monthTxs?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;

      // 2. Fetch Goal
      const { data: goalData } = await supabase
        .from('goals')
        .select('target_value')
        .eq('user_id', user.id)
        .eq('scope', 'Empresa')
        .limit(1)
        .maybeSingle();

      // 3. Upcoming Income (Weekly Windows)
      const today = new Date();
      const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const next14Days = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

      const { data: pendingTxs } = await supabase
        .from('transactions')
        .select('amount, competence_date')
        .eq('user_id', user.id)
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
        .eq('user_id', user.id)
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
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [user]);

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
          className={`flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border transition-all duration-300 shadow-xl ${
            isDarkMode ? 'bg-slate-800/50 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'
          }`}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white">
            <ArrowLeft size={18} />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sair do Modo</span>
            <span className="text-[13px] font-bold tracking-tight">Dashboard TV</span>
          </div>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between relative px-20">
        <div className="flex-1 flex flex-col items-center justify-center pr-20">
          <div className="relative w-[800px] h-[400px]">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="2" strokeLinecap="round" />
              <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke={metrics.currentAmount === 0 ? "#f43f5e" : "#3b82f6"} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (progressPercentage / 100))} className="transition-all duration-[2000ms] ease-out" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-12">
              <h1 className={`text-[130px] font-black tracking-tighter leading-none ${isPrivate ? 'blur-2xl' : ''}`}>
                {formatShortValue(metrics.currentAmount)}
              </h1>
              <p className="text-3xl font-black opacity-40">{progressPercentage.toFixed(1)}% da meta isolada</p>
            </div>
          </div>
        </div>

        <div className={`w-[450px] h-[85vh] rounded-[3rem] p-12 shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#11141a]' : 'bg-white border border-slate-50'}`}>
           <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-blue-600 rounded-2xl text-white"><TrendingUp size={28} /></div>
              <h2 className="text-2xl font-black uppercase">Sua Projeção</h2>
           </div>

           <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/10">
                 <p className="text-[11px] font-black uppercase text-blue-400 mb-2">Esta Semana</p>
                 <p className="text-3xl font-black">{formatValue(metrics.thisWeek)}</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-slate-800/30 border border-white/5">
                 <p className="text-[11px] font-black uppercase text-slate-500 mb-2">Próx. Semana</p>
                 <p className="text-3xl font-black">{formatValue(metrics.nextWeek)}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTv;
