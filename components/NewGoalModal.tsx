
import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Target, Info, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewGoalModal: React.FC<NewGoalModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    scope: 'Empresa',
    metric: 'Valor em Vendas (R$)',
    target_value: '',
    period: 'Mensal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target_value) return alert('Campos obrigatórios faltando.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('goals').insert([{
        title: formData.title,
        scope: formData.scope,
        metric: formData.metric,
        target_value: parseFloat(formData.target_value.replace(',', '.')),
        current_value: 0,
        period: formData.period,
        status: 'Active'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar meta.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] max-h-[90vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nova Meta</h2>
              <p className="text-xs text-slate-400 font-medium">Defina objetivos quantitativos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identificação da Meta *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Meta de Vendas - Q1 2026"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Escopo</label>
              <div className="relative">
                <select 
                  value={formData.scope}
                  onChange={e => setFormData({...formData, scope: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none outline-none"
                >
                  <option>Empresa</option>
                  <option>Individual</option>
                  <option>Squad</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Métrica</label>
              <div className="relative">
                <select 
                  value={formData.metric}
                  onChange={e => setFormData({...formData, metric: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none outline-none"
                >
                  <option>Valor em Vendas (R$)</option>
                  <option>Leads Criados</option>
                  <option>Reuniões Marcadas</option>
                  <option>Vendas Concluídas</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target (Valor) *</label>
              <input 
                type="text" 
                value={formData.target_value}
                onChange={e => setFormData({...formData, target_value: e.target.value})}
                placeholder="0,00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Período</label>
              <div className="relative">
                <select 
                  value={formData.period}
                  onChange={e => setFormData({...formData, period: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none outline-none"
                >
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-3">
            <Info size={16} className="text-blue-500 mt-0.5" />
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">As metas alimentam o Dashboard Comercial e o Ranking de Performance em tempo real.</p>
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Criar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGoalModal;
