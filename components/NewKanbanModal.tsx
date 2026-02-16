
import React, { useState } from 'react';
import { X, Loader2, Database, Palette, AlignLeft, LayoutGrid, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewKanbanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewKanbanModal: React.FC<NewKanbanModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#01223d');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const colors = [
    '#01223d', '#b4a183', '#0f172a', '#1e293b', '#475569', '#64748b', '#0042b3', '#065f46', '#9f1239',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.name) return alert('O nome do quadro é obrigatório.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('marketing_boards').insert([{
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        color: selectedColor,
        status: 'Ativo'
      }]);

      if (error) throw error;
      
      setFormData({ name: '', description: '' });
      onClose();
    } catch (err) {
      console.error('Erro ao salvar board:', err);
      alert('Erro ao criar quadro.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[520px] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Novo Quadro</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Configuração de Workflow SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação do Board *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Campanhas Meta, Conteúdo Youtube..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <AlignLeft size={12} /> Briefing do Fluxo
              </label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o propósito tático deste kanban..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-medium text-slate-600 focus:border-[#01223d] outline-none transition-all resize-none shadow-inner"
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 ml-1">
                <Palette size={14} className="text-slate-400" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidade Visual</label>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-lg transition-all relative flex items-center justify-center ${
                      selectedColor === color 
                      ? 'ring-4 ring-slate-100 scale-110 shadow-lg' 
                      : 'hover:scale-105 opacity-60 hover:opacity-100 border border-slate-100'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Criar Board</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewKanbanModal;
