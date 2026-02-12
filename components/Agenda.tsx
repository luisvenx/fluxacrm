
import React from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const Agenda: React.FC = () => {
  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="xl:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Maio de 2024</h2>
          <div className="flex gap-2">
             <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-gray-400 hover:text-gray-900"><ChevronLeft size={16}/></button>
             <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm text-gray-400 hover:text-gray-900"><ChevronRight size={16}/></button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-[10px] font-black uppercase text-gray-400 py-2 tracking-[0.2em]">{day}</div>
          ))}
          {Array.from({ length: 31 }).map((_, i) => (
            <div key={i} className={`aspect-square border rounded-2xl p-3 flex flex-col justify-between hover:border-blue-500 transition-all cursor-pointer shadow-sm group ${i === 21 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-400 hover:shadow-md'}`}>
              <span className={`text-xs font-black ${i === 21 ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`}>{i + 1}</span>
              {i % 7 === 0 && <div className={`w-1.5 h-1.5 rounded-full mx-auto ${i === 21 ? 'bg-white' : 'bg-red-500'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Compromissos do Dia</h3>
        <div className="space-y-4">
          {[
            { time: '09:00', title: 'Reunião com Kyrooss', cat: 'Comercial', color: 'blue' },
            { time: '14:30', title: 'Pagamento de Tributos', cat: 'Financeiro', color: 'red' },
            { time: '16:00', title: 'Review Operacional', cat: 'Gestão', color: 'emerald' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-5 rounded-3xl flex gap-5 items-center group hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
              <div className="flex flex-col items-center justify-center text-gray-300 border-r border-gray-50 pr-5 group-hover:text-blue-600 transition-colors">
                <Clock size={16} className="mb-1" />
                <span className="text-[10px] font-black tracking-tighter">{item.time}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{item.title}</h4>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.cat}</span>
              </div>
              <CheckCircle2 size={20} className="text-gray-100 group-hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
