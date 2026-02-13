
import React, { useState } from 'react';
import { X, CreditCard, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCardModal: React.FC<NewCardModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', last_digits: '', limit: '', type: 'Empresa', color: 'bg-slate-900' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.limit) return alert('Preencha nome e limite.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('cards').insert([{
        name: formData.name,
        last_digits: formData.last_digits,
        limit_amount: parseFloat(formData.limit.replace(',', '.')),
        type: formData.type,
        color: formData.color,
        status: 'Ativo'
      }]);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cartão.');
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
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <CreditCard size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vincular Cartão</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação do Cartão *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Visa Corporate Platinum" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Últimos 4 Dígitos</label>
              <input type="text" maxLength={4} value={formData.last_digits} onChange={e => setFormData({...formData, last_digits: e.target.value})} placeholder="0000" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Limite (R$) *</label>
              <input type="text" value={formData.limit} onChange={e => setFormData({...formData, limit: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cor do Cartão</label>
            <div className="flex gap-2">
              {['bg-slate-900', 'bg-blue-600', 'bg-rose-600', 'bg-emerald-600', 'bg-purple-700'].map(c => (
                <button key={c} type="button" onClick={() => setFormData({...formData, color: c})} className={`w-8 h-8 rounded-full border-2 ${c} ${formData.color === c ? 'border-blue-300 scale-110' : 'border-transparent'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Salvar Cartão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCardModal;
