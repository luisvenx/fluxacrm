
import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, Plus, DollarSign, Loader2, User, Truck, Users, LayoutGrid, Banknote, CreditCard, Building2, Layers, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'IN',
    status: 'PENDING',
    competence_date: new Date().toISOString().split('T')[0],
    customer_id: '',
    supplier_id: '',
    team_member_id: '',
    cost_center_id: '',
    bank_account_id: '',
    payment_method: 'Pix',
    is_installment: false,
    accounting_account: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchAuxiliaryData();
    }
  }, [isOpen, user]);

  async function fetchAuxiliaryData() {
    const [
      { data: c }, 
      { data: cc }, 
      { data: tm }, 
      { data: b }
    ] = await Promise.all([
      supabase.from('customers').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('cost_centers').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('team_members').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('bank_accounts').select('id, name').eq('user_id', user.id).order('name')
    ]);

    if (c) setClients(c);
    if (cc) setCostCenters(cc);
    if (tm) setTeamMembers(tm);
    if (b) setBankAccounts(b);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.description || !formData.amount) return alert('Descrição e Valor são obrigatórios.');

    setIsSaving(true);
    try {
      const cleanAmount = formData.amount.replace(',', '.');
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          description: formData.description,
          amount: parseFloat(cleanAmount),
          type: formData.type,
          status: formData.status,
          competence_date: formData.competence_date,
          customer_id: formData.customer_id || null,
          supplier_id: formData.supplier_id || null,
          team_member_id: formData.team_member_id || null,
          cost_center_id: formData.cost_center_id || null,
          bank_account_id: formData.bank_account_id || null,
          payment_method: formData.payment_method,
          accounting_account: formData.accounting_account
        }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar lançamento.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[800px] max-h-[92vh] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-6 flex items-center justify-between shrink-0 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-[#01223d] rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Novo Lançamento</h2>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Auditória de Ledger Privado SQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6 no-scrollbar">
          <form id="new-tx-v2-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direção do Fluxo *</label>
                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'IN'})}
                    className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'IN' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    Entrada
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'OUT'})}
                    className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'OUT' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    Saída
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Atual *</label>
                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PENDING'})}
                    className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'PENDING' ? 'bg-[#b4a183] text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    Pendente
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PAID'})}
                    className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'PAID' ? 'bg-[#01223d] text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    Efetivado
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-slate-50/50 p-8 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento *</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Pagamento AWS Servidores"
                  className="w-full bg-white border border-slate-200 rounded-lg py-4 px-6 text-sm font-bold text-slate-900 focus:border-[#01223d] outline-none transition-all italic"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Auditado (R$) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0,00"
                      className="w-full bg-white border border-slate-200 rounded-lg py-4 pl-10 pr-6 text-lg font-black text-slate-900 outline-none focus:border-[#01223d]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Competência</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="date"
                      value={formData.competence_date}
                      onChange={(e) => setFormData({...formData, competence_date: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg py-4 pl-10 pr-6 text-sm font-bold text-slate-700 outline-none focus:border-[#01223d]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Centro de Custo</label>
                 <select 
                  value={formData.cost_center_id}
                  onChange={e => setFormData({...formData, cost_center_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-xs font-bold text-slate-600 outline-none"
                 >
                   <option value="">Selecione</option>
                   {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta Bancária</label>
                 <select 
                  value={formData.bank_account_id}
                  onChange={e => setFormData({...formData, bank_account_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-xs font-bold text-slate-600 outline-none"
                 >
                   <option value="">Selecione o banco</option>
                   {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Meio de Pagamento</label>
                 <select 
                  value={formData.payment_method}
                  onChange={e => setFormData({...formData, payment_method: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-xs font-bold text-slate-600 outline-none"
                 >
                   {['Pix', 'Boleto', 'Cartão', 'Espécie'].map(m => <option key={m}>{m}</option>)}
                 </select>
               </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">Cancelar</button>
              <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-[#01223d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="text-[#b4a183]" /> Salvar Registro</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionModal;
