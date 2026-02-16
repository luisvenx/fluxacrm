
import React, { useState, useRef } from 'react';
import { X, Home, MapPin, DollarSign, Loader2, Save, Maximize, Bath, BedDouble, Tag, Info, Zap, Sparkles, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewPropertyModal: React.FC<NewPropertyModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    type: 'Apartamento',
    status: 'Disponível',
    sale_price: '',
    rent_price: '',
    condo_fee: '0',
    iptu_value: '0',
    area: '',
    bedrooms: '2',
    bathrooms: '1',
    is_exclusive: false,
    is_opportunity: false,
    image_url: '' 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.address) return alert('Título e Endereço são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('properties').insert([{
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        address: formData.address,
        type: formData.type,
        status: formData.status,
        sale_price: parseFloat(formData.sale_price.replace(',', '.')) || 0,
        rent_price: parseFloat(formData.rent_price.replace(',', '.')) || 0,
        condo_fee: parseFloat(formData.condo_fee.replace(',', '.')) || 0,
        iptu_value: parseFloat(formData.iptu_value.replace(',', '.')) || 0,
        area: parseFloat(formData.area) || 0,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        is_exclusive: formData.is_exclusive,
        is_opportunity: formData.is_opportunity,
        image_url: formData.image_url
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar imóvel.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[800px] max-h-[92vh] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <Home size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Provisionar Imóvel</h2>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Auditório de Ativos SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capa da Unidade</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-56 w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                  formData.image_url ? 'border-[#01223d]' : 'border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-[#b4a183]'
                }`}
              >
                {formData.image_url ? (
                  <>
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <div className="bg-white p-3 rounded-xl text-[#01223d] shadow-xl"><Camera size={18} /></div>
                       <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFormData({...formData, image_url: ''}) }}
                        className="bg-white p-3 rounded-xl text-rose-500 shadow-xl"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm">
                      <ImageIcon size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enviar Foto Técnica</p>
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Ativo *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Cobertura Duplex Itaim Bibi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-5 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl cursor-pointer hover:bg-white transition-all" onClick={() => setFormData({...formData, is_exclusive: !formData.is_exclusive})}>
                    <div className="flex items-center gap-3">
                       <Sparkles size={16} className={formData.is_exclusive ? 'text-[#b4a183]' : 'text-slate-300'} />
                       <span className="text-[9px] font-black uppercase text-slate-700">Contrato Exclusivo</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-all ${formData.is_exclusive ? 'bg-[#b4a183]' : 'bg-slate-200'}`}>
                       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.is_exclusive ? 'left-[18px]' : 'left-0.5'}`}></div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área (m²)</label>
                  <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-4 text-sm font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suítes</label>
                  <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-4 text-sm font-bold" />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor de Venda (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                    <input type="text" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} placeholder="0,00" className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-xl font-black text-slate-900 outline-none focus:border-[#01223d]" />
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">Cancelar</button>
              <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="text-[#b4a183]" /> Salvar Ativo</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPropertyModal;
