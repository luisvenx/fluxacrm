
import React, { useState, useEffect, useRef } from 'react';
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
  X
} from 'lucide-react';

interface DashboardTvProps {
  onBack: () => void;
}

const DashboardTv: React.FC<DashboardTvProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estados de UI
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Estados de Dados (Simulados)
  const [data, setData] = useState({
    currentAmount: 0,
    goalAmount: 150000,
    thisWeek: 0,
    nextWeek: 0,
    totalProjected: 0
  });

  // Cálculo dinâmico de dias restantes no mês
  const getDaysRemaining = () => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDayOfMonth.getDate() - now.getDate();
  };

  const daysRemaining = getDaysRemaining();
  const progressPercentage = (data.currentAmount / data.goalAmount) * 100;

  // Handlers
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
    return `R$ ${val.toLocaleString('pt-BR')}`;
  };

  // Monitorar mudanças de fullscreen externas (tecla Esc)
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
      
      {/* Botão de Voltar Premium */}
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

      {/* Top Controls Overlay */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-10">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3.5 rounded-2xl transition-all shadow-lg ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          title="Alternar Tema"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className={`p-3.5 rounded-2xl border transition-all shadow-lg ${isDarkMode ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}>
          <BarChart2 size={20} />
        </button>

        <button 
          onClick={() => setIsPrivate(!isPrivate)}
          className={`p-3.5 rounded-2xl transition-all shadow-lg ${isPrivate ? 'bg-rose-500 text-white shadow-rose-500/20' : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          title="Modo Privacidade"
        >
          {isPrivate ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>

        <button 
          onClick={toggleFullscreen}
          className={`p-3.5 rounded-2xl transition-all shadow-lg ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          title="Tela Cheia"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between relative px-20">
        
        {/* Central Gauge Section */}
        <div className="flex-1 flex flex-col items-center justify-center pr-20">
          
          <div className="relative w-[800px] h-[400px]">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              {/* Background Path */}
              <path 
                d="M 10 45 A 40 40 0 0 1 90 45" 
                fill="none" 
                stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} 
                strokeWidth="2" 
                strokeLinecap="round"
              />

              {/* Progress Path (Dynamic) */}
              <path 
                d="M 10 45 A 40 40 0 0 1 90 45" 
                fill="none" 
                stroke={data.currentAmount === 0 ? "#f43f5e" : "#3b82f6"} 
                strokeWidth="2.2" 
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (progressPercentage / 100))}
                className="transition-all duration-[2000ms] ease-out"
              />
              
              {/* Percentage Marks */}
              {[0, 25, 50, 75, 100].map((mark) => {
                const angle = (mark / 100) * 180 + 180;
                const rad = (angle * Math.PI) / 180;
                const r = 42;
                const lx = 50 + (r + 8) * Math.cos(rad);
                const ly = 45 + (r + 8) * Math.sin(rad);

                return (
                  <g key={mark}>
                    <text 
                      x={lx} y={ly} 
                      textAnchor="middle" 
                      className={`text-[2.8px] font-black tracking-tighter ${isDarkMode ? 'fill-slate-600' : 'fill-slate-300'}`}
                    >
                      {mark}%
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Central Values Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-12">
              <h1 className={`text-[150px] font-black tracking-tighter leading-none transition-colors duration-500 ${data.currentAmount === 0 ? 'text-[#f43f5e]' : 'text-blue-500'} ${isPrivate ? 'blur-2xl opacity-50' : ''}`}>
                {formatShortValue(data.currentAmount)}
              </h1>
              
              <div className="text-center space-y-6 mt-4">
                 <p className={`text-3xl font-black transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                    {progressPercentage.toFixed(1)}% atingido
                 </p>
                 <p className={`text-6xl font-medium tracking-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                   {daysRemaining === 0 ? (
                     <span className="text-[#f43f5e] font-black uppercase tracking-[0.2em] animate-pulse">Meta Finalizada</span>
                   ) : (
                     <>Faltam <span className="text-[#f43f5e] font-black">{daysRemaining}</span> {daysRemaining === 1 ? 'dia' : 'dias'}</>
                   )}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Projections */}
        <div className={`w-[450px] h-[85vh] rounded-[3rem] border transition-all duration-500 p-12 shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#11141a] border-white/5 shadow-black/50' : 'bg-white border-slate-50 shadow-slate-200/50'}`}>
           <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <TrendingUp size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Próximas Entradas</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Previsão de Receita</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-5 mb-8">
              <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-[#eef2ff] border-blue-50'}`}>
                 <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-blue-400/60' : 'text-blue-400'}`}>Esta Semana</p>
                 <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                   {formatValue(data.thisWeek)}
                 </p>
              </div>
              <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-800/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                 <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Próx. Semana</p>
                 <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                    {formatValue(data.nextWeek)}
                 </p>
              </div>
           </div>

           <div className={`p-8 rounded-[2.5rem] border flex items-center justify-between mb-16 transition-all ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-[#eef2ff] border-blue-100'}`}>
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <DollarSign size={20} />
                 </div>
                 <div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Total Projetado (Mês)</span>
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-blue-400/50' : 'text-blue-400'}`}>Baseado em Contratos</p>
                 </div>
              </div>
              <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                 {formatValue(data.totalProjected)}
              </p>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 group cursor-default">
              <Calendar size={80} strokeWidth={1} className={`mb-8 transition-transform group-hover:scale-110 duration-500 ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`} />
              <p className={`text-xl font-medium ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Nenhuma projeção pendente</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isDarkMode ? 'text-slate-800' : 'text-slate-300'}`}>Sincronizado há 1 min</p>
           </div>
        </div>
      </div>
      
      {/* Bottom Visual Glow */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 blur-3xl transition-opacity duration-1000 ${isDarkMode ? 'bg-blue-500/20 opacity-50' : 'bg-blue-500/10 opacity-100'}`}></div>
    </div>
  );
};

export default DashboardTv;
