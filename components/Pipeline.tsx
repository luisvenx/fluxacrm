
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Loader2,
  Database,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  ArrowUpDown,
  User,
  Zap,
  TrendingUp,
  X,
  LayoutGrid,
  Calendar,
  DollarSign
} from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import LeadDetailModal from './LeadDetailModal';
import { supabase } from '../lib/supabase';

interface PipelineProps {
  user: any;
}

const Pipeline: React.FC<PipelineProps> = ({ user }) => {
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadToEdit, setLeadToEdit] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      console.error('Erro ao buscar leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const columns = [
    { id: 'lead', label: 'Prospecção', color: 'bg-slate-500' },
    { id: 'qualificacao', label: 'Qualificação', color: 'bg-blue-500' },
    { id: 'reuniao', label: 'Visita', color: 'bg-indigo-500' },
    { id: 'pos_visita', label: 'Pós-Visita', color: 'bg-purple-500' },
    { id: 'proposta', label: 'Proposta', color: 'bg-amber-500' },
    { id: 'fechado', label: 'Fechado', color: 'bg-emerald-600' }
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.property_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const columnData = useMemo(() => {
    return columns.map(col => ({
      ...col,
      items: filteredLeads.filter(l => (l.stage || 'lead').toLowerCase() === col.id),
      count: filteredLeads.filter(l => (l.stage || 'lead').toLowerCase() === col.id).length
    }));
  }, [filteredLeads]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    setDragOverColumn(null);
    setDraggedId(null);
    if (!leadId) return;

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));
    try {
      await supabase.from('leads').update({ stage: stageId }).eq('id', leadId).eq('user_id', user.id);
    } catch (err) {
      fetchLeads();
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 relative overflow-hidden">
      {/* Texture Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header Pipeline */}
      <div className="relative z-10 bg-white border-b border-slate-200 px-6 md:px-10 py-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             Pipeline de <span className="text-blue-600">Atendimento</span>
           </h1>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gerencie o fluxo de conversão em tempo real</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou imóvel..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} /> Novo Lead
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Funil...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-6 md:p-10 no-scrollbar relative z-10">
          <div className="flex gap-6 h-full min-w-max">
            {columnData.map((column) => (
              <div 
                key={column.id} 
                onDragOver={(e) => { e.preventDefault(); setDragOverColumn(column.id); }}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-[320px] flex flex-col h-full rounded-[2.5rem] border-2 transition-all duration-300 ${
                  dragOverColumn === column.id ? 'bg-blue-50/50 border-blue-400 border-dashed' : 'bg-slate-50/20 border-transparent'
                }`}
              >
                {/* Header da Coluna */}
                <div className="mb-4 flex items-center justify-between px-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${column.color} rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]`}></div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest italic">{column.label}</span>
                  </div>
                  <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-400 px-2.5 py-1 rounded-lg shadow-sm">{column.count}</span>
                </div>

                {/* Área de Cards */}
                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10 px-2">
                  {column.items.map((lead) => (
                    <div 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight line-clamp-1 italic group-hover:text-blue-600 transition-colors">{lead.name}</h4>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
                          lead.priority === 'Alta' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>{lead.priority === 'Alta' ? 'Quente' : 'Morno'}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                         <div className="flex items-center gap-2 text-slate-400">
                           <Phone size={12} className="text-emerald-500" />
                           <p className="text-[11px] font-bold">{lead.phone || '(11) 9 9999-9999'}</p>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400">
                           <Zap size={12} className="text-amber-400" />
                           <p className="text-[11px] font-bold uppercase">{lead.property_code || 'S/ REF'}</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Ticket</span>
                            <span className="text-xs font-black text-slate-900 tracking-tighter">{formatCurrency(lead.value || 0)}</span>
                         </div>
                         <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                           {(lead.assigned_to || 'U').substring(0,1)}
                         </div>
                      </div>
                      {/* Accent highlight */}
                      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-blue-600 opacity-30"></div>
                    </div>
                  ))}
                  
                  {/* Empty State / Add quick button */}
                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-200 hover:bg-white transition-all group"
                  >
                    <Plus size={20} className="group-hover:scale-125 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => { setIsNewLeadModalOpen(false); setLeadToEdit(null); fetchLeads(); }} user={user} leadToEdit={leadToEdit} />
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => { setSelectedLead(null); fetchLeads(); }} onEdit={l => { setSelectedLead(null); setLeadToEdit(l); setIsNewLeadModalOpen(true); }} user={user} />}
    </div>
  );
};

export default Pipeline;
