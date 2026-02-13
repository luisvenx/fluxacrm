
import React, { useState, useEffect } from 'react';
import { X, Rocket, ChevronDown, Loader2, Save, ShieldCheck, UserCheck, LayoutGrid } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewOnboardingModal: React.FC<NewOnboardingModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    contract_id: '',
    stage: 'kickoff',
    progress: '0',
    responsible: '',
    status: 'No Prazo'
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchContracts();
    }
  }, [isOpen, user]);

  const fetchContracts = async () => {
    const { data } = await supabase
      .from('contracts')
      .select('id, customers(name)')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE');
    
    if (data) setContracts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.contract_id) return alert('Selecione um contrato.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('onboardings').insert([{
        user_id: user.id,
        contract_id: formData.contract_id,
        stage: formData.stage,
        progress: parseInt(formData.progress),
        responsible: formData.responsible,
        status: formData.status
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar onboarding.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Rocket size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Iniciar Onboarding</h2>
                <p className="text-xs text-slate-400 font-medium">Fluxo de implementação</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contrato (Cliente) *</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <select value={formData.contract_id} onChange={e => setFormData({...formData, contract_id: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100">
                <option value="">Selecione um contrato ativo</option>
                {contracts.map(c => <option key={c.id} value={c.id}>{c.customers?.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Etapa Inicial</label>
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-xs font-bold outline-none">
                <option value="kickoff">Kickoff</option>
                <option value="setup">Setup Técnico</option>
                <option value="config">Configuração</option>
                <option value="training">Treinamento</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Progresso Inicial (%)</label>
              <input type="number" value={formData.progress} onChange={e => setFormData({...formData, progress: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-black outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Responsável pela Entrega</label>
            <div className="relative">
               <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
               <input type="text" value={formData.responsible} onChange={e => setFormData({...formData, responsible: e.target.value})} placeholder="Nome do CS / Implantador" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Iniciar Fluxo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOnboardingModal;
