
import React from 'react';
import { Settings, Globe, Bell, Lock, CreditCard, Building2, Save } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Configurações</h2>
        <p className="text-sm font-medium text-gray-400">Personalize sua experiência no Strict</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="space-y-2">
           {[
             { label: 'Perfil da Empresa', icon: <Building2 size={18}/>, active: true },
             { label: 'Notificações', icon: <Bell size={18}/> },
             { label: 'Segurança', icon: <Lock size={18}/> },
             { label: 'Faturamento', icon: <CreditCard size={18}/> },
             { label: 'Integrações', icon: <Globe size={18}/> },
           ].map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${item.active ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200'}`}>
               {item.icon}
               <span>{item.label}</span>
             </button>
           ))}
        </div>

        <div className="xl:col-span-3 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Razão Social</label>
                 <input type="text" defaultValue="Strict Management LTDA" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">CNPJ</label>
                 <input type="text" defaultValue="00.000.000/0001-00" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">E-mail Financeiro</label>
                 <input type="email" defaultValue="financeiro@strict.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Moeda Padrão</label>
                 <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none">
                    <option>BRL - Real Brasileiro</option>
                    <option>USD - Dólar Americano</option>
                 </select>
              </div>
           </div>

           <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 transition-all">Descartar</button>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2">
                <Save size={18} /> Salvar Alterações
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
