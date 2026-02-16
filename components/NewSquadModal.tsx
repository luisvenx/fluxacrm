
import React, { useState, useEffect } from 'react';
import { X, Upload, ChevronDown, Users, Check, Plus, Info, Loader2, UserCircle, Image as ImageIcon, Sparkles, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

interface DBUser {
  id: string;
  full_name: string;
  email?: string;
}

const NewSquadModal: React.FC<NewSquadModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: '',
    mantra: ''
  });

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setDbUsers(data || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const toggleMember = (name: string) => {
    setSelectedMembers(prev => 
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('O nome do squad é obrigatório.');
    if (!formData.leader) return alert('Selecione um líder para o squad.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('squads').insert([{
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        leader: formData.leader,
        mantra: formData.mantra,
        members: selectedMembers,
        status: isActive ? 'Ativo' : 'Inativo'
      }]);

      if (error) throw error;
      
      setFormData({ name: '', description: '', leader: '', mantra: '' });
      setSelectedMembers([]);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar squad:', err);
      alert('Erro ao criar squad.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[650px] max-h-[95vh] overflow-hidden rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Provisionar Unidade</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Estruturação de Célula SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 no-scrollbar">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificação do Squad *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Squad Alpha Vendas"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-6 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Squad Head</label>
                <div className="relative group">
                  <select 
                    value={formData.leader}
                    onChange={e => setFormData({...formData, leader: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-700 appearance-none outline-none focus:border-[#01223d] shadow-inner transition-all"
                  >
                    <option value="">Selecione o líder</option>
                    {dbUsers.map(u => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-[#01223d]" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                   <Sparkles size={12} className="text-[#b4a183]" /> Mantra Operacional
                </label>
                <input 
                  type="text" 
                  value={formData.mantra}
                  onChange={e => setFormData({...formData, mantra: e.target.value})}
                  placeholder="Foco total na conversão."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-5 text-sm font-bold text-slate-700 outline-none italic shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Composição da Célula</label>
              <span className="text-[9px] font-black text-[#01223d] uppercase tracking-tighter shadow-sm border border-slate-100 bg-white px-3 py-1 rounded-md">{selectedMembers.length} Unidades</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dbUsers.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => toggleMember(user.full_name)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${selectedMembers.includes(user.full_name) ? 'bg-[#01223d] border-[#01223d] text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-[#b4a183]'}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${selectedMembers.includes(user.full_name) ? 'bg-slate-800 text-[#b4a183] border border-slate-700' : 'bg-white text-slate-400 border border-slate-100 shadow-inner'}`}>
                    {getInitials(user.full_name)}
                  </div>
                  <span className={`text-xs font-bold uppercase truncate flex-1 ${selectedMembers.includes(user.full_name) ? 'italic' : ''}`}>{user.full_name}</span>
                  {selectedMembers.includes(user.full_name) && <Check size={14} strokeWidth={4} className="text-[#b4a183]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
            <div>
              <p className="text-xs font-black text-white uppercase italic tracking-tight">Célula Ativa</p>
              <p className="text-[9px] text-[#b4a183] font-black uppercase tracking-widest mt-1">Habilitado para prospecção SQL</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-[#b4a183] shadow-md' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'left-[22px]' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 pb-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 transition-all"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-[#b4a183]" /> Salvar Célula</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSquadModal;
