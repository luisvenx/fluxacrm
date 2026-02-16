
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  MoreVertical, 
  Loader2, 
  Database,
  RefreshCcw,
  Home,
  CheckCircle2,
  Clock,
  Filter,
  Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewInspectionModal from './NewInspectionModal';
import InspectionDetailModal from './InspectionDetailModal';

interface InspectionsProps {
  user: any;
}

const Inspections: React.FC<InspectionsProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInspections = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          properties (title, address, type, status, image_url)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (err) {
      console.error('Erro ao buscar vistorias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [user]);

  const filteredInspections = useMemo(() => {
    return inspections.filter(i => 
      i.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.inspector_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inspections, searchTerm]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
            Vistorias <span className="text-[#01223d] not-italic">Técnicas</span>
          </h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-3">Controle de preservação de ativos imobiliários</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-[#01223d] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Plus size={18} className="text-[#b4a183] group-hover:rotate-90 transition-transform" strokeWidth={3} />
          Registrar Laudo
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative flex-1 w-full lg:max-w-md ml-0 lg:ml-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por imóvel ou vistoriador..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-11 pr-4 text-xs font-bold text-slate-600 outline-none"
          />
        </div>
        <button onClick={fetchInspections} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#b4a183] shadow-sm">
           <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto no-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data & Tipo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ativo Imobiliário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vistoriador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Fotos</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditoria Técnica...</p></td></tr>
              ) : filteredInspections.length === 0 ? (
                <tr><td colSpan={6} className="py-40 text-center opacity-30"><Database size={48} className="mx-auto mb-4" /><p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nenhum laudo registrado</p></td></tr>
              ) : (
                filteredInspections.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedInspection(item)}
                    className="hover:bg-slate-50 transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight italic uppercase">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                        <span className={`text-[9px] font-black uppercase mt-1 ${item.type === 'Saída' ? 'text-rose-500' : 'text-blue-500'}`}>
                           {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-[#01223d] rounded-lg text-[#b4a183] italic font-black shadow-sm">
                            {item.properties?.title?.substring(0,1).toUpperCase()}
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 uppercase truncate max-w-[200px] italic">{item.properties?.title}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase truncate max-w-[200px] tracking-tight">{item.properties?.address}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 uppercase italic tracking-tight">{item.inspector_name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-md">
                          <Camera size={12} className="text-[#b4a183]" />
                          <span className="text-[10px] font-black text-slate-600">{item.photos?.length || 0}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${
                         item.status === 'Realizada' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 
                         'bg-slate-50 text-slate-400 border-slate-200'
                       }`}>
                         {item.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 text-slate-200 hover:text-slate-900"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewInspectionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchInspections(); }} user={user} />
      {selectedInspection && (
        <InspectionDetailModal 
          inspection={selectedInspection} 
          onClose={() => setSelectedInspection(null)} 
        />
      )}
    </div>
  );
};

export default Inspections;
