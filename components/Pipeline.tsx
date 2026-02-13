
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Settings2, 
  Users, 
  BarChart, 
  PhoneCall, 
  Building2, 
  DollarSign, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Target,
  Loader2,
  Database
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import { supabase } from '../lib/supabase';

const Pipeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*');
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const columns = [
    { id: 'lead', label: 'Novo Lead', color: 'bg-indigo-500' },
    { id: 'contato', label: 'Contato Iniciado', color: 'bg-blue-500' },
    { id: 'reuniao', label: 'Reunião Marcada', color: 'bg-purple-500' },
    { id: 'proposta', label: 'Proposta Enviada', color: 'bg-rose-500' },
    { id: 'fechado', label: 'Fechamento', color: 'bg-emerald-500' }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-full bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden">
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Pipeline de Vendas</h2>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-slate-400 text-sm font-medium">{leads.length} leads totais</span>
             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
             <span className="text-emerald-600 text-sm font-bold tracking-tight">Sincronizado com SQL</span>
          </div>
        </div>

        <button 
          onClick={() => setIsNewLeadModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Novo Lead
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando Oportunidades...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-10 no-scrollbar">
          <div className="flex gap-6 h-full min-w-max">
            {columns.map((column) => {
              const columnLeads = leads.filter(l => (l.stage || 'lead').toLowerCase() === column.id);
              const totalValue = columnLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);

              return (
                <div key={column.id} className="w-[300px] flex flex-col h-full group">
                  <div className="mb-4 flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-4 ${column.color} rounded-full`}></div>
                        <span className="text-sm font-bold text-slate-900 tracking-tight">{column.label}</span>
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg uppercase tracking-widest">{columnLeads.length}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 pl-3.5 tracking-tight uppercase">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>

                  <div className="flex-1 bg-slate-50/40 rounded-[2rem] border border-dashed border-slate-200 p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-slate-50/80 transition-all">
                    {columnLeads.map((lead) => (
                      <div key={lead.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-grab group/card relative overflow-hidden">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1 max-w-[80%]">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1">{lead.name}</h4>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Building2 size={10} />
                                <span className="text-[10px] font-bold truncate tracking-tight uppercase">{lead.company || 'Pessoa Física'}</span>
                              </div>
                            </div>
                            <button className="text-slate-200 hover:text-slate-900 transition-colors"><MoreVertical size={14} /></button>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600 font-bold text-sm tracking-tighter">
                            <span>{formatCurrency(lead.value || 0)}</span>
                          </div>
                          <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                                 {String(lead.assigned_to || '?').substring(0, 1).toUpperCase()}
                               </div>
                               <span className="text-[10px] font-bold text-slate-400">{lead.assigned_to || 'Sem dono'}</span>
                            </div>
                            <span className="text-[8px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100">
                              {lead.origin || 'Direto'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setIsNewLeadModalOpen(true)}
                      className="w-full py-4 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-white transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); fetchLeads(); }} />
    </div>
  );
};

export default Pipeline;
