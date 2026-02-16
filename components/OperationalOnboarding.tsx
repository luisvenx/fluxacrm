
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  Plus,
  Filter, 
  ChevronDown,
  Search,
  MoreVertical,
  Clock,
  User,
  Zap,
  ArrowUpRight,
  Loader2,
  Database,
  RefreshCcw,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewOnboardingModal from './NewOnboardingModal';

interface OperationalOnboardingProps {
  user: any;
}

const OperationalOnboarding: React.FC<OperationalOnboardingProps> = ({ user }) => {
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: 'kickoff', label: 'Kickoff', color: 'bg-slate-300' },
    { id: 'setup', label: 'Setup Técnico', color: 'bg-[#01223d]' },
    { id: 'config', label: 'Configuração', color: 'bg-[#b4a183]' },
    { id: 'training', label: 'Treinamento', color: 'bg-slate-900' },
    { id: 'live', label: 'Go-Live', color: 'bg-emerald-600' },
  ];

  const fetchOnboardings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboardings')
        .select(`
          *,
          contracts (
            amount,
            customers (name)
          )
        `)
        .eq('user_id', user.id); 
      if (error) throw error;
      setOnboardings(data || []);
    } catch (err) {
      console.error('Erro Onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardings();
  }, [user]);

  const stats = useMemo(() => {
    const total = onboardings.length;
    const inTime = onboardings.filter(o => o.status !== 'Risco' && o.status !== 'Atenção').length;
    const atRisk = total - inTime;
    const avgProgress = total > 0 ? Math.round(onboardings.reduce((acc, o) => acc + (o.progress || 0), 0) / total) : 0;

    return [
      { label: 'Ciclos Ativos', value: total.toString(), trend: 'Em fluxo', icon: <Rocket size={20} /> },
      { label: 'Em Conformidade', value: inTime.toString(), trend: 'No Prazo', icon: <CheckCircle2 size={20} /> },
      { label: 'Atingimento Médio', value: `${avgProgress}%`, trend: 'Consolidado', icon: <Zap size={20} /> },
    ];
  }, [onboardings]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fcfcfd] min-h-[80vh]">
        <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 text-center">Processando Onboardings...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10 font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Esteira de <span className="text-[#01223d] not-italic">Implantação</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática de go-live e sucessfull onboarding SQL</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={fetchOnboardings} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#b4a183] shadow-sm transition-all"><RefreshCcw size={18} /></button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-95"
          >
            <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Iniciar Fluxo
          </button>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 pb-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-6 min-w-max md:min-w-0">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 flex-1 flex items-center justify-between shadow-sm min-w-[280px] group hover:border-[#b4a183] transition-all">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">{stat.value}</h3>
                 <p className="text-[9px] font-bold text-[#b4a183] uppercase mt-4 tracking-widest">{stat.trend}</p>
              </div>
              <div className="p-3 bg-slate-50 text-[#01223d] rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                 {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 20 })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-x-auto no-scrollbar px-6 md:px-10 pb-12">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col) => {
            const colOnboardings = onboardings.filter(o => (o.stage || 'kickoff').toLowerCase() === col.id);
            return (
              <div key={col.id} className="w-[320px] flex flex-col h-full group">
                <div className="mb-4 flex items-center justify-between px-2 pt-2">
                   <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 ${col.color} rounded-full shadow-sm`}></div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">{col.label}</span>
                   </div>
                   <span className="text-[9px] font-black bg-white border border-slate-200 text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter">{colOnboardings.length}</span>
                </div>
                
                <div className="flex-1 bg-slate-50/20 rounded-xl border-2 border-dashed border-transparent transition-all duration-300 p-2 space-y-4 overflow-y-auto no-scrollbar hover:border-slate-200">
                  {colOnboardings.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-2xl hover:border-[#b4a183] transition-all group/card relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                           <div className="min-w-0 pr-4">
                              <h4 className="text-sm font-black text-slate-900 uppercase truncate italic leading-tight">{item.contracts?.customers?.name || 'Conta SQL'}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Implantador: {item.responsible || 'Auditando...'}</p>
                           </div>
                           <button className="text-slate-200 hover:text-slate-900 transition-colors shrink-0"><MoreVertical size={16} /></button>
                        </div>
                        
                        <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <span className="text-[9px] font-black text-[#01223d] uppercase tracking-widest">{item.progress || 0}% de conclusão</span>
                              <Zap size={12} className="text-[#b4a183]" />
                           </div>
                           <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                              <div className="h-full bg-[#01223d] rounded-full transition-all duration-1000" style={{ width: `${item.progress || 0}%` }}></div>
                           </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover/card:w-full transition-all duration-700 bg-[#b4a183]"></div>
                    </div>
                  ))}
                  
                  <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#01223d] hover:border-[#b4a183] hover:bg-white transition-all group/add shadow-inner">
                    <Plus size={20} className="group-hover/add:scale-125 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewOnboardingModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchOnboardings(); }} user={user} />
    </div>
  );
};

export default OperationalOnboarding;
