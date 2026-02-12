
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ChevronDown, 
  Calendar, 
  X, 
  Eye, 
  Edit3,
  Building2,
  Wallet
} from 'lucide-react';
import NewMemberModal from './NewMemberModal';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  costCenter: string;
  value: string;
  status: string;
  totalPaid: string;
}

const OperationalEquipe: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('Ativos');
  const [paymentFilter, setPaymentFilter] = useState('Todos');
  const [costCenterFilter, setCostCenterFilter] = useState('Todos');
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);

  const members: TeamMember[] = [
    { id: '1', name: 'Gabriel Dantras', initials: 'GD', role: 'bdr', costCenter: '—', value: 'R$ 0,00', status: 'Sem pgto', totalPaid: '—' },
    { id: '2', name: 'Kyros', initials: 'K', role: 'owner', costCenter: '—', value: 'R$ 0,00', status: 'Sem pgto', totalPaid: '—' },
    { id: '3', name: 'Lucca Hurtado', initials: 'LH', role: 'admin', costCenter: '—', value: 'R$ 0,00', status: 'Sem pgto', totalPaid: '—' },
    { id: '4', name: 'Luis Venx', initials: 'LV', role: 'admin', costCenter: '—', value: 'R$ 0,00', status: 'Sem pgto', totalPaid: '—' },
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">Equipe</h2>
            <p className="text-sm text-gray-400 font-medium">Gerencie funcionários, sócios e pagamentos</p>
          </div>
        </div>

        <button 
          onClick={() => setIsNewMemberModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Novo Membro
        </button>
      </div>

      {/* Advanced Filters Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-wrap items-end gap-4">
        <div className="space-y-1.5 flex-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2 px-4 text-xs appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-bold"
            >
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pagamento</label>
          <div className="relative">
            <select 
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2 px-4 text-xs appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-bold"
            >
              <option>Todos</option>
              <option>Pendentes</option>
              <option>Pagos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Centro de Custo</label>
          <div className="relative">
            <select 
              value={costCenterFilter}
              onChange={(e) => setCostCenterFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2 px-4 text-xs appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-bold"
            >
              <option>Todos</option>
              <option>Operacional</option>
              <option>Administrativo</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[160px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Data Início</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="dd/mm/aaaa"
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2 px-4 text-xs focus:outline-none text-gray-400 font-bold"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[160px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Data Fim</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="dd/mm/aaaa"
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2 px-4 text-xs focus:outline-none text-gray-400 font-bold"
            />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button className="flex items-center gap-1 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
          <X size={14} />
          Limpar
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-28 group hover:border-gray-200 transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total de Membros</p>
          <p className="text-3xl font-bold text-[#1e293b]">4</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-28 group hover:border-gray-200 transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Valor Mensal (Ref)</p>
          <p className="text-3xl font-bold text-[#1e293b]">R$ 0,00</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-28 group hover:border-red-100 transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Pago</p>
          <p className="text-3xl font-bold text-red-500">R$ 0,00</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-28 group hover:border-orange-100 transition-all">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Pendente</p>
          <p className="text-3xl font-bold text-orange-400">R$ 0,00</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-50 bg-gray-50/30">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 tracking-tight">Nome</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 tracking-tight">Cargo</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 tracking-tight">Centro de Custo</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 tracking-tight">Valor</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 tracking-tight">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 tracking-tight">Total Pago</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 tracking-tight text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-400 border border-gray-100">
                        {member.initials}
                      </div>
                      <span className="text-sm font-bold text-[#1e293b]">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-400 lowercase">{member.role}</td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-400">{member.costCenter}</td>
                  <td className="px-6 py-6 text-sm font-bold text-[#1e293b]">{member.value}</td>
                  <td className="px-6 py-6">
                    <span className="bg-[#f1f5f9] text-[#64748b] px-3 py-1 rounded-full text-[10px] font-bold tracking-tight">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-400">{member.totalPaid}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-300">
                      <button className="hover:text-blue-600 transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="hover:text-gray-900 transition-colors">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewMemberModal 
        isOpen={isNewMemberModalOpen}
        onClose={() => setIsNewMemberModalOpen(false)}
      />

    </div>
  );
};

export default OperationalEquipe;
