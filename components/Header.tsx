
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Command, LayoutGrid, Database, Activity, ShieldCheck, ChevronDown as ChevronDownIcon } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import GlobalSearchOverlay from './GlobalSearchOverlay';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenTv?: () => void;
  title: string;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onOpenTv, title, onNavigate, activeView }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (!error) setUnreadCount(count || 0);
    } catch (err) {
      console.error('Erro ao contar notificações:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    const channel = supabase
      .channel('header-notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems = [
    { label: 'Indicadores', view: 'Dashboard' },
    { label: 'Atendimentos', view: 'Pipeline' },
    { label: 'Imóveis', view: 'Imóveis' }
  ];

  const isItemActive = (view: string) => {
    if (view === 'Dashboard' && activeView === 'Dashboard') return true;
    if (view === 'Pipeline' && activeView === 'Pipeline') return true;
    if (view === 'Imóveis' && activeView === 'Imóveis') return true;
    return false;
  };

  return (
    <header className="px-4 md:px-8 h-20 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-slate-300 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6 md:gap-10">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors">
          <Menu size={20} />
        </button>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          {menuItems.map(item => (
            <button 
              key={item.label} 
              onClick={() => onNavigate(item.view)}
              className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-2 h-full relative group ${
                isItemActive(item.view) 
                ? 'text-slate-900' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.label}
              <ChevronDownIcon size={10} className={isItemActive(item.view) ? 'text-blue-600' : 'text-slate-300'} />
              {isItemActive(item.view) && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-t-full animate-in fade-in slide-in-from-bottom-1 duration-500 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-4 pl-6 border-l border-slate-100">
           <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
              <ShieldCheck size={14} className="text-blue-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Secure Ledger</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
              <Activity size={14} className="text-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Sync</span>
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner mr-2">
           <button 
             onClick={() => setIsSearchOpen(true)}
             className="p-2.5 bg-white text-slate-400 hover:text-slate-900 rounded-lg shadow-sm border border-slate-200 transition-all group active:scale-95"
             title="Busca SQL"
           >
             <Search size={18} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>

        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="w-11 h-11 bg-slate-900 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all relative border border-slate-700 shadow-lg group active:scale-95"
        >
          <Bell size={18} className="group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-slate-900 rounded-full shadow-sm animate-bounce"></span>
          )}
        </button>
        
        <button 
          onClick={onOpenTv}
          className="w-11 h-11 bg-white border border-slate-300 text-slate-400 hover:text-slate-900 hover:border-slate-900 rounded-xl flex items-center justify-center transition-all shadow-sm group active:scale-95"
          title="Modo Monitoramento"
        >
          <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {isNotificationsOpen && <NotificationCenter onClose={() => setIsNotificationsOpen(false)} onMarkAllRead={fetchUnreadCount} />}
    </header>
  );
};

export default Header;
