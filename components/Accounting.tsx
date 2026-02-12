
import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DRE');

  const dreData = [
    { label: 'RECEITA BRUTA OPERACIONAL', value: 'R$ 450.000,00', type: 'header' },
    { label: 'Vendas de Produtos', value: 'R$ 150.000,00', type: 'item', level: 1 },
    { label: 'Prestação de Serviços', value: 'R$ 300.000,00', type: 'item', level: 1 },
    { label: '(-) DEDUÇÕES E IMPOSTOS', value: 'R$ (42.500,00)', type: 'item', level: 1, color: 'text-red-600' },
    { label: 'RECEITA LÍQUIDA OPERACIONAL', value: 'R$ 407.500,00', type: 'subtotal' },
    { label: '(-) CUSTOS OPERACIONAIS (CPV/CSP)', value: 'R$ (120.000,00)', type: 'item', level: 1, color: 'text-red-600' },
    { label: 'LUCRO BRUTO', value: 'R$ 287.500,00', type: 'subtotal' },
    { label: '(-) DESPESAS OPERACIONAIS', value: 'R$ (95.000,00)', type: 'header' },
    { label: 'Despesas Administrativas', value: 'R$ (45.000,00)', type: 'item', level: 1 },
    { label: 'Despesas com Vendas', value: 'R$ (35.000,00)', type: 'item', level: 1 },
    { label: 'Despesas Financeiras Líquidas', value: 'R$ (15.000,00)', type: 'item', level: 1 },
    { label: 'EBITDA (LAJIDA)', value: 'R$ 192.500,00', type: 'total' },
    { label: 'MARGEM EBITDA (%)', value: '42.7%', type: 'metric' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#002147] rounded-lg flex items-center justify-center text-white shadow-lg">
            <Scale size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Inteligência Contábil</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Relatórios gerenciais consolidados</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
             <Download size={14} /> Exportar Excel
           </button>
           <button className="flex items-center gap-2 px-6 py-2 bg-[#002147] text-white rounded text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg">
             <Settings size={14} /> Configurar Plano
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-slate-200 rounded p-1">
                  {['DRE', 'DFC', 'Balanço'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-1.5 rounded text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exercício 2026</span>
                 <button className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50"><Filter size={14} className="text-slate-400"/></button>
              </div>
            </div>

            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Mensal (Realizado)</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-32">AV %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dreData.map((row, i) => (
                    <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.type === 'total' ? 'bg-[#002147]/5' : ''}`}>
                      <td className={`px-8 py-4 text-[11px] font-bold uppercase tracking-tight ${
                        row.type === 'header' ? 'text-slate-900' : 
                        row.type === 'subtotal' ? 'text-[#002147] pl-8' : 
                        row.type === 'total' ? 'text-[#002147] font-black text-sm' :
                        row.type === 'metric' ? 'text-blue-600 pl-12 italic' : 'text-slate-500 pl-12'
                      }`}>
                        {row.label}
                      </td>
                      <td className={`px-8 py-4 text-[12px] font-black text-right tracking-tighter ${
                        row.type === 'total' ? 'text-[#002147] text-sm' : row.color || 'text-slate-700'
                      }`}>
                        {row.value}
                      </td>
                      <td className="px-8 py-4 text-[10px] font-black text-slate-300 text-right">
                        {row.type === 'item' ? '100%' : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#002147] rounded-lg p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingUp size={80} />
              </div>
              <div className="relative z-10 space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Performance Líquida</h4>
                 <div className="space-y-1">
                   <p className="text-3xl font-black tracking-tighter">R$ 192,5k</p>
                   <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight flex items-center gap-1">
                     <ArrowUpRight size={12}/> +14.2% vs jan
                   </p>
                 </div>
                 <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Forecast Março</span>
                       <span className="text-xs font-bold">R$ 210,0k</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full w-[85%] bg-blue-500"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Info size={14} className="text-blue-600"/> Insights IA
              </h4>
              <div className="space-y-4">
                 <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                   Seu <span className="font-black text-slate-900">Break-Even Point</span> foi atingido no dia 14/02. A projeção de lucro cresceu 8% acima da média do setor.
                 </p>
                 <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-500 hover:bg-slate-100">
                   Análise Detalhada
                 </button>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Accounting;
