
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Upload, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  MoreVertical,
  Loader2,
  Database
} from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import ImportModal from './ImportModal';
import { supabase } from '../lib/supabase';

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ['Todos', 'Pagos', 'Pendentes', 'Atrasados'];

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          bank_accounts (name),
          cost_centers (name)
        `)
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
  }, []);

  // Lógica de Filtragem (Tab + Search)
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filtro por Tab
    if (selectedTab === 'Pagos') {
      result = result.filter(t => t.status === 'PAID');
    } else if (selectedTab === 'Pendentes') {
      result = result.filter(t => t.status === 'PENDING');
    } else if (selectedTab === 'Atrasados') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(t => t.status === 'PENDING' && t.competence_date < today);
    }

    // Filtro por Busca
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* Header Centralizado nos Dados Reais */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={16} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Banco de Dados PostgreSQL Ativo</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Ledger Financeiro</h2>
          <p className="text-slate-500 font-medium text-sm">Exibindo {filteredTransactions.length} registros sincronizados.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 shadow-sm"
          >
            Importar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Registro
          </button>
        </div>
      </div>

      {/* Toolbar de Controle */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-[1.25rem] w-full lg:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2 rounded-[1rem] text-xs font-bold transition-all ${selectedTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto pr-2">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar por descrição..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 text-slate-600 placeholder:text-slate-300"
            />
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Competência</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">C. Custo</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultando Supabase Engine...</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                       <Database size={24} className="text-slate-200" />
                    </div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Nenhum dado encontrado para os filtros aplicados</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-8 py-5">
                      <span className="text-sm font-semibold text-slate-400">{formatDate(item.competence_date)}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${item.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {item.type === 'IN' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight">{item.description}</p>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                            {item.bank_accounts?.name || 'NÃO VINCULADO'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-tight">
                        {item.cost_centers?.name || 'GERAL'}
                      </span>
                    </td>
                    <td className={`px-8 py-5 text-sm font-bold text-right tracking-tight ${item.type === 'IN' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.type === 'IN' ? '+' : '-'} {formatCurrency(item.amount)}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${
                        item.status === 'PAID' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 
                        'bg-amber-50 text-amber-500 border-amber-100'
                      }`}>
                        {item.status === 'PAID' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchTransactions(); }} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Transactions;
