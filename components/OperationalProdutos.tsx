
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  ChevronDown,
  Filter,
  Zap,
  Clock,
  TrendingUp,
  MoreVertical,
  Layers,
  Repeat,
  ShoppingBag,
  Loader2,
  Database,
  RefreshCcw,
  Target,
  ChevronRight
} from 'lucide-react';
import NewProductModal from './NewProductModal';
import { supabase } from '../lib/supabase';

interface OperationalProdutosProps {
  user: any;
}

const OperationalProdutos: React.FC<OperationalProdutosProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('user_id', user.id).order('name');
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Erro produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const stats = useMemo(() => {
    const active = products.filter(p => p.status === 'Ativo').length;
    return [
      { label: 'Ativos na Prateleira', value: products.length.toString(), trend: 'Provisionados', icon: <Package size={18}/> },
      { label: 'Itens em Operação', value: active.toString(), trend: 'Status Live', icon: <Zap size={18}/> },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Catálogo de <span className="text-[#01223d] not-italic">Soluções</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão de assets e portfólio de serviços SQL</p>
        </div>

        <button 
          onClick={() => setIsNewProductModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Novo Ativo
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group hover:border-[#b4a183] transition-all">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{isLoading ? '...' : stat.value}</h3>
                <div className="p-3 bg-slate-50 text-[#01223d] rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
             </div>
          </div>
        ))}
        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-40 group lg:col-span-2">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Qualidade Operacional</p>
           <h3 className="text-2xl font-black tracking-tighter italic relative z-10 uppercase">SLA Auditado: 100%</h3>
           <Target size={140} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar no catálogo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 transition-all outline-none text-slate-600"
          />
        </div>
        <button onClick={fetchProducts} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] transition-all shadow-sm">
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[450px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto / Solução</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acordo de Nível (SLA)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Catálogo...</p></td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={4} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhuma solução cadastrada</p></td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-slate-900 text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center font-black text-xs shadow-md italic group-hover:scale-110 transition-transform">
                            <Layers size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate italic">{product.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Provisionado SQL Node</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200">
                         <Clock size={12} className="text-[#b4a183]" />
                         <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight italic">{product.sla_days} dias úteis</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm italic ${
                        product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2.5 text-slate-200 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
                         <MoreVertical size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewProductModal isOpen={isNewProductModalOpen} onClose={() => { setIsNewProductModalOpen(false); fetchProducts(); }} user={user} />
    </div>
  );
};

export default OperationalProdutos;
