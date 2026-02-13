
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Database, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Agenda: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // Busca compromissos do mês atual
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', firstDay)
        .lte('start_time', lastDay)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Erro ao carregar agenda:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    setSelectedDay(1);
  };

  // Filtra compromissos do dia selecionado para a lista lateral
  const dayAppointments = useMemo(() => {
    return appointments.filter(app => {
      const date = new Date(app.start_time);
      return date.getDate() === selectedDay;
    });
  }, [appointments, selectedDay]);

  // Mapeia quais dias têm compromissos para mostrar o indicador no calendário
  const daysWithData = useMemo(() => {
    const days = new Set();
    appointments.forEach(app => days.add(new Date(app.start_time).getDate()));
    return days;
  }, [appointments]);

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'comercial': return 'text-blue-600 bg-blue-50';
      case 'financeiro': return 'text-rose-600 bg-rose-50';
      case 'gestão': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-400 bg-slate-50';
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in fade-in duration-500 pb-24">
      {/* Coluna do Calendário */}
      <div className="xl:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agenda Sync Ativa</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{monthYear}</h2>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={() => changeMonth(-1)}
              className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 shadow-sm text-slate-400 hover:text-slate-900 transition-all active:scale-90"
             >
               <ChevronLeft size={18}/>
             </button>
             <button 
              onClick={() => changeMonth(1)}
              className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 shadow-sm text-slate-400 hover:text-slate-900 transition-all active:scale-90"
             >
               <ChevronRight size={18}/>
             </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-[10px] font-black uppercase text-slate-300 py-2 tracking-[0.25em]">{day}</div>
          ))}
          
          {/* Espaços vazios para o início do mês */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square opacity-0"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const hasData = daysWithData.has(dayNum);
            const isSelected = selectedDay === dayNum;
            const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

            return (
              <div 
                key={dayNum} 
                onClick={() => setSelectedDay(dayNum)}
                className={`aspect-square border rounded-3xl p-4 flex flex-col justify-between hover:border-blue-500 transition-all cursor-pointer shadow-sm group relative overflow-hidden ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-900 text-white ring-4 ring-slate-100' 
                    : 'bg-white border-slate-50 text-slate-400 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-black ${isSelected ? 'text-white' : isToday ? 'text-blue-600 underline decoration-2 underline-offset-4' : 'text-slate-400 group-hover:text-slate-900'}`}>
                    {dayNum}
                  </span>
                  {hasData && !isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  )}
                </div>
                
                {hasData && (
                  <div className={`text-[8px] font-black uppercase tracking-tighter truncate ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                    {appointments.filter(a => new Date(a.start_time).getDate() === dayNum).length} Eventos
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coluna de Compromissos */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Compromissos do Dia {selectedDay}</h3>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-90">
             <Plus size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
               <Loader2 className="animate-spin text-blue-600" size={24} />
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Consultando Engine...</p>
            </div>
          ) : dayAppointments.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
               <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                  <CalendarIcon size={32} className="text-slate-300" />
               </div>
               <div className="max-w-[200px]">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Nenhum evento registrado para este dia</p>
               </div>
            </div>
          ) : (
            dayAppointments.map((item, idx) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 p-6 rounded-[2rem] flex gap-5 items-center group hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center justify-center text-slate-300 border-r border-slate-50 pr-5 group-hover:text-blue-600 transition-colors">
                  <Clock size={16} className="mb-1" />
                  <span className="text-[11px] font-black tracking-tighter">
                    {new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors truncate uppercase tracking-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${getCategoryColor(item.category)}`}>
                      {item.category || 'Geral'}
                    </span>
                  </div>
                </div>
                <CheckCircle2 
                  size={20} 
                  className={`transition-colors cursor-pointer ${item.is_completed ? 'text-emerald-500' : 'text-slate-100 group-hover:text-slate-200'}`} 
                />
              </div>
            ))
          )}
        </div>

        {!isLoading && dayAppointments.length > 0 && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle size={80} />
             </div>
             <div className="relative z-10">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Dica de Produtividade</h5>
                <p className="text-xs font-medium leading-relaxed opacity-70">
                  Você tem {dayAppointments.length} reuniões hoje. Prepare seus dashboards antes de cada call para maior eficiência.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
