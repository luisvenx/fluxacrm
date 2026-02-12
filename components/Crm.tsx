
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
  AlertTriangle
} from 'lucide-react';

const Crm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');

  const periods = ['Hoje', 'Esta Semana', 'Este Mês', 'Este Trimestre', 'Este Ano'];

  const ranking = [
    { name: 'Gabriel Dantras', initial: 'GD', value: 0, status: 'red' },
    { name: 'Kyros', initial: 'K', value: 0, status: 'red' },
    { name: 'Luis Venx', initial: 'LV', value: 0, status: 'red' },
    { name: 'Lucca Hurtado', initial: 'LH', value: 0, status: 'red' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header & Main Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Dashboard Comercial</h2>
          <p className="text-sm text-gray-500 font-medium">Acompanhe a performance do time comercial</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <div className="px-3 text-gray-400">
              <Calendar size={16} />
            </div>
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedPeriod === period ? 'bg-[#0047AB] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="relative">
            <select className="bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[160px]">
              <option>Todos os Squads</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select className="bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm min-w-[160px]">
              <option>Todos os Membros</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Primary Highlight Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex justify-between items-start group hover:border-blue-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Potencial Total</span>
              <HelpCircle size={14} className="text-gray-300" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-[#1e293b]">R$ 1.391,00</p>
              <p className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={14} /> +100.0% <span className="text-gray-400 font-medium">em pipeline ativo</span>
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
            $
          </div>
        </div>

        <div className="bg-white border border-red-50 rounded-2xl p-6 shadow-sm flex justify-between items-start group hover:border-red-200 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Taxa Contato → Reunião</span>
              <HelpCircle size={14} className="text-gray-300" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-[#1e293b]">0%</p>
              <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                <span className="text-lg">—</span> 0.0% <span className="font-medium">0 de 0 leads</span>
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-400 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white border border-red-50 rounded-2xl p-6 shadow-sm flex justify-between items-start group hover:border-red-200 transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Taxa de Fechamento</span>
              <HelpCircle size={14} className="text-gray-300" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-[#1e293b]">0%</p>
              <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                <span className="text-lg">—</span> 0.0% <span className="font-medium">0 de 122 leads</span>
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-400 rounded-xl flex items-center justify-center">
            <Target size={22} />
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Leads Prospe...', val: '122', trend: '+100.0%', color: 'emerald', icon: <Users size={16} /> },
          { label: 'Leads Contat...', val: '0', trend: '- 0.0%', color: 'gray', icon: <UserPlus size={16} /> },
          { label: 'Reuniões Mar...', val: '0', trend: '- 0.0%', color: 'gray', icon: <CalendarDays size={16} /> },
          { label: 'Reuniões Reali...', val: '0', trend: '- 0.0%', color: 'gray', icon: <CalendarCheck size={16} /> },
          { label: 'No-show', val: '0', trend: '- 0.0%', color: 'gray', icon: <UserX size={16} /> },
          { label: 'Fechamentos', val: '0', trend: '- 0.0%', color: 'gray', icon: <Trophy size={16} /> },
        ].map((item, i) => (
          <div key={i} className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3 ${item.label === 'Fechamentos' ? 'bg-emerald-50/30 border-emerald-100' : ''}`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate pr-2">{item.label}</span>
              <div className={`p-1.5 rounded-lg ${item.label === 'Fechamentos' ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'}`}>
                {item.icon}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-[#1e293b]">{item.val}</p>
              <p className={`text-[10px] font-bold ${item.color === 'emerald' ? 'text-emerald-500' : 'text-gray-400'} flex flex-wrap gap-1 items-center`}>
                {item.trend} <span className="text-gray-400 font-medium whitespace-nowrap">vs período anterior</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Extended Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Funil + Alertas */}
        <div className="space-y-6">
          {/* Funil de Conversão Extended */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col min-h-[500px]">
            <h3 className="text-base font-bold text-[#1e293b] mb-8">Funil de Conversão</h3>
            <div className="flex-1 space-y-5">
              {[
                { label: 'Lead', val: '0', color: 'bg-blue-500', width: '5%', perc: '' },
                { label: 'Contato Iniciado', val: '1', color: 'bg-blue-600', width: '40%', perc: '(0%)' },
                { label: 'Reunião Marcada', val: '2', color: 'bg-blue-700', width: '80%', perc: '(200%)' },
                { label: 'Proposta Enviada', val: '0', color: 'bg-indigo-600', width: '10%', perc: '(0%)', alert: 'Gargalo' },
                { label: 'Fechado', val: '0', color: 'bg-indigo-700', width: '5%', perc: '(0%)' }
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase">
                      <div className="flex items-center gap-2">
                        <span>{step.label}</span>
                        {step.alert && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-500 rounded text-[9px] lowercase font-bold">
                            <AlertTriangle size={10} /> {step.alert}
                          </span>
                        )}
                      </div>
                      <span className={step.perc ? "text-orange-400" : ""}>{step.val} <span className="font-medium ml-1">{step.perc}</span></span>
                    </div>
                    <div className={`h-6 w-full ${step.color.replace('bg-', 'bg-')}/10 rounded-lg relative overflow-hidden`}>
                      <div className={`h-full ${step.color} rounded-lg shadow-sm transition-all duration-1000`} style={{ width: step.width }}></div>
                    </div>
                  </div>
                  {idx < 4 && (
                    <div className="flex justify-center text-gray-200">
                      <ChevronDown size={14} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Alertas Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-72 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <AlertCircle size={18} className="text-orange-400" />
              <h3 className="text-base font-bold text-[#1e293b]">Alertas</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-[#1e293b]">Tudo em ordem!</p>
                <p className="text-xs text-gray-400 font-medium">Nenhum alerta no momento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Activities + Conversion Rates */}
        <div className="space-y-6">
          {/* Evolução de Atividades (Line Chart Style) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-80 flex flex-col">
            <h3 className="text-base font-bold text-[#1e293b] mb-6">Evolução de Atividades</h3>
            <div className="flex-1 relative flex items-end">
              {/* Fake Line Chart Representation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#0047AB"
                  strokeWidth="2"
                  points="0,95 10,95 20,95 30,5 40,95 50,95 60,95 70,95 80,95 90,95 100,95"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute bottom-2 w-full flex justify-between text-[9px] font-bold text-gray-300">
                <span>03/02</span>
                <span>07/02</span>
                <span>11/02</span>
                <span>15/02</span>
                <span>19/02</span>
                <span>23/02</span>
                <span>28/02</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-bold text-gray-400">Leads Criados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-gray-400">Reuniões Marcadas</span>
              </div>
            </div>
          </div>

          {/* Taxas de Conversão Horizontal Chart */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[420px] flex flex-col">
            <h3 className="text-base font-bold text-[#1e293b] mb-8">Taxas de Conversão</h3>
            <div className="flex-1 space-y-10 relative pr-4">
              {/* Vertical Guide Lines */}
              <div className="absolute inset-0 flex justify-between pointer-events-none ml-28">
                <div className="h-full border-l border-dashed border-gray-100"></div>
                <div className="h-full border-l border-dashed border-gray-100"></div>
                <div className="h-full border-l border-dashed border-gray-100"></div>
              </div>

              {[
                { label: 'Lead → Contato Iniciado', width: '2%' },
                { label: 'Contato Iniciado → Reunião Marcada', width: '80%' },
                { label: 'Reunião Marcada → Proposta Enviada', width: '2%' },
                { label: 'Proposta Enviada → Fechado', width: '2%' }
              ].map((rate, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-28 text-right text-[9px] font-bold text-gray-400 uppercase leading-tight">
                    {rate.label}
                  </div>
                  <div className="flex-1 h-8 bg-gray-50 rounded-lg relative overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-lg shadow-sm transition-all duration-1000" style={{ width: rate.width }}></div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between ml-32 text-[9px] font-bold text-gray-300 mt-4">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ranking + AI Briefing */}
        <div className="space-y-6">
          {/* Ranking de Fechamentos (Reduced height to fit Briefing) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-base font-bold text-[#1e293b] mb-8">Ranking de Fechamentos</h3>
            <div className="flex-1 space-y-4">
              {ranking.map((member, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-4 text-xs font-bold text-gray-300">
                    {i === 0 ? <Trophy size={16} className="text-orange-400" /> : i === 1 ? <Trophy size={16} className="text-gray-300" /> : i === 2 ? <Trophy size={16} className="text-orange-300" /> : i + 1}
                  </div>
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-500 shadow-sm">
                    {member.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-700 truncate">{member.name}</p>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="text-base font-bold text-[#1e293b]">
                    {member.value}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-[#f8fafc] border border-gray-100 rounded-xl text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
              Ver Ranking Completo <ArrowRight size={14} />
            </button>
          </div>

          {/* Briefing do Time Card (IA) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles size={18} />
                <h3 className="text-base font-bold text-[#1e293b]">Briefing do Time</h3>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                <RefreshCcw size={12} /> Gerar
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <Sparkles size={28} />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-bold text-[#1e293b]">Resumo com IA</h4>
                <p className="text-xs text-gray-400 font-medium max-w-[200px] leading-relaxed">
                  Gere um resumo inteligente do desempenho do time
                </p>
              </div>

              <button className="w-full max-w-[220px] bg-[#0047AB] text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                <Sparkles size={14} /> Gerar Briefing
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Crm;
