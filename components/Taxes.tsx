
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  FileText, 
  Percent, 
  CheckCircle2, 
  Clock,
  CreditCard,
  Receipt,
  Download,
  Info,
  ArrowUpRight,
  Loader2,
  Database
} from 'lucide-react';
import NewTaxModal from './NewTaxModal';
import { supabase } from '../lib/supabase';

const Taxes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tributos');
  const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [provisionedTotal, setProvisionedTotal] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Buscar tributos cadastrados
      const { data: taxesData } = await supabase.from('taxes').select('*');
      setTaxes(taxesData || []);

      // 2. Calcular provisão baseada na Receita do mês (Simplificado)
      const { data: txs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'IN')
        .eq('status', 'PAID');

      const revenue = txs?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      
      // Soma as alíquotas e aplica sobre a receita
      const totalRate = taxesData?.reduce((acc, t) => acc + (Number(t.rate) || 0), 0) || 0;
      setProvisionedTotal(revenue * (totalRate / 100));

    } catch (err) {
      console.error('Erro ao buscar impostos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fiscal Engine Sincronizado</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Impostos & Taxas</h2>
          <p className="text-slate-500 font-medium">Controle de obrigações tributárias baseado no faturamento real.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} /> Exportar Guia
          </button>
          <button 
            onClick={() => setIsNewTaxModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Novo Tributo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Provisionado</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : formatCurrency(provisionedTotal)}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Estimativa mensal (Realizado)</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Configuração Fiscal</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{taxes.length} Ativos</h3>
          <p className="text-xs text-blue-500 font-semibold mt-1">Regras de cálculo ativas</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-6 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Regularidade</p>
          <h3 className="text-2xl font-bold text-emerald-600 tracking-tight">Em Dia</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Nenhuma pendência crítica</p>
        </div>
        <div className="bg-slate-900 rounded-[1.75rem] p-6 shadow-xl text-white">
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4">Próximo Vencimento</p>
          <h3 className="text-2xl font-bold tracking-tight">Dia 20</h3>
          <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">DAS - Simples Nac.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl">
            {['Tributos', 'Retenções'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
               <Calendar size={16} /> Período Atual
             </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Calculando Impostos...</p>
          </div>
        ) : taxes.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
              <Receipt size={40} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma regra cadastrada</h3>
              <p className="text-sm text-slate-400 font-medium">Cadastre seus impostos para automatizar a provisão mensal.</p>
            </div>
            <button 
              onClick={() => setIsNewTaxModalOpen(true)}
              className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
            >
              Configurar regra manual
            </button>
          </div>
        ) : (
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tributo</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Esfera</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Alíquota</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vencimento</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {taxes.map(tax => (
                  <tr key={tax.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-5 font-bold text-slate-800 text-sm">{tax.name}</td>
                    <td className="py-5 text-xs text-slate-500 uppercase font-semibold">{tax.sphere}</td>
                    <td className="py-5 text-center font-bold text-blue-600">{tax.rate}%</td>
                    <td className="py-5 text-center text-xs text-slate-400 font-bold">Todo dia {tax.due_day}</td>
                    <td className="py-5 text-right">
                       <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-emerald-100">Ativo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewTaxModal isOpen={isNewTaxModalOpen} onClose={() => { setIsNewTaxModalOpen(false); fetchData(); }} />
    </div>
  );
};

export default Taxes;
