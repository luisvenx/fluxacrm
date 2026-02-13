
import React, { useState } from 'react';
import { X, User, Upload, ChevronDown, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewMemberModal: React.FC<NewMemberModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'Funcionário',
    email: '',
    phone: '',
    document_number: '',
    cost_center: 'Operacional',
    salary_value: '0',
    observations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.role) return alert('Nome e Cargo são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('team_members').insert([{
        user_id: user.id, // ISOLAÇÃO
        name: formData.name,
        role: formData.role,
        type: formData.type,
        email: formData.email,
        phone: formData.phone,
        document_number: formData.document_number,
        cost_center: formData.cost_center,
        salary_value: parseFloat(formData.salary_value.replace(',', '.')) || 0,
        status: isActive ? 'Ativo' : 'Inativo',
        observations: formData.observations
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar membro.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-8">Novo Membro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Roberto Silva" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cargo *</label>
              <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Analista" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Custo Mensal</label>
              <input type="text" value={formData.salary_value} onChange={e => setFormData({...formData, salary_value: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar no Banco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMemberModal;
