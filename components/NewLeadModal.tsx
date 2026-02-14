
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Building2, Mail, Phone, DollarSign, Loader2, Tag, Calendar, MessageSquare, Home, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  leadToEdit?: any; // Nova prop para edição
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

  // Inicializa o formulário com dados se for edição
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
        // Modo Edição
        const { error } = await supabase
          .from('leads')
          .update(payload)
          .eq('id', leadToEdit.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        // Modo Cadastro
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[650px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar border border-slate-100">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-[#203267] rounded-2xl flex items-center justify-center shadow-sm">
              {leadToEdit ? <Save size={24} /> : <UserPlus size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                {leadToEdit ? 'Editar Atendimento' : 'Novo Atendimento'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {leadToEdit ? `Editando registro #${leadToEdit.id.substring(0, 8)}` : 'Dados armazenados de forma isolada na sua conta'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Cliente *</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="João Silva" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ref. do Imóvel (Código)</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" value={formData.property_code} onChange={e => setFormData({...formData, property_code: e.target.value})} placeholder="Ex: AP2394" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100 uppercase" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="joao@email.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(11) 99999-9999" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Estimado</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Temperatura</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="Baixa">Frio</option>
                <option value="Média">Morno</option>
                <option value="Alta">Quente</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Negócio</label>
              <select value={formData.segment} onChange={e => setFormData({...formData, segment: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100">
                <option>Locação</option>
                <option>Venda</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observações / Histórico</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-300" size={16} />
              <textarea rows={3} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Detalhes adicionais..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 pl-12 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100 resize-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#203267] text-white rounded-full text-xs font-bold shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 active:scale-95">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>{leadToEdit ? <Save size={18} /> : <UserPlus size={18} />} {leadToEdit ? 'Salvar Alterações' : 'Cadastrar Lead'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;
