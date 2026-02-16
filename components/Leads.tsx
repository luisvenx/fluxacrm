
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
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Base de <span className="text-[#01223d] not-italic">Oportunidades</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática de leads e contatos isolados SQL</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            Importação
          </button>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Registrar
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm flex items-center gap-6 group hover:border-[#b4a183] transition-all">
            <div className="w-14 h-14 bg-slate-50 text-[#01223d] rounded-xl border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
               <UserPlus size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Contatos</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{stats.count}</h3>
            </div>
         </div>
         <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
               <DollarSign size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Potencial</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{formatCurrency(stats.value)}</h3>
            </div>
         </div>
         <div className="bg-[#01223d] p-8 rounded-xl shadow-2xl flex items-center gap-6 relative overflow-hidden group">
            <div className="w-14 h-14 bg-white/10 text-[#b4a183] rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
               <RefreshCcw size={24} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sincronização</p>
               <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Sincronizado</h3>
            </div>
            <Database size={80} className="absolute -right-4 -bottom-4 text-white/5 opacity-5" />
         </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar interessado ou referência..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 transition-all outline-none text-slate-600 shadow-inner"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
           <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-sm">
             <Filter size={16} />
           </button>
           <button onClick={fetchLeads} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
             <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interessado & Identificação</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fase Pipeline</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Potencial Comercial</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Origem</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditando CRM...</p></td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={5} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum lead localizado</p></td></tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center font-black text-sm shadow-md italic group-hover:scale-110 transition-transform">
                          {lead.name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[250px] italic">{lead.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{lead.phone || 'S/ Telefone'}</span>
                             <span className="text-slate-200">•</span>
                             <span className="text-[9px] text-[#01223d] font-black uppercase">REF: {lead.property_code || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[9px] font-black bg-slate-50 text-[#01223d] px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-200 shadow-sm italic">
                        {lead.stage || 'lead'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-base font-black text-slate-900 tracking-tighter italic">{formatCurrency(lead.value || 0)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{lead.origin || 'Direto'}</span>
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
