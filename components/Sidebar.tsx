
import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Megaphone, 
  Settings, 
  Users, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  BarChart,
  UserCheck,
  Target,
  Trophy,
  Receipt,
  Network,
  CreditCard,
  FileText,
  BarChart3,
  Wrench,
  X,
  Building2,
  Package,
  Rocket,
  Star,
  CircleDot,
  Wallet,
  PanelLeftClose,
  PanelLeft,
  Scale,
  Users2,
  FileSignature,
  ShieldCheck,
  Loader2,
  Home,
  MapPin,
  HandCoins,
  Eye,
  ClipboardCheck
} from 'lucide-react';
import { NavItem } from '../types';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  userEmail?: string;
  userName?: string;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isCollapsed, 
  userEmail, 
  userName, 
  toggleSidebar, 
  toggleCollapse, 
  onNavigate, 
  activeView 
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Imobiliária', 'Financeiro']);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMenu = (id: string) => {
    if (isCollapsed) {
      toggleCollapse();
      setExpandedMenus(prev => prev.includes(id) ? prev : [...prev, id]);
      return;
    }
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
  };

  const navItems: NavItem[] = [
    { 
      id: 'Imobiliária', 
      label: 'Imobiliária', 
      icon: <Home size={18} />,
      subItems: [
        { id: 'Imóveis', label: 'Base de Imóveis', icon: <MapPin size={14} /> },
        { id: 'Visitas', label: 'Visitas', icon: <Eye size={14} /> },
        { id: 'Vistorias', label: 'Vistorias', icon: <ClipboardCheck size={14} /> },
        { id: 'Repasses', label: 'Gestão Repasses', icon: <HandCoins size={14} /> },
      ]
    },
    { id: 'Agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { 
      id: 'Financeiro', 
      label: 'Financeiro', 
      icon: <DollarSign size={18} />,
      subItems: [
        { id: 'Dashboard', label: 'Painel', icon: <LayoutDashboard size={14} /> },
        { id: 'Lançamentos', label: 'Ledger', icon: <Receipt size={14} /> },
        { id: 'Centros', label: 'Centros', icon: <Network size={14} /> },
        { id: 'Cartões', label: 'Wallet', icon: <CreditCard size={14} /> },
      ]
    },
    { 
      id: 'Comercial', 
      label: 'Comercial', 
      icon: <Briefcase size={18} />,
      subItems: [
        { id: 'Pipeline', label: 'Funil', icon: <BarChart size={14} /> },
        { id: 'Metas', label: 'OKRs', icon: <Target size={14} /> },
      ]
    },
    {
      id: 'Admin',
      label: 'Administração',
      icon: <ShieldCheck size={18} />,
      subItems: [
        { id: 'Usuários', label: 'Equipe', icon: <Users size={14} /> },
        { id: 'Configurações', label: 'Ajustes', icon: <Settings size={14} /> },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-100 transition-all duration-500 ease-in-out transform flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'w-[280px] lg:w-20' : 'w-[280px] lg:w-72'}`}
    >
      <div className={`p-6 flex items-center justify-between bg-white shrink-0 ${isCollapsed ? 'lg:flex-col lg:gap-6' : ''}`}>
        <div 
          className="flex items-center cursor-pointer transition-transform active:scale-95"
          onClick={() => isCollapsed ? toggleCollapse() : onNavigate('Dashboard')}
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1Cga62qbLuN6sEj_qXQB-8IYIHHN0MVdD" 
            alt="Fluxa Logo" 
            className={`transition-all duration-500 object-contain ${isCollapsed ? 'h-8 lg:h-8 lg:w-8' : 'h-10'}`}
          />
        </div>
        
        <button 
          onClick={toggleCollapse} 
          className="hidden lg:flex p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-slate-900"
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 text-slate-300 hover:text-slate-900"
        >
          <X size={24} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto no-scrollbar py-6 ${isCollapsed ? 'px-2' : 'px-4'} space-y-2`}>
        {navItems.map((item) => (
          <div key={item.id} className="space-y-1">
            {!item.subItems ? (
              <button 
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center rounded-2xl transition-all group ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3.5 p-3.5'
                } ${activeView === item.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <span className={`${activeView === item.id ? 'text-blue-400' : 'text-slate-200 group-hover:text-slate-900'}`}>{item.icon}</span>
                <span className={`flex-1 text-left text-[11px] font-black uppercase tracking-widest ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
              </button>
            ) : (
              <div className="space-y-1">
                <button 
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center rounded-2xl transition-all group ${
                    isCollapsed ? 'justify-center p-3' : 'gap-3.5 p-3.5'
                  } ${expandedMenus.includes(item.id) ? 'bg-slate-50/50' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <span className="text-slate-300 group-hover:text-slate-900">{item.icon}</span>
                  <span className={`flex-1 text-left text-[11px] font-black uppercase tracking-widest ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  <ChevronDown size={14} className={`text-slate-200 transition-transform ${isCollapsed ? 'lg:hidden' : ''} ${expandedMenus.includes(item.id) ? '' : '-rotate-90'}`} />
                </button>
                
                {(expandedMenus.includes(item.id)) && !isCollapsed && (
                  <div className="space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200 ml-3 border-l border-slate-100 pl-4">
                    {item.subItems.map(sub => (
                      <button 
                        key={sub.id} 
                        onClick={() => onNavigate(sub.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold transition-all group ${
                          activeView === sub.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <span className="tracking-tight uppercase tracking-widest">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`p-4 border-t border-slate-50 shrink-0 ${isCollapsed ? 'lg:flex lg:flex-col lg:items-center' : ''}`}>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-slate-400 hover:text-rose-600 hover:bg-rose-50 group ${isCollapsed ? 'justify-center' : ''}`}
        >
          {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          <span className={`text-[10px] font-black uppercase tracking-widest ${isCollapsed ? 'lg:hidden' : ''}`}>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
