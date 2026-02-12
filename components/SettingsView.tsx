import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

type SettingsTab = 'Perfil' | 'Notificações' | 'Segurança' | 'Faturamento' | 'Integrações';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Perfil');

  const menuItems = [
    { label: 'Perfil da Empresa', id: 'Perfil' as SettingsTab, icon: <Building2 size={18}/> },
    { label: 'Notificações', id: 'Notificações' as SettingsTab, icon: <Bell size={18}/> },
    { label: 'Segurança', id: 'Segurança' as SettingsTab, icon: <Lock size={18}/> },
    { label: 'Faturamento', id: 'Faturamento' as SettingsTab, icon: <CreditCard size={18}/> },
    { label: 'Integrações', id: 'Integrações' as SettingsTab, icon: <Globe size={18}/> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Perfil':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Razão Social</label>
                 <input type="text" defaultValue="Fluxa Management LTDA" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">CNPJ</label>
                 <input type="text" defaultValue="00.000.000/0001-00" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">E-mail Financeiro</label>
                 <input type="email" defaultValue="financeiro@fluxa.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Moeda Padrão</label>
                 <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none">
                    <option>BRL - Real Brasileiro</option>
                    <option>USD - Dólar Americano</option>
                 </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Endereço Fiscal</label>
                 <input type="text" placeholder="Av. Paulista, 1000 - São Paulo, SP" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>
        );
      case 'Notificações':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
              {[
                { title: 'Lançamentos Financeiros', desc: 'Receba alertas sobre novas entradas e saídas pendentes.', channels: ['E-mail', 'Push'] },
                { title: 'Relatórios Mensais', desc: 'Avisar quando o DRE e DFC do mês anterior estiverem consolidados.', channels: ['E-mail'] },
                { title: 'Novos Leads', desc: 'Notificar responsáveis quando um novo lead entrar no pipeline.', channels: ['Push', 'WhatsApp'] },
                { title: 'Segurança da Conta', desc: 'Alertas de logins em novos dispositivos ou tentativas falhas.', channels: ['E-mail', 'Push', 'SMS'] },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100 rounded-2xl group hover:border-blue-200 transition-all">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.channels.map(channel => (
                      <span key={channel} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm">
                        {channel}
                      </span>
                    ))}
                    <button className="w-10 h-5 bg-blue-600 rounded-full relative ml-2">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Segurança':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <ShieldCheck size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Alterar Senha</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Senha Atual</label>
                    <input type="password" underline-none className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nova Senha</label>
                    <input type="password" underline-none className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Esqueci minha senha</button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <Smartphone size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Autenticação em 2 Etapas</h3>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl space-y-4">
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Adicione uma camada extra de proteção à sua conta. Use um app autenticador para gerar códigos de acesso.
                  </p>
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                    Configurar 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Faturamento':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <CreditCard size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <span className="px-3 py-1 bg-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">Plano Pro</span>
                    <h3 className="text-3xl font-black mt-2 tracking-tight">R$ 297,00<span className="text-sm font-normal text-white/40">/mês</span></h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/60 font-medium">Próxima cobrança em 12 de Março, 2026</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-blue-500"></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-white text-gray-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Alterar Plano</button>
                    <button className="bg-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">Cancelar</button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Método de Pagamento</h4>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center">
                      <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">•••• 4412</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Visa - Exp. 12/28</p>
                    </div>
                  </div>
                </div>
                <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                  <Plus size={14} /> Atualizar Cartão
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Histórico de Faturas</h4>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600">Ver Todas</button>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-50">
                  {[
                    { date: '12 Fev, 2026', val: 'R$ 297,00', status: 'Pago' },
                    { date: '12 Jan, 2026', val: 'R$ 297,00', status: 'Pago' },
                    { date: '12 Dez, 2025', val: 'R$ 297,00', status: 'Pago' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-700">{row.date}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-900">{row.val}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-md tracking-widest">{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-gray-300 hover:text-blue-600 transition-colors"><ExternalLink size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Integrações':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { name: 'Slack', desc: 'Receba alertas financeiros diretamente em canais do Slack.', icon: <Slack size={24} />, connected: true, color: 'text-purple-600 bg-purple-50' },
                { name: 'WhatsApp', desc: 'Notificações de leads e cobranças via API oficial.', icon: <MessageSquare size={24} />, connected: false, color: 'text-emerald-500 bg-emerald-50' },
                { name: 'Google Calendar', desc: 'Sincronize sua agenda de reuniões e follow-ups.', icon: <Calendar size={24} />, connected: false, color: 'text-blue-500 bg-blue-50' },
                { name: 'Conta Azul', desc: 'Integração de notas fiscais e conciliação bancária.', icon: <Cloud size={24} />, connected: false, color: 'text-cyan-500 bg-cyan-50' },
                { name: 'Asaas', desc: 'Geração automática de boletos e links de pagamento.', icon: <CreditCard size={24} />, connected: true, color: 'text-blue-600 bg-blue-50' },
              ].map((app, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${app.color}`}>
                        {app.icon}
                      </div>
                      {app.connected ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          <CheckCircle2 size={12} /> Conectado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300">
                          Desconectado
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{app.name}</h4>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">{app.desc}</p>
                    </div>
                  </div>
                  <button className={`mt-6 w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${app.connected ? 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500' : 'bg-[#0047AB] text-white hover:bg-blue-800'}`}>
                    {app.connected ? 'Desconectar' : 'Conectar Agora'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Configurações</h2>
          <p className="text-sm font-medium text-gray-400">Personalize sua experiência no Fluxa</p>
        </div>
        {activeTab !== 'Integrações' && (
           <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 self-start md:self-center active:scale-95">
             <Save size={18} /> Salvar Alterações
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="space-y-1.5">
           {menuItems.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all border ${
                 activeTab === item.id 
                  ? 'bg-white text-blue-600 border-blue-100 shadow-md shadow-blue-500/5' 
                  : 'text-gray-400 border-transparent hover:bg-white hover:text-gray-900 hover:border-gray-100'
               }`}
             >
               <span className={activeTab === item.id ? 'text-blue-600' : 'text-gray-300'}>
                 {item.icon}
               </span>
               <span>{item.label}</span>
               {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
             </button>
           ))}
        </div>

        {/* Dynamic Content Card */}
        <div className="xl:col-span-3 bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
           {/* Background subtle decoration */}
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Settings size={200} />
           </div>
           
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-10 border-b border-gray-50 pb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  {menuItems.find(m => m.id === activeTab)?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{menuItems.find(m => m.id === activeTab)?.label}</h3>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Painel de Controle / Preferências</p>
                </div>
             </div>
             
             {renderContent()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;