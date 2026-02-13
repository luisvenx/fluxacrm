
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Bell, 
  Lock, 
  CreditCard, 
  Building2, 
  Save, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  ExternalLink,
  Slack,
  MessageSquare,
  Calendar,
  Cloud,
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  Briefcase,
  Zap,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsViewProps {
  user: any;
}

type SettingsTab = 'Perfil' | 'Notificações' | 'Segurança' | 'Faturamento' | 'Integrações';

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Perfil');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    document: '',
    email: '',
    currency: 'BRL - Real Brasileiro',
    address: ''
  });

  const fetchSettings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('company_settings').select('*').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      
      if (data) {
        setCompanyData({
          id: data.id,
          name: data.name || '',
          document: data.document || '',
          email: data.email || '',
          currency: data.currency || 'BRL - Real Brasileiro',
          address: data.address || ''
        });
      }
    } catch (err) {
      console.error('Erro settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id, // ISOLAÇÃO
        name: companyData.name,
        document: companyData.document,
        email: companyData.email,
        currency: companyData.currency,
        address: companyData.address
      };

      let error;
      if (companyData.id) {
        const result = await supabase.from('company_settings').update(payload).eq('id', companyData.id).eq('user_id', user.id);
        error = result.error;
      } else {
        const result = await supabase.from('company_settings').insert([payload]);
        error = result.error;
      }

      if (error) throw error;
      alert('Configurações atualizadas com sucesso!');
      fetchSettings();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar no banco.');
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { label: 'Perfil Institucional', id: 'Perfil' as SettingsTab, icon: <Building2 size={18}/> },
    { label: 'Notificações', id: 'Notificações' as SettingsTab, icon: <Bell size={18}/> },
    { label: 'Segurança SQL', id: 'Segurança' as SettingsTab, icon: <Lock size={18}/> },
    { label: 'Faturamento', id: 'Faturamento' as SettingsTab, icon: <CreditCard size={18}/> },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acessando Preferências...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Perfil':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Razão Social / Nome Fantasia</label>
                 <input 
                  type="text" 
                  value={companyData.name} 
                  onChange={e => setCompanyData({...companyData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">CNPJ Institucional</label>
                 <input 
                  type="text" 
                  value={companyData.document} 
                  onChange={e => setCompanyData({...companyData, document: e.target.value})}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Financeiro Master</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={16} />
                    <input 
                      type="email" 
                      value={companyData.email} 
                      onChange={e => setCompanyData({...companyData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all shadow-inner focus:bg-white" 
                    />
                 </div>
              </div>
            </div>
          </div>
        );
      case 'Notificações':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-xs text-slate-400 font-medium">Configure como você deseja receber alertas da sua conta isolada.</p>
            <div className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Alertas de Lançamento</h4>
                </div>
                <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-[#002147] p-8 rounded-[2.5rem] space-y-6 text-white relative overflow-hidden group shadow-xl">
                  <div className="relative z-10 space-y-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl w-fit text-blue-400"><Lock size={20}/></div>
                    <h4 className="text-lg font-bold tracking-tight uppercase">Sua Chave SQL Privada</h4>
                    <p className="text-xs text-white/50 font-medium leading-relaxed">
                      Seus dados são criptografados e acessíveis apenas pela sua chave de sessão.
                    </p>
                  </div>
              </div>
          </div>
        );
      default:
        return <div className="py-24 text-center opacity-30 font-bold uppercase tracking-widest">Em Breve</div>;
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-24 md:pb-20 px-4 md:px-10 pt-6 md:pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Settings size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <Database size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Preferences</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight uppercase italic">Ajustes da Conta</h2>
          </div>
        </div>

        {activeTab === 'Perfil' && !isLoading && (
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl md:rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
           >
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar Preferências
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="flex xl:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
           {menuItems.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center gap-4 p-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap min-w-max xl:min-w-0 ${
                 activeTab === item.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-200'
               }`}
             >
               <span className={activeTab === item.id ? 'text-blue-400' : 'text-slate-300'}>{item.icon}</span>
               <span>{item.label}</span>
             </button>
           ))}
        </div>

        <div className="xl:col-span-3 bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
