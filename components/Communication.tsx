
import React from 'react';
import { MessageSquare, Bell, Search, Filter, Send, Circle } from 'lucide-react';

const Communication: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Comunicação</h2>
          <p className="text-sm font-medium text-gray-400">Notificações e avisos da plataforma</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl">
           <Circle size={10} className="fill-blue-600 text-blue-600" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">3 Novas Mensagens</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
         <div className="bg-white border border-gray-200 rounded-3xl flex flex-col shadow-sm">
            <div className="p-6 border-b border-gray-100 relative">
               <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
               <input type="text" placeholder="Filtrar avisos..." className="w-full bg-gray-50 rounded-xl py-2 pl-12 pr-4 text-xs font-bold focus:outline-none" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
               {[
                 { title: 'Manutenção do Sistema', date: 'Há 2h', desc: 'Agendada para 23:00 de hoje.', icon: <Bell className="text-blue-600" /> },
                 { title: 'Novo Comentário', date: 'Há 5h', desc: 'Kyrooss marcou você no DRE.', icon: <MessageSquare className="text-emerald-600" /> },
                 { title: 'Relatórios Prontos', date: 'Ontem', desc: 'Seu contador enviou os PDF.', icon: <Bell className="text-gray-400" /> },
               ].map((notif, i) => (
                 <div key={i} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-2">
                     <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">{notif.icon}</div>
                     <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{notif.date}</span>
                   </div>
                   <h5 className="font-bold text-gray-900 text-sm mb-1">{notif.title}</h5>
                   <p className="text-xs text-gray-500 line-clamp-1">{notif.desc}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl flex flex-col shadow-sm overflow-hidden">
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <MessageSquare size={40} />
               </div>
               <div>
                  <h4 className="font-bold text-lg">Selecione uma conversa</h4>
                  <p className="text-sm">Os avisos detalhados e conversas aparecerão aqui</p>
               </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
               <input type="text" disabled placeholder="Escrever resposta..." className="flex-1 bg-white border border-gray-100 rounded-xl px-4 text-xs font-bold opacity-50 cursor-not-allowed" />
               <button disabled className="p-3 bg-blue-600 text-white rounded-xl opacity-50 cursor-not-allowed"><Send size={18} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Communication;
