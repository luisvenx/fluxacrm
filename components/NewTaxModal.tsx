
import React, { useState } from 'react';
import { X, ChevronDown, Receipt, Info, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTaxModal: React.FC<NewTaxModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sphere: 'Federal',
    calculation_base: 'Faturamento',
    rate: '',
    due_day: '15'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.rate) return alert('Preencha os campos obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('taxes').insert([{
        user_id: user.id, // ISOLAÇÃO
        name: formData.name,
        sphere: formData.sphere,
        calculation_base: formData.calculation_base,
        rate: parseFloat(formData.rate.replace(',', '.')),
        due_day: parseInt(formData.due_day),
        status: 'Active'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tributo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Tributo</h2>
              <p className="text-xs text-slate-400 font-medium">Configuração isolada para sua conta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Simples Nacional" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Esfera</label>
              <select value={formData.sphere} onChange={e => setFormData({...formData, sphere: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm">
                <option>Federal</option><option>Estadual</option><option>Municipal</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alíquota (%) *</label>
              <input type="text" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} placeholder="6.00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Salvar Regra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaxModal;
