
import React from 'react';
import { UserPlus, MoreVertical, ShieldCheck, Mail, Phone } from 'lucide-react';

const UsersManagement: React.FC = () => {
  const users = [
    { name: 'Kyrooss', email: 'kyroossx@gmail.com', role: 'Administrador', status: 'Ativo', avatar: 'K' },
    { name: 'Ana Souza', email: 'ana.financeiro@strict.com', role: 'Financeiro', status: 'Ativo', avatar: 'A' },
    { name: 'João Tech', email: 'joao.dev@strict.com', role: 'Consultor', status: 'Ausente', avatar: 'J' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Equipe & Acessos</h2>
          <p className="text-sm font-medium text-gray-400">Gerencie quem pode acessar o sistema</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
          <UserPlus size={16} /> Convidar Membro
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usuário</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cargo</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-600" />
                     <span className="text-sm font-bold text-gray-700">{user.role}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${user.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                     {user.status}
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
