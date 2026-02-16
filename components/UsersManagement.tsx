
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Database, 
  Loader2, 
  RefreshCcw,
  Search,
  Users,
  UserCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewUserModal from './NewUserModal';

interface UsersManagementProps {
  user: any;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ user }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Erro usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const stats = useMemo(() => {
    const total = users.length;
    return [
      { label: 'Sua Equipe', value: total.toString(), trend: 'Membros Ativos', icon: <Users size={20}/> },
      { label: 'Status Base', value: 'Isolado', trend: 'SQL Personal', icon: <Database size={20}/> },
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen animate-in fade-in duration-700 pb-24 md:pb-20 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Equipe <span className="text-[#01223d] not-italic">& Acessos</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática de permissões e governança SQL</p>
        </div>

        <button 
          onClick={() => setIsNewUserModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <UserPlus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-12 transition-transform" /> Convidar Operador
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
           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Segurança de Dados</p>
           <h3 className="text-2xl font-black tracking-tighter italic relative z-10 uppercase">Módulo de Acesso Criptografado</h3>
           <ShieldCheck size={140} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform pointer-events-none" />
           <button onClick={fetchUsers} className="relative z-10 w-fit p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
             <RefreshCcw size={14} className={`text-[#b4a183] ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 p-2 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 group w-full ml-0 md:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail de acesso..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 transition-all outline-none text-slate-600"
          />
        </div>
      </div>

      <div className="relative z-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-[#01223d] mb-4" size={32} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Permissões...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 opacity-30 text-center space-y-4 px-8">
             <Users size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-xs font-black uppercase tracking-widest italic">Nenhum membro cadastrado nesta estrutura</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Membro & Credenciais</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Permissão SQL</th>
                  <th className="px-10 py-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                         <div className="w-11 h-11 bg-slate-900 text-[#b4a183] border border-slate-700 rounded-xl flex items-center justify-center font-black text-xs shadow-md italic group-hover:scale-110 transition-transform">
                            {u.full_name?.substring(0,1).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-black text-slate-900 uppercase text-sm italic">{u.full_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{u.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="text-[9px] font-black px-4 py-1.5 rounded-full uppercase bg-white border border-slate-200 shadow-sm italic text-[#01223d] tracking-widest">
                         {u.role || 'Visualizador'}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="p-2.5 text-slate-200 hover:text-slate-900 transition-all">
                         <MoreVertical size={18}/>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewUserModal 
        isOpen={isNewUserModalOpen} 
        onClose={() => { setIsNewUserModalOpen(false); fetchUsers(); }} 
        user={user}
      />
    </div>
  );
};

export default UsersManagement;
