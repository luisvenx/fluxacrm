
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
  onEdit: (lead: any) => void; // Nova prop de callback
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
      case 'Alta': return { label: 'Lead Quente', color: 'bg-[#203267]', icon: <Zap size={14} fill="currentColor" /> };
      case 'Média': return { label: 'Lead Morno', color: 'bg-indigo-400', icon: <Sparkles size={14} /> };
      default: return { label: 'Lead Frio', color: 'bg-slate-400', icon: <Clock size={14} /> };
    }
  };

  const priority = getPriorityInfo(lead.priority);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[750px] max-h-[90vh] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
        
        {/* Header Visual */}
        <div className={`p-10 pb-12 text-white relative overflow-hidden ${priority.color}`}>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 flex items-center gap-2">
                       {priority.icon} {priority.label}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                       Etapa: {lead.stage || 'lead'}
                    </span>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="flex items-center gap-5">
                 <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center text-3xl font-black italic">
                   {lead.name.substring(0,1).toUpperCase()}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">{lead.name}</h2>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{lead.company || 'Pessoa Física'}</p>
                 </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-10">
              <User size={300} />
           </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-10 -mt-6 bg-white rounded-t-[3rem] relative z-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Contato Section */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   <Phone size={14} className="text-[#203267]" /> Canais de Contato
                 </h4>
                 
                 <div className="space-y-4">
                    <a 
                      href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} 
                      target="_blank" 
                      className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] group hover:border-[#203267] hover:bg-white transition-all"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Phone size={18} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase">WhatsApp / Celular</p>
                             <p className="text-sm font-bold text-slate-900">{lead.phone || 'Não informado'}</p>
                          </div>
                       </div>
                       <ArrowRight size={18} className="text-slate-200 group-hover:text-[#203267] transition-all" />
                    </a>

                    <div className="flex items-center gap-4 p-5 border border-slate-100 rounded-[1.5rem]">
                       <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Mail size={18} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">E-mail Principal</p>
                          <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{lead.email || 'sem@email.com'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Business Data Section */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   <Tag size={14} className="text-[#203267]" /> Dados da Negociação
                 </h4>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Valor Potencial</p>
                       <p className="text-base font-black text-slate-900 tracking-tighter">{formatCurrency(lead.value || 0)}</p>
                    </div>
                    <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem]">
                       <p className="text-[9px] font-black text-[#203267] uppercase mb-1">Imóvel Ref.</p>
                       <div className="flex items-center gap-2">
                          <Home size={14} className="text-[#203267]" />
                          <p className="text-sm font-black text-[#203267]">{lead.property_code || 'S/ REF'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-5 border border-slate-100 rounded-[1.5rem] flex items-center justify-between">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase">Origem do Lead</p>
                       <p className="text-sm font-bold text-slate-700">{lead.origin || 'Direto'}</p>
                    </div>
                    <Globe size={18} className="text-slate-200" />
                 </div>
              </div>
           </div>

           {/* Observações / Histórico */}
           <div className="mt-10 space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                 <MessageSquare size={14} /> Observações & Histórico
              </h4>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                 <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10 italic">
                    "{lead.observations || "Nenhum histórico detalhado registrado para este atendimento até o momento."}"
                 </p>
                 <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform">
                    <MessageSquare size={180} />
                 </div>
              </div>
           </div>

           {/* Meta Data Footer */}
           <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200 uppercase">
                    {(lead.assigned_to || 'C').substring(0,1)}
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Responsável</p>
                    <p className="text-xs font-bold text-slate-600 mt-1">{lead.assigned_to || 'Corretor não definido'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Criado em</p>
                 <p className="text-xs font-bold text-slate-600 mt-1">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
           </div>
        </div>

        {/* Action Footer */}
        <div className="p-10 pt-6 border-t border-slate-50 bg-white flex items-center gap-3 shrink-0">
           <button 
             onClick={handleDelete}
             disabled={isDeleting}
             className="px-8 py-5 bg-white border-2 border-slate-100 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Excluir Registro</>}
           </button>
           <button 
             onClick={() => onEdit(lead)}
             className="flex-1 py-5 bg-[#203267] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1a2954] transition-all shadow-xl shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-2"
           >
              <Edit3 size={18} /> Editar Atendimento
           </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
