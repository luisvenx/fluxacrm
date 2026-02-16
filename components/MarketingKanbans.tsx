
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Loader2,
  Database,
  RefreshCcw,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import NewKanbanModal from './NewKanbanModal';
import NewTaskModal from './NewTaskModal';
import { supabase } from '../lib/supabase';

interface MarketingKanbansProps {
  user: any;
}

const MarketingKanbans: React.FC<MarketingKanbansProps> = ({ user }) => {
  const [isNewKanbanModalOpen, setIsNewKanbanModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { id: 'idea', label: 'Ideação', color: 'bg-slate-400', border: 'border-slate-300' },
    { id: 'prod', label: 'Produção', color: 'bg-[#01223d]', border: 'border-[#01223d]' },
    { id: 'review', label: 'Revisão', color: 'bg-[#b4a183]', border: 'border-[#b4a183]' },
    { id: 'sched', label: 'Agendado', color: 'bg-slate-900', border: 'border-slate-900' },
    { id: 'live', label: 'Publicado', color: 'bg-emerald-600', border: 'border-emerald-600' },
  ];

  const fetchTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Erro Kanban:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'image': return <ImageIcon size={12} />;
      case 'video': return <Video size={12} />;
      case 'copy': return <FileText size={12} />;
      default: return <FileText size={12} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col animate-in fade-in duration-700 overflow-hidden pb-24 md:pb-10 font-['Inter']">
      
      {/* Header Corporativo */}
      <div className="px-6 md:px-10 pt-8 pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm bg-white border-b border-slate-100">
        <div>
           <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
             Fluxos de <span className="text-[#01223d] not-italic">Conteúdo</span>
           </h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 ml-1">Workflows de produção e social media SQL</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsNewKanbanModalOpen(true)}
            className="flex-1 lg:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            Novo Quadro
          </button>
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex-1 lg:flex-none bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Nova Tarefa
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 mt-8 mb-4">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#01223d] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar em todos os fluxos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-slate-100 outline-none text-slate-600 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-[#01223d] mb-4" size={40} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Boards...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto no-scrollbar px-6 md:px-10 pb-10">
          <div className="flex gap-6 h-full min-w-max">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter(t => (t.stage || 'idea').toLowerCase() === col.id);
              return (
                <div key={col.id} className="w-[320px] flex flex-col h-full group">
                  <div className="mb-4 flex items-center justify-between px-2 pt-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 ${col.color} rounded-full shadow-sm`}></div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">{col.label}</span>
                    </div>
                    <span className="text-[9px] font-black bg-white border border-slate-200 text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter">{colTasks.length}</span>
                  </div>

                  <div className={`flex-1 bg-slate-50/20 rounded-xl border-2 border-dashed border-transparent transition-all duration-300 p-2 space-y-4 overflow-y-auto no-scrollbar hover:border-slate-200`}>
                    {colTasks.map(task => (
                      <div key={task.id} className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-2xl hover:border-[#b4a183] transition-all group/card relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#01223d] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              {task.category || 'Geral'}
                            </span>
                            <button className="text-slate-200 hover:text-slate-900 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          
                          <h4 className="text-sm font-black text-slate-800 leading-tight uppercase italic line-clamp-2 group-hover/card:text-[#01223d] transition-colors">
                            {task.title}
                          </h4>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                           <div className="flex items-center gap-2 text-slate-300 group-hover/card:text-[#b4a183] transition-colors">
                              {getTypeIcon(task.type)}
                              <span className="text-[9px] font-black uppercase tracking-widest">{task.type || 'copy'}</span>
                           </div>
                           <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-300 group-hover/card:text-[#01223d] transition-all">
                              <ChevronRight size={14} />
                           </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-0 group-hover/card:w-full transition-all duration-700 bg-[#b4a183]"></div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setIsNewTaskModalOpen(true)}
                      className="w-full py-6 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#01223d] hover:border-[#b4a183] hover:bg-white transition-all group/add shadow-inner"
                    >
                      <Plus size={20} className="group-hover/add:scale-125 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NewKanbanModal 
        isOpen={isNewKanbanModalOpen} 
        onClose={() => { setIsNewKanbanModalOpen(false); fetchTasks(); }} 
        user={user}
      />
      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => { setIsNewTaskModalOpen(false); fetchTasks(); }} 
        user={user}
      />
    </div>
  );
};

export default MarketingKanbans;
