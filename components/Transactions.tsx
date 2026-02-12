
import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Upload, 
  MousePointer2, 
  Calendar,
  ArrowUp,
  ReceiptText,
  Trash2,
  CheckCircle,
  Tag,
  X,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Info
} from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import ImportModal from './ImportModal';

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Todos');

  const tabs = ['Todos', 'Pagos', 'Pendentes', 'Atrasados'];

  const mockData = [
    { id: 1, date: '12 Fev, 2026', desc: 'Assinatura AWS Cloud', cat: 'Infraestrutura', bank: 'Itaú Unibanco', val: 'R$ 1.240,50', type: 'out', status: 'Pago' },
    { id: 2, date: '11 Fev, 2026', desc: 'Projeto Cliente Sirius', cat: 'Serviços', bank: 'Itaú Unibanco', val: 'R$ 15.000,00', type: 'in', status: 'Pago' },
    { id: 3, date: '10 Fev, 2026', desc: 'Aluguel Escritório SP', cat: 'Fixas', bank: 'Itaú Unibanco', val: 'R$ 4.500,00', type: 'out', status: 'Pendente' },
    { id: 4, date: '09 Fev, 2026', desc: 'Consultoria Financeira', cat: 'Serviços', bank: 'Nubank', val: 'R$ 2.800,00', type: 'in', status: 'Atrasado' },
    { id: 5, date: '08 Fev, 2026', desc: 'Reembolso Viagem Comercial', cat: 'Vendas', bank: 'Itaú Unibanco', val: 'R$ 450,20', type: 'out', status: 'Pago' },
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-8 animate-in fade-in duration-700 pb-20 px-6 lg:px-10 pt-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Lançamentos</h2>
          <p className="text-slate-500 font-medium mt-1">Gerencie o fluxo histórico de transações da sua empresa.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Upload size={18} />
            Importar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-[1.25rem] w-full lg:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2 rounded-[1rem] text-xs font-bold transition-all ${selectedTab === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto pr-2">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por descrição, valor ou categoria..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 placeholder:text-slate-300"
            />
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* SaaS Style Ledger Table */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                {isSelectionMode && <th className="px-8 py-5 w-10"><input type="checkbox" className="rounded-lg border-slate-200 text-blue-600" /></th>}
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                  {isSelectionMode && (
                    <td className="px-8 py-5">
                      <input type="checkbox" className="rounded-lg border-slate-200 text-blue-600" />
                    </td>
                  )}
                  <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-slate-400">{item.date}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${item.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight">{item.desc}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{item.bank}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-wider">
                      {item.cat}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-sm font-bold text-right tracking-tight ${item.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {item.type === 'in' ? '+' : '-'} {item.val}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      item.status === 'Pago' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 
                      item.status === 'Pendente' ? 'bg-amber-50 text-amber-500 border border-amber-100' : 
                      'bg-rose-50 text-rose-500 border border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors rounded-lg hover:bg-white group-hover:bg-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination / Load More */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-center">
          <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
            Carregar mais transações
          </button>
        </div>
      </div>

      <NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
};

export default Transactions;
