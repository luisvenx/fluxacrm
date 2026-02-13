
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, Package, FileText, Plus, Loader2, DollarSign, Clock, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const NewContractModal: React.FC<NewContractModalProps> = ({ isOpen, onClose, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    status: 'Ativo',
    start_date: new Date().toISOString().split('T')[0],
    duration: '12',
    setup_fee: '0,00',
    amount: '0,00',
    notes: '',
    selected_products: [] as string[]
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchAuxiliaryData();
    }
  }, [isOpen, user]);

  const fetchAuxiliaryData = async () => {
    const [{ data: cust }, { data: prod }] = await Promise.all([
      supabase.from('customers').select('id, name').eq('user_id', user.id).order('name'),
      supabase.from('products').select('id, name').eq('user_id', user.id).order('name')
    ]);
    if (cust) setCustomers(cust);
    if (prod) setProducts(prod);
  };

  const calculateEndDate = () => {
    const start = new Date(formData.start_date);
    start.setMonth(start.getMonth() + parseInt(formData.duration || '0'));
    return start.toLocaleDateString('pt-BR');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.customer_id) return alert('Selecione um cliente.');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('contracts').insert([{
        user_id: user.id,
        customer_id: formData.customer_id,
        amount: parseFloat(formData.amount.replace(',', '.')),
        setup_fee: parseFloat(formData.setup_fee.replace(',', '.')),
        start_date: formData.start_date,
        duration_months: parseInt(formData.duration),
        status: formData.status === 'Ativo' ? 'ACTIVE' : 'INACTIVE',
        notes: formData.notes
      }]);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar contrato.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[650px] max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar p-10 border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 pb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vincular Contrato</h2>
              <p className="text-xs text-slate-400 font-medium">Gestão de MRR e vigências</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cliente *</label>
              <div className="relative">
                <select value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="">Selecione o cliente</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold outline-none">
                <option>Ativo</option>
                <option>Aguardando Assinatura</option>
                <option>Cancelado</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Produtos Vendidos *</label>
              <button type="button" className="text-[10px] font-black text-blue-600 uppercase hover:underline">Criar novo produto</button>
            </div>
            <div className="relative group">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold appearance-none outline-none">
                <option>Selecionar produtos...</option>
                {products.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Vigência do Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Início</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duração (meses)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-bold" />
                </div>
              </div>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
              <Info size={16} className="text-blue-500" />
              <p className="text-[11px] text-blue-700 font-bold uppercase">Data de Término: <span className="text-blue-900">{calculateEndDate()}</span> (Calculado automaticamente)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Taxa de Implantação</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" value={formData.setup_fee} onChange={e => setFormData({...formData, setup_fee: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-black text-slate-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Mensal Recorrente</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                <input type="text" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0,00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-black text-blue-600 shadow-inner" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observações</label>
            <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-medium resize-none" />
          </div>

          <div className="flex items-center gap-3 pt-6 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-black uppercase text-slate-400">Cancelar</button>
            <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Criar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContractModal;
