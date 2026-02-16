
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical,
  Loader2,
  Database,
  RefreshCcw,
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import ImportModal from './ImportModal';
import { supabase } from '../lib/supabase';

interface TransactionsProps {
  user: any;
}

const Transactions: React.FC<TransactionsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ['Todos', 'Pagos', 'Pendentes', 'Atrasados'];

  const fetchTransactions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          bank_accounts (name),
          cost_centers (name)
        `)
        .eq('user_id', user.id)
        .order('competence_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (selectedTab === 'Pagos') result = result.filter(t => t.status === 'PAID');
    else if (selectedTab === 'Pendentes') result = result.filter(t => t.status === 'PENDING');
    else if (selectedTab === 'Atrasados') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(t => t.status === 'PENDING' && t.competence_date < today);
    }
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.description?.toLowerCase().includes(lowSearch) || 
        t.bank_accounts?.name?.toLowerCase().includes(lowSearch)
      );
    }
    return result;
  }, [transactions, selectedTab, searchTerm]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      
      {/* Pattern Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Journal de <span className="text-[#01223d] not-italic">Lançamentos</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Auditória de fluxo de caixa operacional SQL</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            Importação
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Registrar
          </button>
        </div>
      </div>

      {/* Toolbar Executiva */}
      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedTab === tab ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto px-2">
          <div className="relative flex-1 lg:w-96 group ml-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar registros..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 outline-none text-slate-600 transition-all"
            />
          </div>
          <button onClick={fetchTransactions} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabela Master - Arredondamento Reduzido */}
      <div className="relative z-10 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Competência</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição & Conta</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Auditado</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando Ledger...</p></td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={5} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum registro localizado</p></td></tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight italic uppercase">{new Date(item.competence_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Auditado</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-110 ${item.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                          {item.type === 'IN' ? <ArrowDownLeft size={16} strokeWidth={3} /> : <ArrowUpRight size={16} strokeWidth={3} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate max-w-[250px] uppercase italic tracking-tight">{item.description}</p>
                          <p className="text-[9px] font-black text-[#01223d] uppercase tracking-widest mt-1 opacity-60">{item.bank_accounts?.name || 'Caixa Local'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <p className={`text-base font-black ${item.type === 'IN' ? 'text-emerald-600' : 'text-slate-900'} tracking-tighter italic`}>
                         {item.type === 'IN' ? '+' : '-'} {formatCurrency(item.amount)}
                       </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                        item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {item.status === 'PAID' ? 'Liquidez' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2.5 text-slate-200 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
                         <MoreVertical size={18}/>
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchTransactions(); }} user={user} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Transactions;
