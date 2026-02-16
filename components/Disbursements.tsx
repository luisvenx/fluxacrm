
import React, { useState, useEffect } from 'react';
import { 
  HandCoins, 
  Plus, 
  ChevronDown, 
  Receipt, 
  Info, 
  Loader2, 
  Database,
  ArrowUpRight,
  User,
  RefreshCcw,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Download,
  FileText,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DisbursementsProps {
  user: any;
}

const Disbursements: React.FC<DisbursementsProps> = ({ user }) => {
  const [disbursements, setDisbursements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [summary, setSummary] = useState({
    gross: 0,
    fees: 0,
    net: 0,
    pendingCount: 0
  });

  const fetchDisbursements = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: props, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Alugado');

      if (error) throw error;

      const formatted = (props || []).map(p => {
        const gross = Number(p.rent_price) || 0;
        const adminFee = gross * 0.10;
        const net = gross - adminFee;

        return {
          id: p.id,
          property_title: p.title,
          property_address: p.address,
          owner_name: 'Proprietário SQL Exemplo',
          gross_rent: gross,
          admin_fee: adminFee,
          net_repasse: net,
          status: 'Aguardando Pagamento',
          due_date: '10/02/2026'
        };
      });

      setDisbursements(formatted);
      
      const totalGross = formatted.reduce((acc, curr) => acc + curr.gross_rent, 0);
      const totalFees = formatted.reduce((acc, curr) => acc + curr.admin_fee, 0);
      const totalNet = formatted.reduce((acc, curr) => acc + curr.net_repasse, 0);

      setSummary({
        gross: totalGross,
        fees: totalFees,
        net: totalNet,
        pendingCount: formatted.length
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
            Repasses <span className="text-[#01223d] not-italic">Financeiros</span>
          </h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">Gestão de liquidação de aluguéis e comissões</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button onClick={fetchDisbursements} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#01223d] transition-all shadow-sm"><RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} /></button>
           <button className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">Processar Lote SQL</button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-center justify-between group hover:border-[#b4a183] transition-all">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total a Repassar</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{formatCurrency(summary.net)}</h3>
            <span className="text-[9px] font-black text-[#01223d] uppercase flex items-center gap-1 mt-2 opacity-60">
              <Clock size={10} /> Ciclo Fev/26
            </span>
          </div>
          <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform"><HandCoins size={28} className="text-[#b4a183]" /></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Taxas de Adm. (MRR)</p>
            <h3 className="text-2xl font-black text-emerald-600 tracking-tighter italic">{formatCurrency(summary.fees)}</h3>
            <span className="text-[9px] font-black text-emerald-400 uppercase flex items-center gap-1 mt-2">
               <TrendingUp size={10} /> Receita Líquida Imob.
            </span>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform"><DollarSign size={28} /></div>
        </div>

        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl flex flex-col justify-center group overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Conciliação Automática</p>
              <h3 className="text-3xl font-black text-white tracking-tighter italic">94.8%</h3>
              <div className="w-full bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#b4a183] h-full" style={{ width: '94%' }}></div>
              </div>
           </div>
           <CheckCircle2 className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-50/20">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Journal de <span className="text-[#01223d] not-italic">Liquidação</span></h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Auditado via Ledger Privado</p>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
             <thead>
               <tr className="bg-white border-b border-slate-100">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imóvel & Proprietário</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aluguel Bruto</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Taxa Adm (10%)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Líquido Repasse</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Situação</th>
                  <th className="px-8 py-5 w-10"></th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {isLoading ? (
                  <tr><td colSpan={6} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processando Matriz...</p></td></tr>
               ) : disbursements.length === 0 ? (
                  <tr><td colSpan={6} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum aluguel ativo localizado</p></td></tr>
               ) : (
                 disbursements.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                     <td className="px-10 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-[#01223d] transition-colors italic">{item.property_title}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[250px] tracking-tight">{item.owner_name}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900 italic">{formatCurrency(item.gross_rent)}</span>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-sm font-black text-rose-500 italic">-{formatCurrency(item.admin_fee)}</span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 inline-block">
                           <span className="text-sm font-black text-emerald-600 italic">{formatCurrency(item.net_repasse)}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-center">
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                          item.status === 'Pago' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setSelectedReceipt(item)}
                             className="p-2 text-slate-300 hover:text-[#01223d] transition-all"
                             title="Ver Recibo"
                           >
                              <FileText size={18} />
                           </button>
                           <button className="p-2 text-slate-200 hover:text-slate-900 transition-all">
                             <MoreVertical size={18} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Disbursements;
