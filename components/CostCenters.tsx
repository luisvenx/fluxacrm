
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Plus, 
  ChevronDown, 
  Calendar, 
  PieChart 
} from 'lucide-react';
import NewCostCenterModal from './NewCostCenterModal';
import ExportPDFModal from './ExportPDFModal';

const CostCenters: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e0e7ff] rounded-xl flex items-center justify-center text-[#4338ca] shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Centros de Custo</h2>
            <p className="text-sm text-gray-500 font-medium">Analise a alocação de gastos por área</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={18} className="text-gray-400" />
            Exportar PDF
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Novo Centro
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[180px]">
            <select className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700">
              <option>Todos</option>
              <option>Operacional</option>
              <option>Marketing</option>
              <option>RH</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <button className="flex items-center gap-4 bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-400 hover:border-blue-300 transition-all min-w-[140px]">
              Data início
            </button>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <button className="flex items-center gap-4 bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-400 hover:border-blue-300 transition-all min-w-[140px]">
              Data fim
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <PieChart size={18} className="text-gray-400" />
            Distribuição por Centro de Custo
          </h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
            <PieChart size={48} strokeWidth={1.5} />
          </div>
          <p className="text-gray-400 font-medium text-lg">Nenhum gasto registrado no período</p>
        </div>
      </div>

      {/* Modals Integration */}
      <NewCostCenterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <ExportPDFModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />

    </div>
  );
};

export default CostCenters;
