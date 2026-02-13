
import React, { useState } from 'react';
import { X, ChevronDown, UserPlus, Info, Building2, Mail, Phone, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    origin: 'Outbound (Prospecção)',
    assigned_to: 'Gabriel Dantras (Alpha)'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome do contato é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        user_id: user.id, // VINCULAR AO USUÁRIO
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        value: parseFloat(formData.value.replace(',', '.')) || 0,
        origin: formData.origin,
        assigned_to: formData.assigned_to,
        stage: 'lead',
        status: 'OPEN'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar lead.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar border border-slate-100">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Capturar Novo Lead</h2>
              <p className="text-xs text-slate-400 font-medium">Este lead será visível apenas para você e seu squad</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Contato *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="João Silva" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Empresa</label>
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Razão Social" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="joao@empresa.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Estimado (R$)</label>
              <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />} Confirmar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;
