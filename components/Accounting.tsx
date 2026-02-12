
import React, { useState } from 'react';
import { 
  Scale, 
  ChevronDown, 
  FileText, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  FileSearch
} from 'lucide-react';

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DRE');
  const [comparePrevious, setComparePrevious] = useState(false);

  const tabs = [
    { id: 'DRE', label: 'DRE', icon: <FileText size={16} /> },
    { id: 'DFC', label: 'DFC', icon: <BarChart3 size={16} /> },
    { id: 'Balanço', label: 'Balanço', icon: <Scale size={16} /> },
    { id: 'Configurações', label: 'Configurações', icon: <Settings size={16} /> },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
          <Scale size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Contábil / Relatórios</h2>
          <p className="text-sm text-gray-500 font-medium">DRE, DFC e Balanço Patrimonial gerencial</p>
        </div>
      </div>

      {/* Filter Top Bar Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-8">
            {/* Periodo Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-400">Período:</span>
              <div className="relative">
                <select className="bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer min-w-[140px]">
                  <option>Este Mês</option>
                  <option>Mês Anterior</option>
                  <option>Este Ano</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Comparison Toggle */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setComparePrevious(!comparePrevious)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className={`w-11 h-6 rounded-full transition-colors relative ${comparePrevious ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${comparePrevious ? 'left-6' : 'left-1'}`}></div>
                </div>
                <span className="text-sm font-bold text-gray-700">Comparar período anterior</span>
              </button>
            </div>

            {/* Regime Dropdown */}
            <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
              <span className="text-sm font-medium text-gray-400">Regime:</span>
              <div className="relative">
                <select className="bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer">
                  <option>Caixa</option>
                  <option>Competência</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Visão Dropdown */}
            <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
              <span className="text-sm font-medium text-gray-400">Visão:</span>
              <div className="relative">
                <select className="bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm font-bold text-gray-700 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer">
                  <option>Consolidado</option>
                  <option>Individual</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Date Label */}
          <div className="text-sm font-bold text-gray-400 uppercase tracking-tight">
            01 fev - 28 fev 2026
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill bar */}
      <div className="inline-flex p-1.5 bg-[#f1f5f9] rounded-xl border border-gray-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content View (DRE View) */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
        {/* Card Header Title */}
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <FileText size={20} className="text-gray-900" />
          <h3 className="text-xl font-bold text-[#1e293b]">DRE - Demonstração do Resultado</h3>
        </div>

        {/* Empty State / Configuration Needed Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-400">
            <AlertTriangle size={32} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-[#1e293b]">Configuração Necessária</h4>
            <p className="text-gray-500 font-medium leading-relaxed">
              Para gerar o DRE, você precisa configurar o plano de contas e mapear suas categorias.
            </p>
          </div>

          <button className="bg-[#0047AB] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            Configurar Plano de Contas
          </button>
        </div>
      </div>

    </div>
  );
};

export default Accounting;
