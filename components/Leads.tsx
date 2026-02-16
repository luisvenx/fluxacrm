
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical,
  Loader2,
  Database,
  RefreshCcw,
  UserPlus,
  UserCheck,
  Zap,
  DollarSign,
  Filter
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import ImportLeadsModal from './ImportLeadsModal';
import { supabase } from '../lib/supabase';

interface LeadsProps {
  user: any;
}

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Erro Leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.property_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const stats = useMemo(() => {
    const totalValue = filteredLeads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    return {
      count: filteredLeads.length,
      value: totalValue
    };
  }, [filteredLeads]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      {/* Pattern Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Base de <span className="text-blue-600 not-italic">Oportunidades</span>
          </h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-4">Gestão centralizada de leads e contatos isolados</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            Importar em Massa
          </button>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Novo Cadastro
          </button>
        </div>
      </div>

      {/* Leads Summary Row */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 group hover:border-blue-100 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <UserPlus size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contatos Totais</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stats.count}</h3>
            </div>
         </div>
         <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 group hover:border-emerald-100 transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <DollarSign size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor em Pipeline</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(stats.value)}</h3>
            </div>
         </div>
         <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 group hover:border-indigo-100 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
               <RefreshCcw size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status da Base</p>
               <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Sincronizado</h3>
            </div>
         </div>
      </div>

      {/* Filters Toolbar */}
      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, empresa ou imóvel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
             <Filter size={16} />
           </button>
           <button onClick={fetchLeads} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
             <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="relative z-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificação do Contato</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Fase Pipeline</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Potencial Comercial</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Origem / Canal</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-blue-500 mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando Base...</p></td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={5} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum registro localizado</p></td></tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-blue-400 border border-slate-700 rounded-2xl flex items-center justify-center font-black text-sm shadow-md italic group-hover:scale-110 transition-transform">
                          {lead.name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[250px] italic">{lead.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{lead.phone || 'Sem Telefone'}</span>
                             <span className="text-slate-200">•</span>
                             <span className="text-[9px] text-blue-500 font-black uppercase">REF: {lead.property_code || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 shadow-sm">
                        {lead.stage || 'lead'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-base font-black text-slate-900 tracking-tighter">{formatCurrency(lead.value || 0)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{lead.origin || 'Outbound'}</span>
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

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); fetchLeads(); }} user={user} />
      <ImportLeadsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Leads;
