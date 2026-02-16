
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Database, 
  Plus, 
  Share2, 
  Unlink, 
  CheckCircle, 
  Globe,
  Settings,
  Zap,
  MoreVertical,
  CalendarDays
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewAppointmentModal from './NewAppointmentModal';
import { googleCalendar } from '../lib/googleCalendar';

interface AgendaProps {
  user: any;
}

const Agenda: React.FC<AgendaProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(googleCalendar.isConnected());

  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const fetchAppointments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data: localData, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', firstDay)
        .lte('start_time', lastDay)
        .order('start_time', { ascending: true });

      if (error) throw error;

      let mergedEvents = (localData || []).map(ev => ({ ...ev, source: 'local' }));

      if (googleCalendar.isConnected()) {
        const gData = await googleCalendar.listEvents(firstDay, lastDay);
        if (gData && gData.items) {
          const gEvents = gData.items.map((gEv: any) => ({
            id: gEv.id,
            title: gEv.summary,
            start_time: gEv.start.dateTime || gEv.start.date,
            end_time: gEv.end.dateTime || gEv.end.date,
            category: 'Google',
            is_completed: false,
            source: 'google',
            description: gEv.description
          }));
          
          mergedEvents = [...mergedEvents, ...gEvents.filter((ge: any) => 
            !mergedEvents.some(le => le.title === ge.title && le.start_time === ge.start_time)
          )];
        }
      }

      setAppointments(mergedEvents.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()));
    } catch (err) {
      console.error('Erro ao carregar agenda:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate, user, isGoogleConnected]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
    setSelectedDay(1);
  };

  const toggleComplete = async (id: string, currentStatus: boolean, source: string) => {
    if (source === 'google') return;
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ is_completed: !currentStatus })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      fetchAppointments();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      await googleCalendar.connect();
      setIsGoogleConnected(googleCalendar.isConnected());
    } catch (err) {
      console.error('Erro conexão Google:', err);
    }
  };

  const handleDisconnectGoogle = () => {
    googleCalendar.disconnect();
    setIsGoogleConnected(false);
  };

  const dayAppointments = useMemo(() => {
    return appointments.filter(app => {
      const date = new Date(app.start_time);
      return date.getDate() === selectedDay;
    });
  }, [appointments, selectedDay]);

  const daysWithData = useMemo(() => {
    const days = new Set();
    appointments.forEach(app => days.add(new Date(app.start_time).getDate()));
    return days;
  }, [appointments]);

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'comercial': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'financeiro': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'gestão': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'google': return 'text-[#b4a183] bg-slate-900 border-slate-700';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700 px-6 md:px-10 pt-8 relative overflow-hidden font-['Inter']">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#01223d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Timeline de <span className="text-[#01223d] not-italic">Compromissos</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Gestão tática de agenda e eventos sincronizados SQL</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#01223d] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <Plus size={18} strokeWidth={3} className="text-[#b4a183] group-hover:rotate-90 transition-transform" /> Novo Evento
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Lado Esquerdo: Calendário Grid */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4 px-4">
              <CalendarDays size={20} className="text-[#b4a183]" />
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight capitalize">{monthYear}</h3>
            </div>
            <div className="flex gap-1">
               <button onClick={() => changeMonth(-1)} className="p-2.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all active:scale-90">
                 <ChevronLeft size={20}/>
               </button>
               <button onClick={() => changeMonth(1)} className="p-2.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all active:scale-90">
                 <ChevronRight size={20}/>
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-[10px] font-black uppercase text-slate-300 py-2 tracking-[0.25em]">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square opacity-0"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const hasData = daysWithData.has(dayNum);
              const isSelected = selectedDay === dayNum;
              const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              return (
                <div 
                  key={dayNum} 
                  onClick={() => setSelectedDay(dayNum)} 
                  className={`aspect-square border rounded-xl p-4 flex flex-col justify-between transition-all cursor-pointer shadow-sm relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-[#01223d] border-[#01223d] text-white shadow-xl scale-[1.02] z-10' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-[#b4a183] hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <span className={`text-sm font-black ${isSelected ? 'text-white' : isToday ? 'text-blue-600 underline decoration-2 underline-offset-4' : 'text-slate-400 group-hover:text-slate-900'}`}>{dayNum}</span>
                    {hasData && !isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#b4a183] animate-pulse"></div>}
                  </div>
                  {hasData && (
                    <div className={`text-[8px] font-black uppercase tracking-tighter truncate relative z-10 ${isSelected ? 'text-[#b4a183]' : 'text-slate-300'}`}>
                      {appointments.filter(a => new Date(a.start_time).getDate() === dayNum).length} Eventos
                    </div>
                  )}
                  {isSelected && <div className="absolute -right-2 -bottom-2 opacity-5"><CalendarIcon size={64} /></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lado Direito: Detalhes e Integração */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Integração Google - Estilo Wallet */}
          <div className={`p-8 rounded-xl border transition-all duration-500 relative overflow-hidden group ${
            isGoogleConnected ? 'bg-[#01223d] border-slate-700 text-white shadow-2xl' : 'bg-white border-slate-200 shadow-sm hover:border-[#b4a183]'
          }`}>
            <div className="relative z-10 flex justify-between items-start mb-10">
               <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8" alt="GCal" />
               </div>
               {isGoogleConnected ? (
                 <button onClick={handleDisconnectGoogle} className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><Unlink size={20} /></button>
               ) : (
                 <div className="p-2 bg-slate-50 rounded-lg text-slate-300 animate-pulse"><Share2 size={16}/></div>
               )}
            </div>

            <div className="relative z-10 space-y-6">
               <div>
                  <h4 className={`text-lg font-black tracking-tight uppercase italic leading-none ${isGoogleConnected ? 'text-white' : 'text-slate-900'}`}>Google Agenda</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isGoogleConnected ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isGoogleConnected ? 'Fluxo Sincronizado' : 'Status: Desconectado'}
                  </p>
               </div>

               {!isGoogleConnected ? (
                 <button 
                  onClick={handleConnectGoogle}
                  className="w-full py-3.5 bg-[#01223d] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                 >
                   <Globe size={14} className="text-[#b4a183]" /> Ativar Sincronização
                 </button>
               ) : (
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <CheckCircle size={12} className="text-emerald-400" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Sua timeline está em cloud</span>
                 </div>
               )}
            </div>
            <Database size={160} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform pointer-events-none" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Timeline <span className="text-[#01223d] not-italic">do Dia</span></h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Auditado para o dia {selectedDay}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-10 h-10 bg-slate-50 text-[#01223d] border border-slate-200 rounded-xl flex items-center justify-center hover:bg-[#01223d] hover:text-white transition-all active:scale-90 shadow-sm group"
              >
                 <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="py-24 text-center">
                  <Loader2 className="animate-spin mx-auto text-[#01223d] mb-4" size={24} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consultando Engine...</p>
                </div>
              ) : dayAppointments.length === 0 ? (
                <div className="py-20 text-center bg-white border border-slate-100 rounded-xl opacity-40">
                   <CalendarIcon size={32} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum evento localizado</p>
                </div>
              ) : (
                dayAppointments.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 p-6 rounded-xl flex gap-6 items-center group hover:border-[#b4a183] hover:shadow-xl transition-all shadow-sm relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center text-slate-300 border-r border-slate-50 pr-6 group-hover:text-[#01223d] transition-colors">
                      <Clock size={16} className="mb-1" />
                      <span className="text-xs font-black tracking-tighter">{new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold truncate uppercase tracking-tight italic transition-colors ${item.is_completed ? 'text-slate-300 line-through' : 'text-slate-800 group-hover:text-[#01223d]'}`}>{item.title}</h4>
                        {item.source === 'google' && <Globe size={10} className="text-[#b4a183] shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-inner ${getCategoryColor(item.category)}`}>
                          {item.category || 'Geral'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle2 
                        size={22} 
                        onClick={() => toggleComplete(item.id, item.is_completed, item.source)}
                        className={`transition-all cursor-pointer hover:scale-110 active:scale-90 ${item.is_completed ? 'text-emerald-500' : 'text-slate-100 group-hover:text-slate-200'} ${item.source === 'google' ? 'opacity-20 cursor-not-allowed' : ''}`} 
                      />
                      <button className="p-1 text-slate-100 group-hover:text-slate-300 transition-colors">
                        <MoreVertical size={16}/>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-[#b4a183]"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchAppointments(); }} 
        user={user}
        defaultDate={new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)}
      />
    </div>
  );
};

export default Agenda;
