
import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Target, Info, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewGoalModal: React.FC<NewGoalModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    scope: 'Empresa',
    metric: 'Valor em Vendas (R$)',
    target_value: '',
    period: 'Mensal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.target_value) return alert('Campos obrigatórios faltando.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('goals').insert([{
        user_id: user.id, // ISOLAÇÃO
        title: formData.title,
        scope: formData.scope,
        metric: formData.metric,
        target_value: parseFloat(formData.target_value.replace(',', '.')) || 0,
        current_value: 0,
        period: formData.period,
        status: 'Active'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar meta.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-8">Nova Meta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título *</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Meta Q1 2026" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alvo *</label>
              <input type="text" value={formData.target_value} onChange={e => setFormData({...formData, target_value: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Escopo</label>
              <select value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm">
                <option>Empresa</option><option>Individual</option><option>Squad</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Criar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGoalModal;
