
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Download, 
  Plus, 
  Search, 
  ArrowDownLeft, 
  Target, 
  MoreVertical,
  Loader2,
  Database
} from 'lucide-react';
import NewCostCenterModal from './NewCostCenterModal';
import ExportPDFModal from './ExportPDFModal';
import { supabase } from '../lib/supabase';

const CostCenters: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Anual');
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCostCenters = async () => {
    setIsLoading(true);
    try {
      // Busca centros e soma de transações OUT vinculadas
      const { data, error } = await supabase
        .from('cost_centers')
        .select(`
          *,
          transactions(amount, type)
        `);

      if (error) throw error;

      const formatted = data.map(center => {
        const spent = center.transactions
          ?.filter((t: any) => t.type === 'OUT')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
        
        const budget = Number(center.budget) || 1;
        const perc = Math.min((spent / budget) * 100, 100);

        return { ...center, spent, perc };
      });

      setCostCenters(formatted);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCenters();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Centros de Custo</h2>
          <p className="text-slate-500 font-medium mt-1">Gestão estratégica sincronizada com PostgreSQL.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsExportModalOpen(true)} className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={18} /> Relatórios
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Plus size={18} /> Novo Centro
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultando Estrutura...</p>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {costCenters.map((center) => (
              <div key={center.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-md transition-all group relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight uppercase">{center.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">Budget: {formatCurrency(center.budget)}</p>
                  </div>
                  <button className="text-slate-200 hover:text-slate-900"><MoreVertical size={18} /></button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(center.spent)}</span>
                    <span className="text-xs font-bold text-slate-400">{center.perc.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-1000 shadow-sm" style={{ width: `${center.perc}%` }}></div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-widest">ID: {center.code || 'S/C'}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <button onClick={() => setIsModalOpen(true)} className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-50 group">
              <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all">
                <Plus size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">Novo Centro</p>
            </button>
          </div>
        )}
      </div>

      <NewCostCenterModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchCostCenters(); }} />
      <ExportPDFModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default CostCenters;
