
import React, { useState } from 'react';
import { X, ChevronDown, Loader2, Save, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewToolModal: React.FC<NewToolModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    price: '0',
    billing_day: '1',
    category: 'Geral',
    recurrence: 'Mensal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome da ferramenta é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('tools').insert([{
        user_id: user.id, // ISOLAÇÃO
        name: formData.name,
        provider: formData.provider,
        price: parseFloat(formData.price.replace(',', '.')) || 0,
        billing_day: parseInt(formData.billing_day),
        category: formData.category,
        recurrence: formData.recurrence,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar ferramenta.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[480px] p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-8">Nova Ferramenta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Slack" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-semibold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Mensal</label>
              <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewToolModal;
