
import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  FileText,
  User
} from 'lucide-react';

interface MarketingTask {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video' | 'copy';
  dueDate: string;
  assignedTo: string;
}

const MarketingKanbans: React.FC = () => {
  const columns = [
    { id: 'idea', label: 'Ideação', count: 0 },
    { id: 'prod', label: 'Produção', count: 2 },
    { id: 'review', label: 'Revisão', count: 1 },
    { id: 'sched', label: 'Agendado', count: 0 },
    { id: 'live', label: 'Publicado', count: 0 },
  ];

  const tasks: MarketingTask[] = [
    { id: '1', title: 'Carrossel Institucional - Gestão Financeira', category: 'Instagram', type: 'image', dueDate: '15 Mai', assignedTo: 'Kyrooss' },
    { id: '2', title: 'Reel: 5 Dicas para reduzir impostos', category: 'TikTok/Reels', type: 'video', dueDate: '16 Mai', assignedTo: 'Kyrooss' },
    { id: '3', title: 'Newsletter Semanal: Fechamento de Abril', category: 'E-mail', type: 'copy', dueDate: '12 Mai', assignedTo: 'Kyrooss' },
  ];

  const getTypeIcon = (type: MarketingTask['type']) => {
    switch (type) {
      case 'image': return <ImageIcon size={14} />;
      case 'video': return <Video size={14} />;
      case 'copy': return <FileText size={14} />;
    }
  };

  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col animate-in fade-in duration-500 overflow-hidden">
      
      {/* Kanban Header */}
      <div className="p-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Kanbans de Marketing</h2>
          <p className="text-sm text-gray-400 font-medium">Gestão de produção de conteúdo e campanhas</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar tarefa..." 
              className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 shadow-sm w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
          <button className="bg-[#0047AB] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg flex items-center gap-2">
            <Plus size={20} />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto px-8 pb-8 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col) => (
            <div key={col.id} className="w-[300px] flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1e293b]">{col.label}</span>
                  <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{col.id === 'prod' ? '2' : col.id === 'review' ? '1' : '0'}</span>
                </div>
                <button className="p-1 hover:bg-white rounded transition-colors text-gray-300">
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-3 space-y-3">
                 {tasks.filter(t => (col.id === 'prod' && (t.id === '1' || t.id === '2')) || (col.id === 'review' && t.id === '3')).map(task => (
                   <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {task.category}
                          </span>
                          <button className="text-gray-200 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                        
                        <h4 className="text-sm font-bold text-gray-800 leading-tight">
                          {task.title}
                        </h4>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-gray-400">
                               {getTypeIcon(task.type)}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                               <Calendar size={12} />
                               {task.dueDate}
                            </div>
                          </div>
                          
                          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm" title={task.assignedTo}>
                            {task.assignedTo.substring(0, 1)}
                          </div>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingKanbans;
