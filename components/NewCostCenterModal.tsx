
import React, { useState } from 'react';
import { X, TrendingUp, Info, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewCostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewCostCenterModal: React.FC<NewCostCenterModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', budget: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.budget) return alert('Preencha nome e budget.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('cost_centers').insert([{
        user_id: user.id, // VÍNCULO OBRIGATÓRIO
        name: formData.name,
        code: formData.code,
        budget: parseFloat(formData.budget.replace(',', '.'))
      }]);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar centro de custo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><TrendingUp size={24} /></div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Centro</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Centro *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Marketing Digital" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Código</label>
              <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="0001" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Budget Mensal *</label>
              <input type="text" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">{isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCostCenterModal;
