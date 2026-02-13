
import React, { useState } from 'react';
import { X, Upload, Building2, FileText, ChevronDown, Loader2, Save, Image as ImageIcon } from 'lucide-react';
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
    if (!formData.name) return alert('O nome da empresa é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('customers').insert([{
        user_id: user.id,
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
      alert('Erro ao cadastrar cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[650px] max-h-[92vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Cliente</h2>
              <p className="text-xs text-slate-400 font-medium">Gestão de carteira centralizada</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
          {/* Identidade Visual Section */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Identidade Visual</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group cursor-pointer hover:border-blue-200 transition-all">
                <ImageIcon size={24} />
              </div>
              <div className="space-y-1">
                <button type="button" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Enviar logo</button>
                <p className="text-[10px] text-slate-400 font-medium">PNG, JPG ou WebP. Máx 5MB.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Dados da Empresa</h3>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome da empresa *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Razão social ou nome fantasia" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de documento</label>
                <div className="relative">
                  <select 
                    value={formData.document_type} 
                    onChange={e => setFormData({...formData, document_type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option>CNPJ</option>
                    <option>CPF</option>
                    <option>Passaporte</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Documento</label>
                <input 
                  type="text" 
                  value={formData.document_number} 
                  onChange={e => setFormData({...formData, document_number: e.target.value})} 
                  placeholder="Selecione o tipo" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none"
                >
                  <option>Ativo</option>
                  <option>Inativo</option>
                  <option>Churn</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status NF</label>
                <select 
                  value={formData.status_nf} 
                  onChange={e => setFormData({...formData, status_nf: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none"
                >
                  <option>OK</option>
                  <option>Pendente</option>
                  <option>Erro na Emissão</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observações</label>
              <textarea 
                rows={3} 
                value={formData.observations} 
                onChange={e => setFormData({...formData, observations: e.target.value})} 
                placeholder="Notas internas sobre o cliente..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 resize-none" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Cliente</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
