
import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ChevronDown, 
  FileText, 
  BarChart3, 
  Settings, 
  Download,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Info,
  Calendar,
  Sparkles,
  Search,
  Loader2,
  Database
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DRE');
  const [isLoading, setIsLoading] = useState(true);
  const [dreLines, setDreLines] = useState<any[]>([]);
  const [ebitdaMargin, setEbitdaMargin] = useState(0);
  const [totalEbitda, setTotalEbitda] = useState(0);

  const calculateDRE = async () => {
    setIsLoading(true);
    try {
      // 1. Buscar transações
      const { data: txs } = await supabase.from('transactions').select('*');
      
      // 2. Buscar impostos
      const { data: taxesData } = await supabase.from('taxes').select('rate');
      const avgTaxRate = (taxesData?.reduce((acc, t) => acc + Number(t.rate), 0) || 0) / 100;

      const revenue = txs?.filter(t => t.type === 'IN' && t.status === 'PAID').reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const taxes = revenue * avgTaxRate;
      const netRevenue = revenue - taxes;
      
      const operatingCosts = txs?.filter(t => t.type === 'OUT' && t.status === 'PAID').reduce((acc, t) => acc + Number(t.amount), 0) || 0;
      const grossProfit = netRevenue - operatingCosts; // Simplificação para demonstração
      
      const ebitda = grossProfit; // Na DRE simplificada
      const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

      setTotalEbitda(ebitda);
      setEbitdaMargin(margin);

      const format = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

      setDreLines([
        { label: 'RECEITA BRUTA OPERACIONAL', value: format(revenue), type: 'header' },
        { label: '(-) DEDUÇÕES E IMPOSTOS (EST.)', value: format(-taxes), type: 'item', level: 1, color: 'text-rose-600' },
        { label: 'RECEITA LÍQUIDA OPERACIONAL', value: format(netRevenue), type: 'subtotal' },
        { label: '(-) CUSTOS E DESPESAS PAGAS', value: format(-operatingCosts), type: 'item', level: 1, color: 'text-rose-600' },
        { label: 'EBITDA (LAJIDA) REALIZADO', value: format(ebitda), type: 'total' },
        { label: 'MARGEM EBITDA (%)', value: `${margin.toFixed(1)}%`, type: 'metric' },
      ]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateDRE();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Processamento de Dados Analíticos</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Inteligência Contábil</h2>
          <p className="text-slate-500 font-medium mt-1">Visão analítica gerada automaticamente a partir do Ledger.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} /> Exportar DRE
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 shadow-lg transition-all flex items-center gap-2">
            <Settings size={18} /> Plano de Contas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl">
                {['DRE', 'DFC', 'Balanço'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <Calendar size={14} /> Exercício Atual
                </div>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              {isLoading ? (
                <div className="py-24 text-center">
                   <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={40} />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consolidando DRE do mês...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30">
                      <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                      <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Acumulado</th>
                      <th className="px-10 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right w-32">Análise V.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {dreLines.map((row, i) => (
                      <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.type === 'total' ? 'bg-blue-50/30' : ''}`}>
                        <td className={`px-10 py-5 text-sm tracking-tight ${
                          row.type === 'header' ? 'font-bold text-slate-900' : 
                          row.type === 'subtotal' ? 'font-bold text-blue-600 pl-10' : 
                          row.type === 'total' ? 'font-black text-blue-700 text-lg' :
                          row.type === 'metric' ? 'text-slate-400 italic pl-14' : 'text-slate-600 pl-14'
                        }`}>
                          {row.label}
                        </td>
                        <td className={`px-10 py-5 text-sm font-bold text-right tracking-tight ${
                          row.type === 'total' ? 'text-blue-700 text-lg' : row.color || 'text-slate-700'
                        }`}>
                          {row.value}
                        </td>
                        <td className="px-10 py-5 text-[10px] font-black text-slate-300 text-right uppercase tracking-widest">
                          {row.type === 'item' ? '—' : '100%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#002147] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <TrendingUp size={150} />
            </div>
            <div className="relative z-10 space-y-6">
               <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/50">Performance Líquida</h4>
               <div className="space-y-1">
                 <p className="text-4xl font-bold tracking-tighter">
                   {isLoading ? '...' : (totalEbitda / 1000).toFixed(1) + 'k'}
                 </p>
                 <p className="text-xs font-bold text-emerald-400 uppercase tracking-tight flex items-center gap-1">
                   Lucro Operacional
                 </p>
               </div>
               <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Margem EBITDA</span>
                     <span className="text-sm font-bold">{ebitdaMargin.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${ebitdaMargin}%` }}></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-blue-100 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Insights Contábeis</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IA Financeira</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
              Sua margem está <span className="text-blue-600 font-bold">{(ebitdaMargin > 20 ? 'acima' : 'dentro')} da média</span> do setor. 
              {ebitdaMargin < 15 ? ' Recomenda-se revisar custos fixos.' : ' Há fôlego para aumentar o CAC em até 8%.'}
            </p>
            <button className="w-full py-3 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
              Análise Preditiva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting;
