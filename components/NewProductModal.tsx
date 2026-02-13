
import React, { useState } from 'react';
import { X, Package, Users, Clock, ChevronDown, Loader2, Tag, LayoutGrid, UserCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['CX']);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Recorrente',
    status: 'Ativo',
    description: '',
    sla_days: '5',
    sla_unit: 'Dias Úteis',
    responsible_unit: 'Sucesso do Cliente',
    onboarding_scope: ''
  });

  const toggleTeam = (team: string) => {
    setSelectedTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome do produto é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('products').insert([{
        user_id: user.id,
        name: formData.name,
        type: formData.type,
        status: formData.status,
        description: formData.description,
        sla_days: parseInt(formData.sla_days),
        responsible_unit: formData.responsible_unit,
        involved_teams: selectedTeams,
        onboarding_scope: formData.onboarding_scope
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[650px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Novo Produto / Serviço</h2>
              <p className="text-xs text-slate-400 font-medium">Configure seu catálogo operacional</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Produto *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: Gestão de Redes Sociais" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo *</label>
                <div className="relative">
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none">
                    <option>Recorrente</option>
                    <option>Único</option>
                    <option>Setup</option>
                  </select>
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none">
                  <option>Ativo</option>
                  <option>Descontinuado</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição interna</label>
              <textarea 
                rows={2} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Descreva o que este produto entrega..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-blue-100" 
              />
            </div>
          </div>

          {/* Operational Configs */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Configurações Operacionais</h3>
            
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Times Envolvidos</label>
              <div className="flex flex-wrap gap-2">
                {['CX', 'Técnico', 'Marketing', 'Comercial'].map(team => (
                  <button 
                    key={team} 
                    type="button" 
                    onClick={() => toggleTeam(team)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${selectedTeams.includes(team) ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">SLA Padrão</label>
                <div className="flex gap-2">
                  <input type="number" value={formData.sla_days} onChange={e => setFormData({...formData, sla_days: e.target.value})} placeholder="Ex: 5" className="w-20 bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-black text-center" />
                  <select value={formData.sla_unit} onChange={e => setFormData({...formData, sla_unit: e.target.value})} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none">
                    <option>Dias Úteis</option>
                    <option>Dias Corridos</option>
                    <option>Horas</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Responsável Padrão</label>
                <div className="relative">
                  <select value={formData.responsible_unit} onChange={e => setFormData({...formData, responsible_unit: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none">
                    <option>Sucesso do Cliente</option>
                    <option>Time de Operações</option>
                    <option>Tech Alpha</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><LayoutGrid size={14}/> Escopo de On-Boarding</h3>
             <textarea 
              rows={3} 
              value={formData.onboarding_scope} 
              onChange={e => setFormData({...formData, onboarding_scope: e.target.value})} 
              placeholder="Descrição do On-Boarding..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-blue-100 shadow-inner" 
            />
          </div>

          <div className="flex items-center gap-3 pt-6 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductModal;
