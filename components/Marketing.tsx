
import React from 'react';
import { 
  ListTodo, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Share2, 
  LineChart, 
  BarChart3, 
  ChevronRight,
  Info
} from 'lucide-react';

const Marketing: React.FC = () => {
  const stats = [
    { label: 'Tasks em Aberto', value: '0', icon: <ListTodo size={18} />, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Tasks Atrasadas', value: '0', icon: <Clock size={18} />, color: 'text-red-400', bgColor: 'bg-red-50' },
    { label: 'Aguardando Aprovação', value: '0', icon: <AlertCircle size={18} />, color: 'text-orange-400', bgColor: 'bg-orange-50' },
    { label: 'Aprovadas (Mês)', value: '0', icon: <CheckCircle2 size={18} />, color: 'text-emerald-400', bgColor: 'bg-emerald-50' },
    { label: 'Postadas (Mês)', value: '0', icon: <Share2 size={18} />, color: 'text-purple-400', bgColor: 'bg-purple-50' },
  ];

  const kanbanStages = [
    { name: 'Backlog', count: 0, color: 'bg-blue-500' },
    { name: 'Em Andamento', count: 0, color: 'bg-orange-400' },
    { name: 'Aprovação', count: 0, color: 'bg-purple-500' },
    { name: 'Publicado', count: 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Dashboard Marketing</h2>
        <p className="text-sm text-gray-400 font-medium">Acompanhe a produção, aprovação e performance dos conteúdos</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-gray-200 transition-all">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 tracking-tight">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-full ${stat.bgColor} ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Created vs Completed */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-80 flex flex-col group hover:border-gray-200 transition-all">
          <div className="flex items-center gap-2 mb-6">
            <LineChart size={18} className="text-gray-900" />
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Tasks Criadas vs Concluídas</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-300 font-medium italic">Nenhuma task criada ainda</p>
          </div>
        </div>

        {/* Bottlenecks per Phase */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-80 flex flex-col group hover:border-gray-200 transition-all">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-gray-900" />
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Gargalos por Fase</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-300 font-medium italic">Nenhum gargalo identificado</p>
          </div>
        </div>
      </div>

      {/* Kanban Overview Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Visão por Kanban</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-0 shadow-sm overflow-hidden group hover:border-blue-200 transition-all border-t-4 border-t-blue-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900">Marketing Geral</h4>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Progress Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Progresso</span>
                  <span>0/0</span>
                </div>
                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full w-0 bg-blue-600 rounded-full transition-all duration-1000"></div>
                </div>
              </div>

              {/* Icon Stats bar */}
              <div className="flex items-center gap-6 pb-6 border-b border-gray-50 mb-6">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Info size={14} />
                  <span className="text-xs font-bold">0</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <Clock size={14} />
                  <span className="text-xs font-bold">0</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-bold">0</span>
                </div>
              </div>

              {/* Stages List */}
              <div className="space-y-4">
                {kanbanStages.map((stage, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                      <span className="text-[13px] font-medium text-gray-600">{stage.name}</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900">{stage.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Marketing;
