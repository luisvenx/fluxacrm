
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
  CreditCard
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

  // Busca ferramentas do banco de dados (tabela 'tools')
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

  // Filtra ferramentas baseado no termo de busca
  const filteredTools = useMemo(() => {
    return tools.filter(tool => 
      tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.provider?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tools, searchTerm]);

  // Calcula métricas da stack
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
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Stack de Ferramentas</h2>
          </div>
        </div>

        <button 
          onClick={() => setIsNewToolModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl md:rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Nova Ferramenta
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ativos na Stack</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Layers size={18} />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{isLoading ? '...' : `${stats.totalCount} Softwares`}</h3>
        </div>

        <div className="bg-white border border-slate-100 rounded-[1.75rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Custo Mensal Ref.</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">{isLoading ? '...' : formatCurrency(stats.monthlyCost)}</h3>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 md:px-0 mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou provedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando stack...</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ferramenta & Provedor</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Investimento</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md italic">
                          {tool.name?.substring(0,1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[200px]">{tool.name}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tool.provider}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-sm font-black text-slate-900 tracking-tighter">{formatCurrency(tool.price || 0)}</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                          tool.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {tool.status}
                        </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewToolModal isOpen={isNewToolModalOpen} onClose={() => { setIsNewToolModalOpen(false); fetchTools(); }} user={user} />
    </div>
  );
};

// Fix: Adicionando export default para evitar erro de importação no App.tsx
export default OperationalFerramentas;
