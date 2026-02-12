
import React from 'react';
import { Menu, Tv, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="px-6 py-5 flex items-center justify-between bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-[#1e293b] transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#1e293b] rounded-lg transition-all text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group"
        >
          <Menu size={22} className="group-hover:scale-110 transition-transform" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">Strict Financial Management</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white dark:border-[#111827] rounded-full"></span>
        </button>
        <button className="hidden md:flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#334155] transition-all shadow-sm text-gray-700 dark:text-gray-200">
          <Tv size={14} className="text-blue-600 dark:text-blue-400" />
          <span>Modo TV</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
