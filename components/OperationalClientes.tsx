
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown,
  Search,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Filter,
  ArrowUpRight,
  Activity,
  Target,
  Loader2,
  Database,
  RefreshCcw,
  Heart,
  ChevronRight
} from 'lucide-react';
import NewClientModal from './NewClientModal';
import { supabase } from '../lib/supabase';

interface OperationalClientesProps {
  user: any;
}

const OperationalClientes: React.FC<OperationalClientesProps> = ({ user }) => {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.segment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const stats = useMemo(() => {
    const totalActive = clients.filter(c => c.status === 'Ativo').length;
    const mrrTotal = clients.reduce((acc, curr) => acc + (Number(curr.mrr_value) || 0), 0);
    const avgHealth = clients.length > 0 
      ? Math.round(clients.reduce((acc, curr) => acc + (Number(curr.health_score) || 0), 0) / clients.length) 
      : 0;

    return {
      totalActive,
      mrrTotal,
      avgHealth
    };
  }, [clients]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Portfólio de <span className="text-[#01223d] not-italic">Clientes</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática de contas e saúde da carteira SQL</p>
        </div>

        <button 
          onClick={() => setIsNewClientModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Registrar Conta
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group hover:border-[#b4a183] transition-all">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Ativa</p>
           <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{stats.totalActive}</h3>
              <div className="w-10 h-10 bg-slate-50 text-[#01223d] rounded-lg border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receita Recorrente</p>
           <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter truncate italic">{formatCurrency(stats.mrrTotal)}</h3>
              <div className="w-10 h-10 bg-slate-50 text-[#b4a183] rounded-lg border border-slate-100 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score Avg</p>
           <div className="flex items-end justify-between">
              <h3 className={`text-3xl font-black tracking-tighter italic ${stats.avgHealth >= 80 ? 'text-emerald-500' : 'text-rose-500'}`}>{stats.avgHealth}%</h3>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={20} />
              </div>
           </div>
        </div>

        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-40 group">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Total na Base</p>
          <h3 className="text-3xl font-black tracking-tighter italic relative z-10 uppercase">{clients.length} Contas</h3>
          <Database size={120} className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar conta ou segmento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 transition-all outline-none text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
           <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-sm">
             <Filter size={16} />
           </button>
           <button onClick={fetchClients} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
             <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação da Conta</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">MRR Auditoria</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Health Score</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Base...</p></td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan={4} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum cliente localizado</p></td></tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center font-black text-xs shadow-md italic group-hover:scale-110 transition-transform">
                          {client.name?.substring(0,1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[250px] italic">{client.name}</p>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 border border-slate-200 px-2 py-0.5 rounded shadow-sm">{client.status}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-base font-black text-slate-900 tracking-tighter italic">{formatCurrency(client.mrr_value || 0)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                          (client.health_score || 0) >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {client.health_score}%
                        </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2.5 text-slate-200 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
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

      <NewClientModal isOpen={isNewClientModalOpen} onClose={() => { setIsNewClientModalOpen(false); fetchClients(); }} user={user} />
    </div>
  );
};

export default OperationalClientes;
