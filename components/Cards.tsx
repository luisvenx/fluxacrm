
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  CreditCard, 
  MoreVertical, 
  Trash2, 
  Loader2, 
  Database, 
  User,
  Building2,
  DollarSign,
  Wallet,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import NewCardModal from './NewCardModal';
import { supabase } from '../lib/supabase';

interface CardsProps {
  user: any;
}

const Cards: React.FC<CardsProps> = ({ user }) => {
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const fetchCards = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('cards').select('*').eq('user_id', user.id); 
      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Business <span className="text-[#01223d] not-italic">Wallet</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão de ativos e meios de pagamento corporativos SQL</p>
        </div>
        <button 
          onClick={() => setIsNewCardModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Vincular Ativo
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm flex flex-col justify-between h-36 group hover:border-[#b4a183] transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Limite Auditado</p>
            <div className="flex items-end justify-between">
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">R$ 0,00</h3>
               <div className="w-10 h-10 bg-slate-50 text-[#01223d] rounded-lg flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
               </div>
            </div>
         </div>
         <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm flex flex-col justify-between h-36">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cartões Ativos</p>
            <div className="flex items-end justify-between">
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{cards.length}</h3>
               <div className="w-10 h-10 bg-[#01223d] text-[#b4a183] rounded-lg flex items-center justify-center shadow-lg">
                  <CreditCard size={20} />
               </div>
            </div>
         </div>
         <div className="bg-[#01223d] p-8 rounded-xl shadow-2xl flex flex-col justify-between h-36 relative overflow-hidden group">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Wallet Status</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">Sincronizado</h3>
               <div className="w-2 h-2 bg-[#b4a183] rounded-full animate-pulse shadow-[0_0_12px_#b4a183]"></div>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Wallet size={120} />
            </div>
         </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Wallet...</p></div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div key={card.id} className="bg-[#01223d] border border-slate-700 rounded-xl p-10 transition-all duration-500 group shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[280px]">
               <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-10 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center text-[#b4a183] shadow-inner group-hover:scale-110 transition-transform relative">
                     <div className="absolute top-2 left-2 w-3 h-2 bg-[#b4a183]/20 rounded-sm"></div>
                     <CreditCard size={20} />
                  </div>
                  <button onClick={() => setMenuOpenId(menuOpenId === card.id ? null : card.id)} className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical size={22}/></button>
               </div>

               <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tight uppercase italic leading-none truncate">{card.name}</h4>
                    <p className="text-[10px] font-mono font-black text-slate-500 mt-2.5 tracking-[0.3em]">•••• •••• •••• {card.last_digits || '0000'}</p>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Limite Disponível</span>
                        <span className="text-lg font-black text-[#b4a183] tracking-tighter italic">{formatCurrency(card.limit_amount || 0)}</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#b4a183] w-0 group-hover:w-2/3 transition-all duration-[1500ms]"></div>
                     </div>
                  </div>
               </div>
               <div className="absolute -right-10 -bottom-10 opacity-5">
                  <ShieldCheck size={160} />
               </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsNewCardModalOpen(true)} 
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:border-[#b4a183] transition-all group min-h-[280px]"
          >
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-200 group-hover:text-[#01223d] group-hover:bg-slate-50 transition-all border border-slate-100">
                <Plus size={24} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#01223d] block">Novo Cartão SQL</span>
          </button>
        </div>
      )}
      <NewCardModal isOpen={isNewCardModalOpen} onClose={() => { setIsNewCardModalOpen(false); fetchCards(); }} user={user} />
    </div>
  );
};

export default Cards;
