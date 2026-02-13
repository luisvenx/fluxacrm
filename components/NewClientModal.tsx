
import React, { useState } from 'react';
import { X, Upload, Building2, FileText, ChevronDown, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    segment: 'SaaS',
    document_type: 'CNPJ',
    document_number: '',
    status: 'Ativo',
    status_nf: 'OK',
    mrr_value: '',
    health_score: '100',
    observations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome do cliente é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('customers').insert([{
        user_id: user.id, // ISOLAÇÃO CRÍTICA
        name: formData.name,
        segment: formData.segment,
        document_type: formData.document_type,
        document_number: formData.document_number,
        status: formData.status,
        status_nf: formData.status_nf,
        mrr_value: parseFloat(formData.mrr_value.replace(',', '.')) || 0,
        health_score: parseInt(formData.health_score),
        observations: formData.observations
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      alert('Erro ao cadastrar cliente no banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar p-10 border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-10 sticky top-0 bg-white z-10 pb-4">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><Building2 size={24} /></div><h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Cliente</h2></div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8 flex-1">
          <div className="space-y-5">
            <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Razão Social *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Sirius LTDA" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold focus:ring-2 focus:ring-blue-100" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">MRR (R$)</label><input type="text" value={formData.mrr_value} onChange={e => setFormData({...formData, mrr_value: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold" /></div>
              <div className="space-y-2"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Health Score</label><input type="number" min="0" max="100" value={formData.health_score} onChange={e => setFormData({...formData, health_score: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-emerald-600" /></div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-6 sticky bottom-0 bg-white py-4 border-t border-slate-50">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-2">{isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
