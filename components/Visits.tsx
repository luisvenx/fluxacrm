
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Loader2, 
  Database,
  RefreshCcw,
  MessageSquare,
  Home,
  Star,
  Phone,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewVisitModal from './NewVisitModal';
import VisitDetailModal from './VisitDetailModal';

interface VisitsProps {
  user: any;
}

const Visits: React.FC<VisitsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');

  const fetchVisits = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          properties (title, address, rent_price, sale_price, type, bedrooms, bathrooms, area, status, image_url)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (err) {
      console.error('Erro ao buscar visitas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [user]);

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const matchSearch = v.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'Todas' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [visits, searchTerm, statusFilter]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={10} className={i < rating ? 'fill-[#b4a183] text-[#b4a183]' : 'text-slate-200'} />
    ));
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic">
            Controle de <span className="text-[#01223d] not-italic">Visitas</span>
          </h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">Pipeline de demonstração e leads ativos</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} className="text-[#b4a183]" strokeWidth={3} />
          Agendar Tour
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou imóvel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 text-slate-600 outline-none"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 overflow-x-auto no-scrollbar">
          {['Todas', 'Agendada', 'Realizada', 'Proposta'].map(st => (
            <button 
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === st ? 'bg-[#01223d] text-white shadow-sm' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
          <button onClick={fetchVisits} className="ml-2 p-2 text-slate-400 hover:text-[#b4a183]">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabela de Visitas */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data & Operação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unidade Alvo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interessado</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Feedback AI</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditando Agenda...</p></td></tr>
              ) : filteredVisits.length === 0 ? (
                <tr><td colSpan={6} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum registro localizado</p></td></tr>
              ) : (
                filteredVisits.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedVisit(item)}
                    className="hover:bg-slate-50 transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight italic uppercase">{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase mt-1">
                          <Clock size={10} className="text-[#b4a183]" /> {item.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 text-[#b4a183] rounded-lg border border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform italic font-black">
                          {item.properties?.type?.substring(0,1)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate max-w-[200px] italic">{item.properties?.title}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase truncate max-w-[200px] tracking-widest mt-0.5">{item.properties?.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                         <p className="text-sm font-bold text-slate-800 uppercase tracking-tight italic">{item.client_name}</p>
                         <p className="text-[9px] font-black text-[#01223d] uppercase opacity-60">{item.client_phone || 'S/ Telefone'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       {item.feedback ? (
                         <div className="flex flex-col gap-2">
                            <div className="flex gap-0.5">{renderStars(item.feedback_rating || 0)}</div>
                            <p className="text-[10px] text-slate-500 italic line-clamp-1">"{item.feedback}"</p>
                         </div>
                       ) : (
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Aguardando</span>
                       )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                        item.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                        item.status === 'Proposta' ? 'bg-indigo-50 text-[#01223d] border-indigo-200 animate-pulse' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2.5 text-slate-200 hover:text-slate-900 rounded-lg transition-all">
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

      <NewVisitModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchVisits(); }} user={user} />
      {selectedVisit && (
        <VisitDetailModal 
          visit={selectedVisit} 
          onClose={() => setSelectedVisit(null)} 
        />
      )}
    </div>
  );
};

export default Visits;
