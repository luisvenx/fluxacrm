
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
  ArrowUpDown
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
  const [leadToEdit, setLeadToEdit] = useState<any>(null); // Novo estado para edição
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Locação');
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
    { id: 'lead', label: 'Sem atendimento' },
    { id: 'contato', label: 'Em atendimento' },
    { id: 'reuniao', label: 'Visita' },
    { id: 'proposta', label: 'Proposta' }
  ];

  const columnData = useMemo(() => {
    const filtered = leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.property_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return columns.map(col => ({
      ...col,
      items: filtered.filter(l => (l.stage || 'lead').toLowerCase() === col.id),
      count: filtered.filter(l => (l.stage || 'lead').toLowerCase() === col.id).length
    }));
  }, [leads, searchTerm]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));

    try {
      await supabase.from('leads').update({ stage: stageId }).eq('id', leadId).eq('user_id', user.id);
    } catch (err) {
      console.error('Erro ao mover:', err);
      fetchLeads();
    }
    setDraggedId(null);
  };

  const getTemperatureBadge = (priority: string) => {
    switch (priority) {
      case 'Alta': return { label: 'Lead quente', class: 'bg-[#203267] text-white' };
      case 'Média': return { label: 'Lead morno', class: 'bg-indigo-50 text-[#203267]' };
      default: return { label: 'Lead frio', class: 'bg-slate-100 text-slate-500' };
    }
  };

  const getTimeElapsed = (dateStr: string) => {
    const created = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return 'Aguardando há poucos minutos';
    if (diffHrs < 24) return `Há ${diffHrs}h`;
    return `Há ${diffDays}d`;
  };

  const handleOpenEdit = (lead: any) => {
    setSelectedLead(null); // Fecha o detalhe
    setLeadToEdit(lead);
    setIsNewLeadModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsNewLeadModalOpen(false);
    setLeadToEdit(null);
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col animate-in fade-in duration-500">
      
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Atendimentos</h1>
        
        <div className="relative w-full max-w-xl">
          <input 
            type="text" 
            placeholder="Busque por cliente, telefone ou imóvel" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f4f7f9] border-none rounded-lg py-3 pl-5 pr-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>

        <button 
          onClick={() => setIsNewLeadModalOpen(true)}
          className="bg-[#203267] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#1a2954] transition-all shadow-lg shadow-indigo-900/20 active:scale-95 whitespace-nowrap"
        >
          Novo atendimento
        </button>
      </div>

      <div className="bg-white px-8 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex bg-[#f4f7f9] p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('Venda')}
              className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Venda' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
            >
              Venda
            </button>
            <button 
              onClick={() => setActiveTab('Locação')}
              className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Locação' ? 'bg-[#203267] text-white shadow-sm' : 'text-slate-400'}`}
            >
              Locação
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Mais antigos <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Filter size={14} /> Filtros <ArrowUpDown size={14} className="ml-1" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#203267] text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-md hover:bg-[#1a2954] transition-all uppercase tracking-widest">
            <Sparkles size={14} fill="white" /> LIA
          </button>
          <div className="w-8 h-8 rounded-full border border-[#203267] flex items-center justify-center text-[#203267] text-xs font-bold cursor-help" title="Ajuda">?</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#203267] mb-4" size={40} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultando Banco de Leads...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-8 no-scrollbar">
          <div className="flex gap-6 h-full min-w-max">
            {columnData.map((column) => (
              <div 
                key={column.id} 
                className="w-[300px] flex flex-col h-full"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="mb-5 flex items-center gap-3 px-2">
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{column.label}</span>
                  <span className="text-xs font-bold text-[#203267] ml-auto">{column.count}</span>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10">
                  {column.items.map((lead) => {
                    const temp = getTemperatureBadge(lead.priority);
                    return (
                      <div 
                        key={lead.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-grab active:cursor-grabbing group relative ${draggedId === lead.id ? 'opacity-40 grayscale' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-slate-800 leading-tight line-clamp-1 uppercase">{lead.name}</h4>
                          <CheckCircle2 size={16} className="text-[#203267] flex-shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <p className="text-[11px] text-slate-400 font-medium mb-4">{lead.phone || '(11) 9 9999-9999'}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${temp.class}`}>
                            {temp.label}
                          </span>
                          <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-100 uppercase">
                            {lead.property_code || 'S/ REF'}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${column.id === 'lead' ? 'bg-[#203267]' : column.id === 'contato' ? 'bg-indigo-400' : 'bg-emerald-500'}`} />
                             <p className="text-[10px] text-slate-500 font-medium">
                               {getTimeElapsed(lead.created_at)}
                             </p>
                           </div>
                           <ChevronDown size={14} className="text-slate-200 -rotate-90" />
                        </div>
                      </div>
                    );
                  })}
                  
                  <button 
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#203267] hover:border-[#203267] transition-all group"
                  >
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={handleCloseForm} 
        user={user} 
        leadToEdit={leadToEdit}
      />
      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => { setSelectedLead(null); fetchLeads(); }} 
          onEdit={handleOpenEdit} // Passando o callback de edição
          user={user} 
        />
      )}
    </div>
  );
};

export default Pipeline;
