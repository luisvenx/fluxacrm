
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Building2, Mail, Phone, DollarSign, Loader2, Tag, Calendar, MessageSquare, Home, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  leadToEdit?: any;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, user, leadToEdit }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    property_code: '', 
    origin: 'Outbound (Prospecção)',
    assigned_to: '',
    segment: 'Residencial',
    priority: 'Média',
    observations: ''
  });

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name || '',
        company: leadToEdit.company || '',
        email: leadToEdit.email || '',
        phone: leadToEdit.phone || '',
        value: leadToEdit.value?.toString() || '',
        property_code: leadToEdit.property_code || '',
        origin: leadToEdit.origin || 'Outbound (Prospecção)',
        assigned_to: leadToEdit.assigned_to || '',
        segment: leadToEdit.segment || 'Residencial',
        priority: leadToEdit.priority || 'Média',
        observations: leadToEdit.observations || ''
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        value: '',
        property_code: '',
        origin: 'Outbound (Prospecção)',
        assigned_to: user?.user_metadata?.full_name || 'Corretor',
        segment: 'Residencial',
        priority: 'Média',
        observations: ''
      });
    }
  }, [leadToEdit, isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome do contato é obrigatório.');

    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        property_code: formData.property_code.toUpperCase(), 
        value: parseFloat(formData.value.replace(',', '.')) || 0,
        origin: formData.origin,
        assigned_to: formData.assigned_to,
        segment: formData.segment,
        priority: formData.priority,
        observations: formData.observations,
      };

      if (leadToEdit) {
        const { error } = await supabase
          .from('leads')
          .update(payload)
          .eq('id', leadToEdit.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('leads').insert([{
          ...payload,
          stage: 'lead',
          status: 'OPEN'
        }]);
        if (error) throw error;
      }

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[650px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              {leadToEdit ? <Save size={24} /> : <UserPlus size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">
                {leadToEdit ? 'Editar Atendimento' : 'Novo Registro'}
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Auditória Comercial SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interessado *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="João Silva" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referência Ativo</label>
              <input type="text" value={formData.property_code} onChange={e => setFormData({...formData, property_code: e.target.value})} placeholder="Ex: IT-402" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-black outline-none focus:border-[#01223d] uppercase shadow-inner" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-semibold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-semibold outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Potencial</label>
              <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="0,00" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-black text-slate-900 outline-none shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioridade</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-xs font-bold outline-none">
                <option value="Baixa">Frio</option>
                <option value="Média">Morno</option>
                <option value="Alta">Quente</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operação</label>
              <select value={formData.segment} onChange={e => setFormData({...formData, segment: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-xs font-bold outline-none">
                <option>Locação</option>
                <option>Venda</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Histórico / Observações</label>
            <textarea rows={3} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-4 px-6 text-sm font-medium outline-none focus:border-[#01223d] resize-none shadow-inner" />
          </div>

          <div className="flex items-center gap-4 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> {leadToEdit ? 'Salvar Registro' : 'Provisionar Lead'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;
