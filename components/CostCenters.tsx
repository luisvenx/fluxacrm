
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Plus, 
  MoreVertical,
  Loader2,
  Database,
  RefreshCcw,
  Target,
  Zap,
  Info
} from 'lucide-react';
import NewCostCenterModal from './NewCostCenterModal';
import ExportPDFModal from './ExportPDFModal';
import { supabase } from '../lib/supabase';

interface CostCentersProps {
  user: any;
}

const CostCenters: React.FC<CostCentersProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCostCenters = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cost_centers')
        .select('*, transactions(amount, type, status)')
        .eq('user_id', user.id); 

      if (error) throw error;

      const formatted = (data || []).map(center => {
        const spent = center.transactions
          ?.filter((t: any) => t.type === 'OUT' && t.status === 'PAID')
          .reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
        const budget = Number(center.budget) || 1;
        const perc = Math.min((spent / budget) * 100, 100);
        return { ...center, spent, perc };
      });
      setCostCenters(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCenters();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Budget <span className="text-[#01223d] not-italic">& Alocação</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática por centros de custo e unidades SQL</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsExportModalOpen(true)} className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            Relatório Global
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 group">
            <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Provisionar Unidade
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Metas...</p></div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {costCenters.map((center) => (
            <div key={center.id} className="bg-white border border-slate-200 rounded-xl p-8 transition-all duration-500 group shadow-sm hover:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
               <div>
                 <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-[#01223d] text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center text-xl font-black italic shadow-lg group-hover:scale-110 transition-transform">
                      {center.code || 'ID'}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest border shadow-sm ${center.perc > 90 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-[#01223d] border-slate-100'}`}>
                         {center.perc > 90 ? 'Crítico' : 'Saudável'}
                       </span>
                       <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={18}/></button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase italic leading-none group-hover:text-[#01223d] transition-colors">{center.name}</h4>
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                       <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Teto Planejado</p>
                          <p className="text-xs font-bold text-slate-500 tracking-tight">{formatCurrency(center.budget)}</p>
                       </div>
                       <div className="space-y-0.5 text-right">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Consumido Real</p>
                          <p className="text-base font-black text-slate-900 tracking-tighter italic">{formatCurrency(center.spent)}</p>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="pt-8 space-y-2.5">
                  <div className="flex justify-between items-end">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilização dos Recursos</span>
                     <span className={`text-xs font-black ${center.perc > 90 ? 'text-rose-500' : 'text-[#01223d]'}`}>{center.perc.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div 
                      className={`h-full transition-all duration-1000 shadow-sm ${center.perc > 90 ? 'bg-rose-500 shadow-rose-200' : 'bg-[#01223d]'}`} 
                      style={{ width: `${center.perc}%` }}
                    ></div>
                  </div>
               </div>
               <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 bg-[#b4a183]"></div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:border-[#b4a183] transition-all group min-h-[340px]"
          >
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:text-[#01223d] group-hover:bg-slate-50 transition-all border border-slate-100 shadow-inner group-hover:rotate-90">
                <Plus size={24} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#01223d] block">Novo Centro de Custo</span>
                 <p className="text-[8px] text-slate-300 uppercase font-black">Estruturação SQL</p>
              </div>
          </button>
        </div>
      )}
      <NewCostCenterModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchCostCenters(); }} user={user} />
      <ExportPDFModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};

export default CostCenters;
