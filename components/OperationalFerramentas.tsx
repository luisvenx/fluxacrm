
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Plus, 
  DollarSign, 
  Clock,
  Search,
  Filter,
  MoreVertical,
  Layers,
  Zap,
  Loader2,
  Database,
  RefreshCcw,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import NewToolModal from './NewToolModal';
import { supabase } from '../lib/supabase';

interface OperationalFerramentasProps {
  user: any;
}

const OperationalFerramentas: React.FC<OperationalFerramentasProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTools = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      console.error('Erro ao buscar ferramentas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [user]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => 
      tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.provider?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tools, searchTerm]);

  const stats = useMemo(() => {
    const totalCount = tools.length;
    const monthlyCost = tools.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    
    return {
      totalCount,
      monthlyCost
    };
  }, [tools]);

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
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Tech <span className="text-[#01223d] not-italic">Stack</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Auditoria de infraestrutura e assinaturas SaaS SQL</p>
        </div>

        <button 
          onClick={() => setIsNewToolModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Nova Integração
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group hover:border-[#b4a183] transition-all">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recursos na Stack</p>
           <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{isLoading ? '...' : stats.totalCount}</h3>
              <div className="p-3 bg-slate-50 text-[#01223d] rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custo Mensal (Ref)</p>
           <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter truncate italic leading-none">{isLoading ? '...' : formatCurrency(stats.monthlyCost)}</h3>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <CreditCard size={20} />
              </div>
           </div>
        </div>

        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-40 group lg:col-span-2">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Status de Conectividade</p>
           <h3 className="text-3xl font-black tracking-tighter italic relative z-10 uppercase">Stack Consolidada</h3>
           <Wrench size={140} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
           <button onClick={fetchTools} className="relative z-10 w-fit p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
             <RefreshCcw size={14} className={`text-[#b4a183] ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por ferramenta ou provedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 transition-all outline-none text-slate-600"
          />
        </div>
        <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-sm">
          <Filter size={16} />
        </button>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ferramenta & Ecossistema</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Investimento SaaS</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando Stack...</p></td></tr>
              ) : filteredTools.length === 0 ? (
                <tr><td colSpan={4} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhuma ferramenta mapeada</p></td></tr>
              ) : (
                filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-slate-900 text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center font-black text-xs shadow-md italic group-hover:scale-110 transition-transform">
                            {tool.name?.substring(0, 1).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate italic leading-none">{tool.name}</p>
                            <p className="text-[9px] font-black text-[#01223d] uppercase tracking-widest mt-2 opacity-60">{tool.provider}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-base font-black text-slate-900 tracking-tighter italic">{formatCurrency(tool.price || 0)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm italic ${
                         tool.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                       }`}>
                         {tool.status || 'Ativo'}
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

      <NewToolModal isOpen={isNewToolModalOpen} onClose={() => { setIsNewToolModalOpen(false); fetchTools(); }} user={user} />
    </div>
  );
};

export default OperationalFerramentas;
