
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
  ClipboardCheck,
  Database,
  Activity
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Imobiliária', 'Financeiro', 'Operacional', 'Comercial']);
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

  const userInitial = (userName || userEmail || 'U').substring(0, 1).toUpperCase();

  const navItems: NavItem[] = [
    { 
      id: 'Imobiliária', 
      label: 'Imobiliária', 
      icon: <Home size={18} />,
      subItems: [
        { id: 'Imóveis', label: 'Gestão de Imóveis', icon: <MapPin size={16} /> },
        { id: 'Visitas', label: 'Controle de Visitas', icon: <Eye size={16} /> },
        { id: 'Vistorias', label: 'Vistorias Técnicas', icon: <ClipboardCheck size={16} /> },
        { id: 'Repasses', label: 'Gestão de Repasses', icon: <HandCoins size={16} /> },
      ]
    },
    { id: 'Agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { 
      id: 'Financeiro', 
      label: 'Financeiro', 
      icon: <DollarSign size={18} />,
      subItems: [
        { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'Lançamentos', label: 'Lançamentos', icon: <Receipt size={16} /> },
        { id: 'Centros', label: 'Centros de Custo', icon: <Network size={16} /> },
        { id: 'Cartões', label: 'Cartões', icon: <CreditCard size={16} /> },
        { id: 'Impostos', label: 'Impostos', icon: <FileText size={16} /> },
        { id: 'Contábil', label: 'Contábil', icon: <Scale size={16} /> },
      ]
    },
    { 
      id: 'Comercial', 
      label: 'Comercial', 
      icon: <Briefcase size={18} />,
      subItems: [
        { id: 'Comercial-Dashboard', label: 'Dashboard', icon: <LayoutGrid size={16} /> },
        { id: 'Pipeline', label: 'Pipeline', icon: <BarChart size={16} /> },
        { id: 'Leads', label: 'Leads', icon: <UserCheck size={16} /> },
        { id: 'Metas', label: 'Metas', icon: <Target size={16} /> },
        { id: 'Ranking', label: 'Ranking', icon: <Trophy size={16} /> },
        { id: 'Squads', label: 'Squads', icon: <Users2 size={16} /> },
      ]
    },
    { 
      id: 'Marketing', 
      label: 'Marketing', 
      icon: <Megaphone size={18} />,
      subItems: [
        { id: 'Marketing-Dashboard', label: 'Dashboard', icon: <LayoutGrid size={16} /> },
        { id: 'Marketing-Kanbans', label: 'Kanbans', icon: <BarChart3 size={16} /> },
      ]
    },
    { 
      id: 'Operacional', 
      label: 'Operacional', 
      icon: <Building2 size={18} />,
      subItems: [
        { id: 'Operacional-Clientes', label: 'Clientes', icon: <Users size={16} /> },
        { id: 'Operacional-Contratos', label: 'Contratos', icon: <FileSignature size={16} /> },
        { id: 'Operacional-Produtos', label: 'Produtos', icon: <Package size={16} /> },
        { id: 'Operacional-Onboarding', label: 'Onboarding', icon: <Rocket size={16} /> },
        { id: 'Operacional-NPS', label: 'NPS', icon: <Star size={16} /> },
        { id: 'Operacional-OKR', label: 'OKR', icon: <CircleDot size={16} /> },
        { id: 'Operacional-Equipe', label: 'Equipe', icon: <Wallet size={16} /> },
        { id: 'Operacional-Ferramentas', label: 'Ferramentas', icon: <Wrench size={16} /> },
      ]
    },
    {
      id: 'Admin',
      label: 'Administração',
      icon: <ShieldCheck size={18} />,
      subItems: [
        { id: 'Usuários', label: 'Equipe & Acessos', icon: <Users size={16} /> },
        { id: 'Configurações', label: 'Ajustes de Conta', icon: <Settings size={16} /> },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-300 transition-all duration-500 ease-in-out transform flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'w-[280px] lg:w-20' : 'w-[280px] lg:w-72'}`}
    >
      {/* Background Micro-Pattern Lateral */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]" 
           style={{ backgroundImage: 'radial-gradient(#203267 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className={`p-6 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10 shrink-0 border-b border-slate-100 ${isCollapsed ? 'lg:flex-col lg:gap-6' : 'pb-8'}`}>
        <div 
          className="flex items-center group cursor-pointer overflow-hidden max-w-full"
          onClick={() => isCollapsed ? toggleCollapse() : onNavigate('Dashboard')}
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1Cga62qbLuN6sEj_qXQB-8IYIHHN0MVdD" 
            alt="Fluxa Logo" 
            className={`transition-all duration-500 object-contain ${isCollapsed ? 'h-8 lg:h-8 lg:w-8' : 'h-12'}`}
          />
        </div>
        
        <button 
          onClick={toggleCollapse} 
          className="hidden lg:flex p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 shadow-sm"
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto no-scrollbar pb-10 relative z-10 ${isCollapsed ? 'px-6 lg:px-2 space-y-8 lg:space-y-6' : 'px-4 space-y-10 pt-8'}`}>
        {navItems.map((item) => (
          <div key={item.id} className="space-y-4">
            <div className={`px-3 flex items-center justify-between ${isCollapsed ? 'lg:hidden' : ''}`}>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{item.label}</span>
              {item.subItems && (
                <button 
                  onClick={() => toggleMenu(item.id)}
                  className="text-slate-300 hover:text-[#203267] transition-colors"
                >
                  {expandedMenus.includes(item.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
              )}
            </div>
            
            {isCollapsed && <div className="hidden lg:block w-full h-[1px] bg-slate-200 mx-auto max-w-[20px]" />}
            
            <div className="space-y-1.5">
              {!item.subItems ? (
                <button 
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl transition-all duration-300 group ${
                    isCollapsed ? 'justify-center lg:justify-center p-3' : 'gap-3.5 p-3'
                  } ${activeView === item.id ? 'bg-slate-900 text-white shadow-xl border border-slate-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}`}
                >
                  <span className={`${activeView === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-900'}`}>{item.icon}</span>
                  <span className={`flex-1 text-left text-[11px] font-black uppercase tracking-tight ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  <button 
                    onClick={() => toggleMenu(item.id)}
                    title={item.label}
                    className={`w-full flex items-center rounded-xl transition-all group ${
                      isCollapsed ? 'justify-center lg:justify-center p-3' : 'gap-3.5 p-3'
                    } ${expandedMenus.includes(item.id) ? 'bg-slate-50/80 border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}`}
                  >
                    <span className="text-slate-400 group-hover:text-slate-900">{item.icon}</span>
                    <span className={`flex-1 text-left text-[11px] font-black uppercase tracking-tight ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    <ChevronDown size={10} className={`text-slate-300 transition-transform ${isCollapsed ? 'lg:hidden' : ''} ${expandedMenus.includes(item.id) ? '' : '-rotate-90'}`} />
                  </button>
                  
                  {(expandedMenus.includes(item.id)) && (
                    <div className={`space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200 ${isCollapsed ? 'lg:hidden' : 'pl-3 border-l-2 border-slate-100 ml-5'}`}>
                      {item.subItems.map(sub => (
                        <button 
                          key={sub.id} 
                          onClick={() => onNavigate(sub.id)}
                          className={`w-full flex items-center gap-3.5 p-2.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all group ${
                            activeView === sub.id ? 'bg-slate-900 text-white shadow-lg shadow-blue-900/10 border border-slate-700' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <span className={`transition-colors ${activeView === sub.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-slate-900'}`}>{sub.icon}</span>
                          <span className="truncate">{sub.label}</span>
                          {activeView === sub.id && <div className="ml-auto w-1 h-1 bg-blue-400 rounded-full"></div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 border-t border-slate-300 bg-white/80 backdrop-blur-md relative z-10 shrink-0 ${isCollapsed ? 'lg:flex lg:flex-col lg:items-center lg:gap-4' : ''}`}>
        <div className={`bg-slate-900 p-4 rounded-xl mb-6 flex items-center gap-4 border border-slate-700 shadow-xl group cursor-pointer transition-all ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-inner border border-blue-500 italic shrink-0">{userInitial}</div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] text-blue-400 font-black uppercase tracking-[0.25em] leading-none mb-1">Active Ledger</span>
            <span className="text-[10px] text-white font-bold truncate uppercase tracking-tighter">{userEmail || 'USUÁRIO'}</span>
          </div>
        </div>
        
        <div className={`grid grid-cols-2 gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <button 
            onClick={() => onNavigate('Configurações')} 
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all border ${activeView === 'Configurações' ? 'bg-slate-900 border-slate-700 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm'}`}
          >
            <Settings size={16} />
            <span className="text-[8px] font-black uppercase tracking-widest">Adjust</span>
          </button>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 rounded-xl transition-all shadow-sm group disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span className="text-[8px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>

        <div className={`hidden ${isCollapsed ? 'lg:flex lg:flex-col lg:items-center lg:gap-4' : ''}`}>
            <button 
              onClick={() => onNavigate('Configurações')}
              title="Configurações"
              className={`p-3 rounded-xl transition-all border ${activeView === 'Configurações' ? 'bg-slate-900 border-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 border-transparent'}`}
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={handleLogout}
              title="Sair"
              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
            >
              <LogOut size={18} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white text-[10px] font-black shadow-md mt-2 italic">{userInitial}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
