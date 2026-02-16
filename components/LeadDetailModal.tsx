
import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Building2, 
  Tag, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  User, 
  ArrowRight, 
  Trash2, 
  Edit3, 
  Home,
  Zap,
  Globe,
  Loader2,
  CheckCircle2,
  Sparkles,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeadDetailModalProps {
  lead: any;
  onClose: () => void;
  onEdit: (lead: any) => void;
  user: any;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onEdit, user }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir permanentemente este atendimento? Esta ação não pode ser desfeita.')) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('leads').delete().eq('id', lead.id).eq('user_id', user.id);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir registro.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityInfo = (p: string) => {
    switch (p) {
      case 'Alta': return { label: 'Lead Quente', color: 'bg-[#01223d]', icon: <Zap size={14} fill="#b4a183" className="text-[#b4a183]" /> };
      case 'Média': return { label: 'Lead Morno', color: 'bg-[#b4a183]', icon: <Sparkles size={14} /> };
      default: return { label: 'Lead Frio', color: 'bg-slate-400', icon: <Clock size={14} /> };
    }
  };

  const priority = getPriorityInfo(lead.priority);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[750px] max-h-[90vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col border border-slate-100">
        
        <div className={`p-10 pb-12 text-white relative overflow-hidden ${priority.color}`}>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/30 flex items-center gap-2 shadow-sm">
                       {priority.icon} {priority.label}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/30 shadow-sm">
                       Etapa: {lead.stage || 'lead'}
                    </span>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-3xl font-black italic shadow-inner">
                   {lead.name.substring(0,1).toUpperCase()}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-2 italic">{lead.name}</h2>
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em]">{lead.company || 'Investidor Individual'}</p>
                 </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-5">
              <User size={300} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 -mt-6 bg-white rounded-t-xl relative z-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 italic">
                   <Phone size={14} className="text-[#01223d]" /> Hub de Contato
                 </h4>
                 
                 <div className="space-y-4">
                    <a 
                      href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} 
                      target="_blank" 
                      className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-xl group hover:border-[#b4a183] hover:bg-white transition-all shadow-sm"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-100">
                             <Phone size={18} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase">WhatsApp Profissional</p>
                             <p className="text-sm font-bold text-slate-900">{lead.phone || 'Não informado'}</p>
                          </div>
                       </div>
                       <ArrowRight size={18} className="text-slate-200 group-hover:text-[#01223d] transition-all" />
                    </a>

                    <div className="flex items-center gap-4 p-5 border border-slate-100 rounded-xl shadow-sm">
                       <div className="w-10 h-10 bg-slate-50 text-[#01223d] rounded-lg flex items-center justify-center border border-slate-100">
                          <Mail size={18} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">E-mail de Auditoria</p>
                          <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{lead.email || 'sem@email.com'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 italic">
                   <Tag size={14} className="text-[#01223d]" /> Dados Comerciais SQL
                 </h4>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Volume Potencial</p>
                       <p className="text-base font-black text-slate-900 tracking-tighter italic">{formatCurrency(lead.value || 0)}</p>
                    </div>
                    <div className="p-5 bg-[#01223d]/5 border border-[#01223d]/10 rounded-xl shadow-sm">
                       <p className="text-[9px] font-black text-[#01223d] uppercase mb-1 tracking-tighter">Ativo Referenciado</p>
                       <div className="flex items-center gap-2">
                          <Home size={14} className="text-[#b4a183]" />
                          <p className="text-sm font-black text-[#01223d] italic uppercase">{lead.property_code || 'S/ REF'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-5 border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Origem do Lead</p>
                       <p className="text-sm font-bold text-slate-700 italic uppercase">{lead.origin || 'Direto'}</p>
                    </div>
                    <Globe size={18} className="text-slate-200" />
                 </div>
              </div>
           </div>

           <div className="mt-10 space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 italic">
                 <MessageSquare size={14} /> Histórico de Negociação
              </h4>
              <div className="bg-slate-900 p-8 rounded-xl relative overflow-hidden group shadow-2xl">
                 <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10 italic">
                    "{lead.observations || "Nenhum histórico detalhado registrado para este atendimento até o momento."}"
                 </p>
                 <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform">
                    <MessageSquare size={180} />
                 </div>
              </div>
           </div>

           <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#01223d] border border-slate-200 uppercase shadow-sm">
                    {(lead.assigned_to || 'C').substring(0,1)}
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Corretor Head</p>
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase italic">{lead.assigned_to || 'Não atribuído'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Registrado em</p>
                 <p className="text-xs font-bold text-slate-600 mt-1">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
           </div>
        </div>

        <div className="p-10 pt-6 border-t border-slate-50 bg-white flex items-center gap-3 shrink-0">
           <button 
             onClick={handleDelete}
             disabled={isDeleting}
             className="px-8 py-4 bg-white border border-slate-200 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Excluir Atendimento</>}
           </button>
           <button 
             onClick={() => onEdit(lead)}
             className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2"
           >
              <Edit3 size={18} className="text-[#b4a183]" /> Atualizar Registro
           </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
