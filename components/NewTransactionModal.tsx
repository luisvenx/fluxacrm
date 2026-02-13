
import React, { useState, useEffect } from 'react';
import { X, Calendar, Info, Paperclip, ChevronDown, Plus, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'IN',
    status: 'PAID',
    competence_date: new Date().toISOString().split('T')[0],
    bank_account_id: '',
    cost_center_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchAuxiliaryData();
    }
  }, [isOpen]);

  async function fetchAuxiliaryData() {
    const [{ data: banks }, { data: centers }] = await Promise.all([
      supabase.from('bank_accounts').select('id, name'),
      supabase.from('cost_centers').select('id, name')
    ]);
    if (banks) setBankAccounts(banks);
    if (centers) setCostCenters(centers);
    
    // Auto-select first options if available
    if (banks?.[0]) setFormData(prev => ({ ...prev, bank_account_id: banks[0].id }));
    if (centers?.[0]) setFormData(prev => ({ ...prev, cost_center_id: centers[0].id }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert('Por favor, preencha a descrição e o valor.');
      return;
    }

    setIsSaving(true);
    try {
      const cleanAmount = formData.amount.replace(',', '.');
      const { error } = await supabase
        .from('transactions')
        .insert([{
          description: formData.description,
          amount: parseFloat(cleanAmount),
          type: formData.type,
          status: formData.status,
          competence_date: formData.competence_date,
          bank_account_id: formData.bank_account_id || null,
          cost_center_id: formData.cost_center_id || null
        }]);

      if (error) throw error;
      
      onClose(); // Transactions.tsx já chama fetchTransactions no onClose
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      alert('Ocorreu um erro ao salvar o lançamento.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[650px] max-h-[90vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novo Lançamento</h2>
              <p className="text-xs text-slate-400 font-medium">Registre uma nova entrada ou saída no Supabase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
          <form id="new-tx-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Amount Section */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-4">Valor da Transação</label>
              <div className="flex items-center text-4xl font-bold text-slate-900 tracking-tighter">
                <span className="text-slate-300 mr-2 text-2xl">R$</span>
                <input 
                  type="text" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0,00"
                  className="bg-transparent border-none p-0 focus:ring-0 w-48 text-center placeholder:text-slate-200"
                  autoFocus
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Fluxo</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'IN'})}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.type === 'IN' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Entrada
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'OUT'})}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.type === 'OUT' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Saída
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status do Pagamento</label>
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PAID'})}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.status === 'PAID' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Pago
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, status: 'PENDING'})}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.status === 'PENDING' ? 'bg-white text-amber-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
                  >
                    Pendente
                  </button>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Consultoria Financeira Mensal"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria / Centro de Custo */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Centro de Custo</label>
                <div className="relative">
                  <select 
                    value={formData.cost_center_id}
                    onChange={(e) => setFormData({...formData, cost_center_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    <option value="">Selecione um centro</option>
                    {costCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Competência</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={formData.competence_date}
                    onChange={(e) => setFormData({...formData, competence_date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Banco/Meio de Pagamento */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vincular a Banco / Conta</label>
              <div className="relative">
                <select 
                  value={formData.bank_account_id}
                  onChange={(e) => setFormData({...formData, bank_account_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="">Selecione uma conta</option>
                  {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Attachments Placeholder */}
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                <Paperclip size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Anexar Comprovante / Nota Fiscal</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            form="new-tx-form"
            type="submit" 
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              'Confirmar Lançamento'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTransactionModal;
