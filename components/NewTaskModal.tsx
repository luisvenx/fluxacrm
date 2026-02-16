
import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Tag, Layers, ChevronDown, ListTodo, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    board_id: '',
    category: 'Geral',
    type: 'copy',
    priority: 'Média',
    stage: 'idea'
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchBoards();
    }
  }, [isOpen, user]);

  const fetchBoards = async () => {
    const { data } = await supabase.from('marketing_boards').select('id, name').eq('user_id', user.id);
    if (data) setBoards(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.board_id) {
      alert('Título e Quadro são obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('marketing_tasks').insert([{
        user_id: user.id,
        board_id: formData.board_id,
        title: formData.title,
        category: formData.category,
        type: formData.type,
        priority: formData.priority,
        stage: formData.stage
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      alert('Erro ao salvar tarefa.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              <ListTodo size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Nova Tarefa</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Auditória de Workflow SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Tarefa *</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Ex: Copywriting p/ Campanha Fev" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner" 
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quadro de Destino *</label>
              <div className="relative group">
                <select 
                  value={formData.board_id} 
                  onChange={e => setFormData({...formData, board_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold appearance-none outline-none focus:border-[#01223d] transition-all shadow-inner"
                >
                  <option value="">Selecione o fluxo...</option>
                  {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-xs font-bold outline-none">
                  <option>Geral</option>
                  <option>Paid Media</option>
                  <option>Organic</option>
                  <option>Branding</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Asset</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-xs font-bold outline-none">
                  <option value="copy">Texto / Copy</option>
                  <option value="image">Design / Estático</option>
                  <option value="video">Vídeo / Movimento</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioridade Crítica</label>
              <div className="flex gap-2">
                {['Baixa', 'Média', 'Alta'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.priority === p ? 'bg-[#01223d] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Salvar Registro</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
