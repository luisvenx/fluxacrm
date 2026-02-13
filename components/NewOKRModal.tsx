
import React, { useState } from 'react';
import { X, Target, ChevronDown, Loader2, Save, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewOKRModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewOKRModal: React.FC<NewOKRModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    current: '0',
    period: 'Ciclo 2026',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.target) return alert('Título e Alvo são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('okrs').insert([{
        user_id: user.id,
        title: formData.title,
        target: parseFloat(formData.target),
        current: parseFloat(formData.current) || 0,
        period: formData.period,
        description: formData.description
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar OKR.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[520px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-8 pb-4 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Objetivo</h2>
              <p className="text-xs text-slate-400 font-medium">Gestão de OKR Realtime</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título do OKR *</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Alcançar 1M em MRR" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Alvo (Target) *</label>
                <div className="relative">
                   <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                   <input type="number" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} placeholder="0" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-black outline-none" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Atual</label>
                <div className="relative">
                   <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input type="number" value={formData.current} onChange={e => setFormData({...formData, current: e.target.value})} placeholder="0" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-black outline-none" />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ciclo / Período</label>
            <div className="relative">
               <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
               <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} placeholder="Ciclo 2026" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-semibold outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes sobre este objetivo..." className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Criar OKR</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOKRModal;
