
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown, 
  Wallet,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Loader2,
  Database,
  RefreshCcw,
  Edit3,
  TrendingUp,
  Heart,
  ChevronRight
} from 'lucide-react';
import NewMemberModal from './NewMemberModal';
import { supabase } from '../lib/supabase';

interface OperationalEquipeProps {
  user: any;
}

const OperationalEquipe: React.FC<OperationalEquipeProps> = ({ user }) => {
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('team_members').select('*').eq('user_id', user.id).order('name');
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Erro Equipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const stats = useMemo(() => {
    const total = members.length;
    const payroll = members.reduce((acc, m) => acc + (Number(m.salary_value) || 0), 0);
    
    return [
      { label: 'Unidades Ativas', value: `${total} Membros`, icon: <UserCheck size={20}/> },
      { label: 'Custo de Operação', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payroll), icon: <Wallet size={20}/> },
    ];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Talentos & <span className="text-[#01223d] not-italic">Squads</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática de capital humano e folha operacional SQL</p>
        </div>

        <button 
          onClick={() => setIsNewMemberModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={20} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Novo Membro
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between h-40 group hover:border-[#b4a183] transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">{isLoading ? '...' : stat.value}</h3>
              <div className="p-3 bg-slate-50 text-[#01223d] rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-[#01223d] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-40 group lg:col-span-2">
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Eficiência de Time</p>
           <h3 className="text-3xl font-black tracking-tighter italic relative z-10 uppercase">High Performance</h3>
           <UserCheck size={140} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
           <button onClick={fetchMembers} className="relative z-10 w-fit p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
             <RefreshCcw size={14} className={`text-[#b4a183] ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome de colaborador..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 transition-all outline-none text-slate-600"
          />
        </div>
        <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all shadow-sm">
          <Filter size={16} />
        </button>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador Head</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Folha Auditoria</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 size={32} className="animate-spin mx-auto text-[#01223d] mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapeando Organograma...</p></td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={4} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum membro ativo localizado</p></td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-slate-900 text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center font-black text-xs shadow-md italic group-hover:scale-110 transition-transform">
                            {member.name?.substring(0, 1).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate italic">{member.name}</p>
                            <p className="text-[9px] font-black text-[#01223d] uppercase tracking-widest mt-1 opacity-60">{member.role}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-base font-black text-slate-900 tracking-tighter italic">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(member.salary_value || 0)}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm italic ${
                         member.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                       }`}>
                         {member.status || 'Ativo'}
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

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => { setIsNewMemberModalOpen(false); fetchMembers(); }} user={user} />
    </div>
  );
};

export default OperationalEquipe;
