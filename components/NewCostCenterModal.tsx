
import React, { useState } from 'react';
import { X, TrendingUp, Info, Plus, Loader2, Save } from 'lucide-react';
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
        user_id: user.id,
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[520px] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Novo Centro</h2>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Provisionamento de Budget SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação do Centro *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ex: Operação Vendas, Suporte Técnico..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-6 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner" 
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código Contábil</label>
              <input 
                type="text" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                placeholder="0001" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-6 text-sm font-black text-slate-600 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Mensal (R$) *</label>
              <input 
                type="text" 
                value={formData.budget} 
                onChange={e => setFormData({...formData, budget: e.target.value})} 
                placeholder="0,00" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-6 text-sm font-black text-[#01223d] outline-none shadow-inner" 
              />
            </div>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex gap-4">
            <Info size={18} className="text-[#b4a183] shrink-0" />
            <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
              O Budget permite que o sistema monitore estouros de custos e gere alertas proativos de saúde financeira.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Salvar Centro</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCostCenterModal;
