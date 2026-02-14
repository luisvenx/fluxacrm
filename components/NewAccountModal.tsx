
import React, { useState } from 'react';
import { X, List, ChevronDown, Loader2, Save, Tag, BarChart3, Scale, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    group: 'Ativo Circulante',
    nature: 'Ativo',
    report: 'BP',
    flow: ''
  });

  const natures = ['Ativo', 'Passivo', 'Patrimônio Líquido', 'Receita', 'Despesa'];
  const reports = ['BP', 'DRE'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.code || !formData.name) return alert('Código e Nome são obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('chart_of_accounts').insert([{
        user_id: user.id,
        code: formData.code,
        name: formData.name,
        account_group: formData.group,
        nature: formData.nature,
        report_type: formData.report,
        flow_section: formData.flow,
        is_system: false
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Erro ao salvar conta:', err);
      alert('Erro ao cadastrar conta no plano.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[550px] max-h-[92vh] overflow-hidden rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-10 pb-6 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.5rem] border-2 border-blue-100 flex items-center justify-center shadow-sm">
              <List size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Nova Conta</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Plano de Contas Gerencial</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-10 pt-4 no-scrollbar space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Código *</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value})} 
                  placeholder="1.1.03" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Conta *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ex: Aplicações Financeiras" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Natureza</label>
                <div className="relative">
                  <select 
                    value={formData.nature} 
                    onChange={e => setFormData({...formData, nature: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold appearance-none outline-none focus:border-blue-500 transition-all"
                  >
                    {natures.map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Relatório</label>
                <div className="relative">
                   <select 
                    value={formData.report} 
                    onChange={e => setFormData({...formData, report: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold appearance-none outline-none focus:border-blue-500 transition-all"
                   >
                    {reports.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <BarChart3 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Grupo Contábil</label>
              <input 
                type="text" 
                value={formData.group} 
                onChange={e => setFormData({...formData, group: e.target.value})} 
                placeholder="Ex: Ativo Circulante, Despesas Fixas..." 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Flow Section / Identificador</label>
              <input 
                type="text" 
                value={formData.flow} 
                onChange={e => setFormData({...formData, flow: e.target.value})} 
                placeholder="Ex: current_assets, gross_revenue..." 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-6 text-sm font-mono text-slate-600 outline-none focus:border-blue-500 transition-all" 
              />
            </div>

            <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border-2 border-blue-100 flex gap-4">
              <Info size={20} className="text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700 font-bold leading-relaxed uppercase">
                A estruturação correta do plano de contas é fundamental para o fechamento do balanço patrimonial e apuração do DRE.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Conta</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAccountModal;
