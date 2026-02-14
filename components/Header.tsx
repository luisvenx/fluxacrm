
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, LayoutGrid, ChevronDown } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import GlobalSearchOverlay from './GlobalSearchOverlay';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenTv?: () => void;
  title: string;
  onNavigate: (view: string) => void;
  activeView: string;
  user: any;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onOpenTv, title, onNavigate, activeView, user }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Extrair inicial do usuário logado
  const userInitial = (user?.user_metadata?.full_name || user?.email || 'U').substring(0, 1).toUpperCase();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário';

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
  }, []);

  const menuItems = [
    { label: 'Indicadores', view: 'Dashboard' },
    { label: 'Atendimentos', view: 'Pipeline' },
    { label: 'Imóveis', view: 'Imóveis' }
  ];

  const isItemActive = (view: string) => activeView === view;

  return (
    <header className="px-4 md:px-8 py-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-40 transition-all shadow-sm shadow-slate-200/10">
      <div className="flex items-center gap-4">
        {/* Menu Mobile Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors active:scale-90"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/d/1Cga62qbLuN6sEj_qXQB-8IYIHHN0MVdD" 
            alt="Fluxa Logo" 
            className="h-8 md:h-9 w-auto object-contain cursor-pointer transition-transform active:scale-95"
            onClick={() => onNavigate('Dashboard')}
          />
          <div className="h-6 w-px bg-slate-100 hidden md:block"></div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map(item => (
            <button 
              key={item.label} 
              onClick={() => onNavigate(item.view)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-1.5 h-12 relative ${
                isItemActive(item.view) 
                ? 'text-blue-600' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.label}
              {isItemActive(item.view) && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-blue-600 rounded-t-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-1 md:gap-4">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2 text-slate-400 hover:text-blue-600 transition-all"
        >
          <Search size={20} />
        </button>

        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="p-2 text-slate-400 hover:text-blue-600 transition-all relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 border-2 border-white rounded-full"></span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-100 mx-1 hidden sm:block"></div>

        {/* Dynamic User Profile Icon */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="hidden md:flex flex-col items-end leading-none">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{firstName}</span>
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Acesso Master</span>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white text-xs font-black italic shadow-lg group-hover:bg-blue-600 group-hover:shadow-blue-200 transition-all duration-300">
            {userInitial}
          </div>
        </div>
      </div>

      <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {isNotificationsOpen && <NotificationCenter onClose={() => setIsNotificationsOpen(false)} onMarkAllRead={fetchUnreadCount} />}
    </header>
  );
};

export default Header;
