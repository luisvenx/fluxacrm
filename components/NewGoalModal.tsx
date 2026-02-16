
import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Target, Info, Plus, Loader2, AlertTriangle, AlignLeft, BarChart3, Save } from 'lucide-react';
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[600px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Nova Meta SQL</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Definição de OKRs Corporativos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Objetivo *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Ex: Alcançar faturamento líquido X" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner" 
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Escopo</label>
              <div className="relative group">
                <select 
                  value={formData.scope} 
                  onChange={e => setFormData({...formData, scope: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d] transition-all shadow-inner"
                >
                  <option>Empresa</option>
                  <option>Individual</option>
                  <option>Squad</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Periodicidade</label>
              <div className="relative group">
                <select 
                  value={formData.period} 
                  onChange={e => setFormData({...formData, period: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d] transition-all shadow-inner"
                >
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">KPI Auditado</label>
            <div className="relative group">
              <select 
                value={formData.metric} 
                onChange={e => setFormData({...formData, metric: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d] transition-all shadow-inner"
              >
                <option>Leads Criados</option>
                <option>Valor em Vendas (R$)</option>
                <option>Conversão de Pipeline (%)</option>
                <option>Lançamentos Conciliados</option>
              </select>
              <BarChart3 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Alvo</label>
              <input 
                type="text" 
                value={formData.target_value} 
                onChange={e => setFormData({...formData, target_value: e.target.value})} 
                placeholder="0" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-black text-[#01223d] outline-none shadow-inner" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Threshold de Alerta (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.alert_threshold} 
                  onChange={e => setFormData({...formData, alert_threshold: e.target.value})} 
                  placeholder="80" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-black text-amber-600 outline-none shadow-inner" 
                />
                <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <AlignLeft size={12} /> Briefing da Meta
            </label>
            <textarea 
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Detalhes técnicos sobre este OKR..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-4 px-6 text-sm font-medium text-slate-600 outline-none focus:border-[#01223d] resize-none shadow-inner transition-all" 
            />
          </div>

          <div className="flex items-center gap-4 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Provisionar Meta</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGoalModal;
