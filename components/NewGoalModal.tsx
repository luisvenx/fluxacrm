
import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Target, Info, Plus, Loader2, AlertTriangle, AlignLeft, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewGoalModal: React.FC<NewGoalModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    scope: 'Empresa',
    period: 'Mensal',
    metric: 'Leads Criados',
    target_value: '0',
    alert_threshold: '80',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.target_value) return alert('Campos obrigatórios faltando.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('goals').insert([{
        user_id: user.id,
        title: formData.title,
        scope: formData.scope,
        period: formData.period,
        metric: formData.metric,
        target_value: parseFloat(formData.target_value.replace(',', '.')) || 0,
        current_value: 0,
        alert_threshold: parseInt(formData.alert_threshold),
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
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
      
      <div className="relative bg-white w-full max-w-[600px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Nova Meta</h2>
              <p className="text-xs text-slate-400 font-medium">Configure objetivos estratégicos para sua conta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome da Meta *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Ex: Meta de leads Q1" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
              <div className="relative">
                <select 
                  value={formData.scope} 
                  onChange={e => setFormData({...formData, scope: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option>Empresa</option>
                  <option>Individual</option>
                  <option>Squad</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Período</label>
              <div className="relative">
                <select 
                  value={formData.period} 
                  onChange={e => setFormData({...formData, period: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Métrica</label>
            <div className="relative">
              <select 
                value={formData.metric} 
                onChange={e => setFormData({...formData, metric: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>Leads Criados</option>
                <option>Valor em Vendas (R$)</option>
                <option>Conversão de Pipeline (%)</option>
                <option>Lançamentos Conciliados</option>
              </select>
              <BarChart3 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor da Meta</label>
              <input 
                type="text" 
                value={formData.target_value} 
                onChange={e => setFormData({...formData, target_value: e.target.value})} 
                placeholder="0" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alerta (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.alert_threshold} 
                  onChange={e => setFormData({...formData, alert_threshold: e.target.value})} 
                  placeholder="80" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-amber-600 outline-none focus:ring-2 focus:ring-blue-100" 
                />
                <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Início</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.start_date} 
                  onChange={e => setFormData({...formData, start_date: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Término</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.end_date} 
                  onChange={e => setFormData({...formData, end_date: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição (opcional)</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-slate-300" size={16} />
              <textarea 
                rows={3} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Detalhes sobre a meta..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-3.5 pl-12 pr-5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 resize-none" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Criar Meta</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGoalModal;
