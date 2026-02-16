
import React, { useState } from 'react';
import { X, CreditCard, Plus, Loader2, Info, ChevronDown, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewCardModal: React.FC<NewCardModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    last_digits: '', 
    limit: '', 
    type: 'Cartão Empresa', 
    color: 'bg-slate-900' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name || !formData.limit) return alert('Preencha nome e limite.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('cards').insert([{
        user_id: user.id,
        name: formData.name,
        last_digits: formData.last_digits,
        limit_amount: parseFloat(formData.limit.replace(',', '.')),
        type: formData.type,
        color: formData.color,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cartão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[520px] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Vincular Ativo</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Gestão de Limites SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação do Cartão *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: Visa Platinum Business" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-900 outline-none focus:border-[#01223d] transition-all italic" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Últimos 4 Dígitos</label>
                <input 
                  type="text" 
                  maxLength={4} 
                  value={formData.last_digits} 
                  onChange={e => setFormData({...formData, last_digits: e.target.value})} 
                  placeholder="0000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-mono tracking-[0.3em] font-black text-slate-600 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Limite (R$) *</label>
                <input 
                  type="text" 
                  value={formData.limit} 
                  onChange={e => setFormData({...formData, limit: e.target.value})} 
                  placeholder="0,00" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-black text-[#01223d] outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modalidade</label>
              <div className="relative group">
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d] transition-all"
                >
                  <option>Cartão Empresa</option>
                  <option>Cartão Sócio</option>
                  <option>Prepago / PJ</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={18} />
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex gap-3">
              <Info size={16} className="text-[#b4a183] mt-0.5 shrink-0" />
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                Cartões ativos permitem lançamentos automáticos no Ledger e impactam o DRE operacional.
              </p>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-700 shadow-xl">
              <div>
                <p className="text-xs font-black text-white uppercase italic tracking-tight">Ativar Dispositivo</p>
                <p className="text-[9px] text-[#b4a183] font-black uppercase tracking-widest">Habilitado para provisões</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-[#b4a183] shadow-md' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Confirmar Vínculo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCardModal;
