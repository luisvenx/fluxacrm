
import React from 'react';
import { X, ClipboardCheck, Calendar, User, Home, MapPin, Camera, AlertCircle, CheckCircle2, FileText, LayoutGrid } from 'lucide-react';

interface InspectionDetailModalProps {
  inspection: any;
  onClose: () => void;
}

const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({ inspection, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[700px] max-h-[90vh] rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
        {/* Header Superior */}
        <div className="p-10 pb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <ClipboardCheck size={28} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Laudo de Vistoria</h2>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border-2 ${
                     inspection.type === 'Saída' ? 'bg-rose-50 text-rose-600 border-rose-500' : 'bg-blue-50 text-blue-600 border-blue-500'
                   }`}>Vistoria de {inspection.type}</span>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{inspection.id.substring(0,8)}</span>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 pt-4 space-y-10">
           {/* Imóvel Referência */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Imóvel Auditado</h4>
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex items-center gap-5">
                 <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white border border-slate-100">
                    {inspection.properties?.image_url ? (
                      <img src={inspection.properties.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200"><Home size={28}/></div>
                    )}
                 </div>
                 <div className="min-w-0">
                    <h5 className="text-lg font-black text-slate-900 uppercase truncate">{inspection.properties?.title}</h5>
                    <div className="flex items-center gap-2 text-slate-400 mt-1">
                       <MapPin size={12} className="text-blue-500" />
                       <span className="text-[10px] font-bold uppercase truncate">{inspection.properties?.address}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Cards de Metadados */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Calendar size={20}/></div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data Realizada</p>
                    <p className="text-base font-black text-slate-900">{new Date(inspection.date).toLocaleDateString('pt-BR')}</p>
                 </div>
              </div>
              <div className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><User size={20}/></div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vistoriador Responsável</p>
                    <p className="text-base font-black text-slate-900 uppercase tracking-tight">{inspection.inspector_name}</p>
                 </div>
              </div>
           </div>

           {/* Notas Técnicas */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <FileText size={14} className="text-blue-500" /> Notas de Preservação & Observações
              </h4>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                 <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10">
                    {inspection.notes || "O vistoriador não registrou observações textuais para este laudo inicial."}
                 </p>
                 <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform">
                    <ClipboardCheck size={180} />
                 </div>
              </div>
           </div>

           {/* Galeria de Evidências (Simulada) */}
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Camera size={14} className="text-blue-500" /> Galeria de Evidências
                 </h4>
                 <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Auditado</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                 {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-3xl border-2 border-slate-50 flex items-center justify-center text-slate-300 hover:border-blue-200 transition-all cursor-zoom-in">
                       <LayoutGrid size={24} strokeWidth={1} />
                    </div>
                 ))}
              </div>
              <div className="flex items-start gap-3 bg-amber-50 p-5 rounded-2xl border border-amber-100">
                 <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-amber-800 font-bold uppercase leading-relaxed">Este laudo é um documento legal. As fotos anexadas comprovam o estado físico do imóvel no momento da vistoria.</p>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-10 pt-6 border-t border-slate-50 bg-white flex items-center gap-3 shrink-0">
           <button className="flex-1 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Validar Laudo
           </button>
           <button className="px-10 py-5 bg-white border-2 border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetailModal;
