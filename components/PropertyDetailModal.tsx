
import React from 'react';
import { X, MapPin, BedDouble, Bath, Maximize, DollarSign, Calendar, Tag, ShieldCheck, Zap, Sparkles, Building, Info, FileText } from 'lucide-react';

interface PropertyDetailModalProps {
  property: any;
  onClose: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[900px] max-h-[90vh] rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Lado Esquerdo: Imagem e Destaques */}
        <div className="md:w-5/12 bg-slate-50 relative min-h-[300px] md:min-h-full">
           {property.image_url ? (
             <img src={property.image_url} alt={property.title} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
               <Building size={80} strokeWidth={1} />
               <span className="text-[10px] font-black uppercase tracking-widest mt-4">Sem imagem disponível</span>
             </div>
           )}
           <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{property.status}</span>
              {property.is_exclusive && (
                <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <Sparkles size={12} fill="white" /> Exclusivo
                </span>
              )}
           </div>
           <button onClick={onClose} className="absolute top-6 right-6 md:hidden p-2 bg-white/20 backdrop-blur-md text-white rounded-full"><X size={20}/></button>
        </div>

        {/* Lado Direito: Informações */}
        <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{property.type}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">REF: #{property.id.substring(0,6)}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{property.title}</h2>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-xs font-bold uppercase">{property.address}</span>
              </div>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
             <div className="bg-slate-50 p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100">
                <BedDouble size={20} className="text-blue-600" />
                <span className="text-lg font-black text-slate-900">{property.bedrooms}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dormitórios</span>
             </div>
             <div className="bg-slate-50 p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100">
                <Bath size={20} className="text-blue-600" />
                <span className="text-lg font-black text-slate-900">{property.bathrooms}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Banheiros</span>
             </div>
             <div className="bg-slate-50 p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100">
                <Maximize size={20} className="text-blue-600" />
                <span className="text-lg font-black text-slate-900">{property.area}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Metros m²</span>
             </div>
          </div>

          <div className="space-y-8 mb-10">
             <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                   <FileText size={14} className="text-blue-500" /> Descrição do Ativo
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {property.description || "Nenhuma descrição detalhada disponível para este imóvel."}
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                      <DollarSign size={14} className="text-emerald-500" /> Investimento
                   </h4>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 px-5 py-4 rounded-2xl">
                         <span className="text-[10px] font-black text-slate-500 uppercase">Valor Venda</span>
                         <span className="text-lg font-black text-slate-900">{formatCurrency(property.sale_price)}</span>
                      </div>
                      <div className="flex justify-between items-center border border-blue-50 px-5 py-4 rounded-2xl">
                         <span className="text-[10px] font-black text-blue-500 uppercase">Aluguel Ref.</span>
                         <span className="text-lg font-black text-blue-600">{formatCurrency(property.rent_price)}</span>
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                      <Tag size={14} className="text-blue-500" /> Taxas & Custos
                   </h4>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                         <span className="text-xs font-bold text-slate-500">Condomínio</span>
                         <span className="text-sm font-black text-slate-700">{formatCurrency(property.condo_fee)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                         <span className="text-xs font-bold text-slate-500">IPTU Mensal</span>
                         <span className="text-sm font-black text-slate-700">{formatCurrency(property.iptu_value)}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-auto flex items-center gap-4 pt-8 border-t border-slate-50">
             <button className="flex-1 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                <ShieldCheck size={18} /> Proposta Comercial
             </button>
             <button className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                Histórico Visitas
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;
