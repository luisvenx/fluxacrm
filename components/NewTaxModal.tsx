
import React, { useState } from 'react';
import { X, ChevronDown, Receipt, Info, Plus, Loader2, Calendar, Target, Repeat, Save, Percent } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTaxModal: React.FC<NewTaxModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    sphere: 'Federal',
    calculation_base: 'Faturamento',
    rate: '',
    due_day: '15',
    recurrence: 'Mensal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.rate) return alert('Preencha os campos obrigatórios.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('taxes').insert([{
        user_id: user.id,
        name: formData.name,
        sphere: formData.sphere,
        calculation_base: formData.calculation_base,
        rate: parseFloat(formData.rate.replace(',', '.')),
        due_day: parseInt(formData.due_day),
        recurrence: formData.recurrence,
        status: isActive ? 'Active' : 'Inactive'
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tributo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[550px] max-h-[92vh] overflow-hidden rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-6 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Provisionar Imposto</h2>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Configuração Fiscal SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 pb-8 pt-6 no-scrollbar space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Tributo *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: Simples Nacional, ISS, CSRF" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner" 
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Esfera</label>
                <div className="relative group">
                  <select 
                    value={formData.sphere} 
                    onChange={e => setFormData({...formData, sphere: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d]"
                  >
                    <option>Federal</option>
                    <option>Estadual</option>
                    <option>Municipal</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Cálculo</label>
                <div className="relative group">
                   <select 
                    value={formData.calculation_base} 
                    onChange={e => setFormData({...formData, calculation_base: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d]"
                   >
                    <option>Faturamento</option>
                    <option>Lucro Real</option>
                    <option>Taxa Fixa</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alíquota (%) *</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b4a183]" size={16} strokeWidth={3} />
                  <input 
                    type="text" 
                    value={formData.rate} 
                    onChange={e => setFormData({...formData, rate: e.target.value})} 
                    placeholder="0.00" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-10 pr-6 text-lg font-black text-[#01223d] outline-none shadow-inner" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dia Vencimento</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={formData.due_day} 
                    onChange={e => setFormData({...formData, due_day: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-10 pr-6 text-sm font-black text-slate-700 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex gap-4">
              <Info size={18} className="text-[#b4a183] shrink-0" />
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                As alíquotas cadastradas impactam diretamente a linha de Deduções Fiscais no seu DRE Contábil.
              </p>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-700 shadow-xl">
              <div>
                <p className="text-xs font-black text-white uppercase italic">Status Operacional</p>
                <p className="text-[9px] text-[#b4a183] font-black uppercase tracking-widest">Ativado para provisões</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-[#b4a183]' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Salvar Regra</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaxModal;
