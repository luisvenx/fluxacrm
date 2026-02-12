import React, { useState } from 'react';
import { X, Layout, Eye, Bell, Check, Target, BarChart3, Settings2 } from 'lucide-react';

interface ConfigDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigDashboardModal: React.FC<ConfigDashboardModalProps> = ({ isOpen, onClose }) => {
  const [kpis, setKpis] = useState({
    entradas: true,
    saidas: true,
    ebitda: true,
    share: true,
  });

  const [alerts, setAlerts] = useState({
    budget: true,
    latePayments: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[550px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Settings2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configurações do Painel</h2>
              <p className="text-xs text-slate-400 font-medium">Personalize sua experiência analítica</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 pt-4 space-y-8">
          {/* Seção KPIs */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-2 tracking-widest">
              <Eye size={14} className="text-blue-500" /> Visibilidade de Métricas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'entradas', label: 'Entradas de Caixa' },
                { id: 'saidas', label: 'Saídas e Despesas' },
                { id: 'ebitda', label: 'Margem EBITDA' },
                { id: 'share', label: 'Performance de Ativos' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setKpis(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof kpis] }))}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                    kpis[item.id as keyof typeof kpis] 
                      ? 'border-blue-100 bg-blue-50/30' 
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-semibold ${kpis[item.id as keyof typeof kpis] ? 'text-blue-700' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    kpis[item.id as keyof typeof kpis] ? 'bg-blue-600 border-blue-600 scale-110 shadow-sm' : 'bg-white border-slate-200'
                  }`}>
                    {kpis[item.id as keyof typeof kpis] && <Check size={10} className="text-white" strokeWidth={4} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seção Alertas */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-2 tracking-widest">
              <Bell size={14} className="text-rose-500" /> Notificações Inteligentes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem]">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Alerta de Budget Crítico</p>
                  <p className="text-[11px] text-slate-400 font-medium">Avisar quando despesas superarem 90% do teto</p>
                </div>
                <button 
                  onClick={() => setAlerts(prev => ({ ...prev, budget: !prev.budget }))}
                  className={`w-11 h-6 rounded-full relative transition-all duration-300 ${alerts.budget ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${alerts.budget ? 'left-[22px]' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Forecast Settings */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-2 tracking-widest">
              <BarChart3 size={14} className="text-emerald-500" /> Parâmetros de Projeção
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider ml-1">Taxa de Conversão Base (%)</label>
              <input 
                type="number" 
                defaultValue="20"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigDashboardModal;