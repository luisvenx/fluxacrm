
import React from 'react';
import { X, Calendar, Clock, User, Home, MapPin, Phone, MessageSquare, Star, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface VisitDetailModalProps {
  visit: any;
  onClose: () => void;
}

const VisitDetailModal: React.FC<VisitDetailModalProps> = ({ visit, onClose }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[600px] rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
        {/* Header Colorido pelo Status */}
        <div className={`p-10 pb-12 text-white relative overflow-hidden ${
          visit.status === 'Realizada' ? 'bg-emerald-600' : 
          visit.status === 'Cancelada' ? 'bg-rose-600' : 
          'bg-blue-600'
        }`}>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                 <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">Visita {visit.status}</span>
                 <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">Detalhes da Demonstração</h2>
              <div className="flex items-center gap-6 opacity-80">
                 <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{new Date(visit.date).toLocaleDateString('pt-BR')}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{visit.time}</span>
                 </div>
              </div>
           </div>
           {/* Grafismo de Fundo */}
           <div className="absolute -right-10 -bottom-10 opacity-10">
              <Calendar size={250} />
           </div>
        </div>

        <div className="p-10 -mt-6 bg-white rounded-t-[3rem] relative z-20 space-y-10">
           {/* Seção Imóvel */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                 <Home size={14} /> Imóvel Demonstrado
              </h4>
              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group cursor-default">
                 <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                    {visit.properties?.image_url ? (
                      <img src={visit.properties.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200"><Home size={24}/></div>
                    )}
                 </div>
                 <div className="min-w-0">
                    <h5 className="text-base font-black text-slate-900 uppercase truncate">{visit.properties?.title}</h5>
                    <p className="text-xs text-slate-400 font-bold uppercase truncate">{visit.properties?.address}</p>
                 </div>
                 <button className="ml-auto w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-100 transition-all"><ArrowRight size={20}/></button>
              </div>
           </div>

           {/* Grid de Contatos */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Interessado (Lead)
                 </h4>
                 <div className="space-y-1">
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{visit.client_name}</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                       <Phone size={14} />
                       <span className="text-sm">{visit.client_phone || 'Não informado'}</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck size={14} /> Responsável
                 </h4>
                 <div className="space-y-1">
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{visit.visitor_name}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Corretor Credenciado</p>
                 </div>
              </div>
           </div>

           {/* Feedback */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                 <MessageSquare size={14} /> Percepção do Cliente
              </h4>
              {visit.feedback ? (
                 <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 space-y-4">
                    <div className="flex gap-1">{renderStars(visit.feedback_rating || 0)}</div>
                    <p className="text-sm text-slate-700 italic font-medium leading-relaxed">
                       "{visit.feedback}"
                    </p>
                 </div>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                   <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Aguardando registro de feedback pós-visita</p>
                </div>
              )}
           </div>

           {/* Footer */}
           <div className="pt-6 flex gap-3">
              <button className="flex-1 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                 <ShieldCheck size={16} /> Solicitar Proposta
              </button>
              <button className="px-8 py-5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Reagendar</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VisitDetailModal;
