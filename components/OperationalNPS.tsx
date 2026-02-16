
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Plus, 
  TrendingUp, 
  MessageSquare, 
  BarChart, 
  Smile, 
  Meh, 
  Frown,
  Loader2,
  Database,
  RefreshCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import NewNPSModal from './NewNPSModal';
import { supabase } from '../lib/supabase';

interface OperationalNPSProps {
  user: any;
}

const OperationalNPS: React.FC<OperationalNPSProps> = ({ user }) => {
  const [activeSegment, setActiveSegment] = useState<'Clientes' | 'Equipe'>('Clientes');
  const [isNewNPSModalOpen, setIsNewNPSModalOpen] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNPS = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('nps_responses')
        .select(`
          *,
          customers (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error('Erro NPS:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNPS();
  }, []);

  const stats = useMemo(() => {
    if (responses.length === 0) return { score: 0, rate: 0, promotores: 0, detratores: 0, passivos: 0 };
    
    const promotores = responses.filter(r => r.score >= 9).length;
    const detratores = responses.filter(r => r.score <= 6).length;
    const passivos = responses.length - promotores - detratores;
    
    const npsScore = Math.round(((promotores - detratores) / responses.length) * 100);
    
    return {
      score: npsScore,
      rate: responses.length,
      promotores,
      detratores,
      passivos
    };
  }, [responses]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Voz do <span className="text-[#01223d] not-italic">Consumidor</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Auditória de satisfação e qualidade (NPS/CSAT) SQL</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm mr-2">
            <button 
              onClick={() => setActiveSegment('Clientes')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === 'Clientes' ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Clientes
            </button>
            <button 
              onClick={() => setActiveSegment('Equipe')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === 'Equipe' ? 'bg-[#01223d] text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              eNPS
            </button>
          </div>
          <button 
            onClick={() => setIsNewNPSModalOpen(true)}
            className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Registrar
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-44 group hover:border-[#b4a183] transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NPS Score Consolidado</p>
          <div className="flex items-end justify-between">
            <h3 className={`text-4xl font-black tracking-tighter italic ${stats.score >= 70 ? 'text-emerald-500' : stats.score >= 50 ? 'text-[#b4a183]' : 'text-rose-500'}`}>
              {isLoading ? '...' : stats.score}
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
               <TrendingUp size={20} className={stats.score >= 70 ? 'text-emerald-500' : 'text-[#01223d]'} />
            </div>
          </div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 border-t border-slate-50 pt-2">Zona de {stats.score >= 75 ? 'Excelência' : stats.score >= 50 ? 'Qualidade' : 'Aperfeiçoamento'}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-44 group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotores (Loyalty)</p>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"><Smile size={24} /></div>
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{stats.promotores}</h3>
                <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Score 9-10</p>
             </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-44 group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detratores (Churn Risk)</p>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-50 text-rose-500 rounded-xl border border-rose-100"><Frown size={24} /></div>
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{stats.detratores}</h3>
                <p className="text-[8px] font-bold text-rose-500 uppercase tracking-tighter">Score 0-6</p>
             </div>
          </div>
        </div>

        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-44 group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Amostragem Base</p>
            <h3 className="text-3xl font-black tracking-tighter italic uppercase">{stats.rate} Feedback</h3>
          </div>
          <BarChart size={140} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
          <button onClick={fetchNPS} className="relative z-10 w-fit p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
             <RefreshCcw size={14} className={`text-[#b4a183] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[450px] flex flex-col">
        <div className="p-10 pb-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Journal Qualitativo</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Percepções auditadas via SQL Ledger</p>
           </div>
           <span className="bg-white border border-slate-200 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">{responses.length} Registros</span>
        </div>

        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conta & Contexto</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Depoimento Consumidor</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processando Feedbacks...</p></td></tr>
              ) : responses.length === 0 ? (
                <tr><td colSpan={4} className="py-40 text-center opacity-30"><MessageSquare size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Sem feedbacks registrados</p></td></tr>
              ) : (
                responses.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-all group cursor-default">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-tight italic truncate max-w-[200px]">{res.customers?.name || 'Conta Removida'}</span>
                        <span className="text-[9px] font-black text-[#01223d] uppercase tracking-widest mt-1 opacity-60">Contexto: {res.context || 'Geral'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`w-12 h-12 inline-flex items-center justify-center rounded-xl font-black text-base shadow-md border-2 italic ${
                        res.score >= 9 ? 'bg-emerald-50 text-emerald-600 border-emerald-500' :
                        res.score >= 7 ? 'bg-amber-50 text-[#b4a183] border-[#b4a183]' :
                        'bg-rose-50 text-rose-600 border-rose-500'
                      }`}>
                        {res.score}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md italic line-clamp-2">
                        "{res.comment || 'O consumidor não forneceu observações qualitativas.'}"
                      </p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(res.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewNPSModal isOpen={isNewNPSModalOpen} onClose={() => { setIsNewNPSModalOpen(false); fetchNPS(); }} />
    </div>
  );
};

export default OperationalNPS;
