import React, { useState } from 'react';
import { 
  Settings2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Users,
  Target,
  Info,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import RecentEntries from './RecentEntries';
import CustomersTable from './CustomersTable';
import ExportPDFModal from './ExportPDFModal';
import ConfigDashboardModal from './ConfigDashboardModal';

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mês');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const periods = ['7D', '15D', '30D', '90D', 'FY'];
  const chartLabels = ['01', '05', '10', '15', '20', '25', '28'];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* SaaS Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Bom dia, Kyrooss</h2>
          <p className="text-slate-500 font-medium mt-1">Aqui está o que está acontecendo com suas finanças hoje.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedPeriod === period ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {period}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all shadow-sm group"
            title="Configurações do Painel"
          >
            <Settings2 size={18} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>

      {/* Modern KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Entradas" value="R$ 142.580,00" subtitle="+12.5% vs último mês" icon={<ArrowDownLeft />} color="blue" />
        <StatCard title="Saídas" value="R$ 89.420,00" subtitle="-4.2% vs último mês" icon={<ArrowUpRight />} color="red" />
        <StatCard title="EBITDA Líquido" value="R$ 53.160,00" subtitle="Margem de 37.2%" icon={<TrendingUp />} color="emerald" />
        <StatCard title="Churn Rate" value="2.1%" subtitle="Meta de < 3.0%" icon={<Users />} color="blue" />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <ChartCard 
            title="Fluxo de Caixa"
            xAxisLabels={chartLabels}
            legend={[
              { label: 'Receitas', color: '#2563eb' },
              { label: 'Despesas', color: '#f43f5e' }
            ]}
          />
        </div>
        
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col hover:shadow-md transition-all group">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Target size={16} className="text-blue-600" /> Meta de Receita
            </h4>
            <div className="p-1.5 bg-slate-50 rounded-full">
              <Info size={14} className="text-slate-300" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="80" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle cx="88" cy="88" r="80" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="502.4" strokeDashoffset={502.4 * (1 - 0.78)} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900 tracking-tighter">78%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atingido</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">R$ 192.400</p>
              <p className="text-sm text-slate-400 font-medium">Meta: R$ 250.000,00</p>
            </div>
            <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all">
              Ver Detalhes do Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentEntries />
        <CustomersTable />
      </div>

      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4">
        <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></div> 
            Sistemas Operacionais
          </span>
          <span>Última atualização: agora mesmo</span>
        </div>
      </div>

      <ExportPDFModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <ConfigDashboardModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} />
    </div>
  );
};

export default Dashboard;