
import React from 'react';
import { 
  Trophy, 
  Users, 
  PhoneCall, 
  CalendarDays, 
  Star, 
  User, 
  Sparkles,
  Medal,
  ChevronRight
} from 'lucide-react';

interface RankItem {
  name: string;
  initial: string;
  level: number;
  value: number;
  isWinner?: boolean;
}

const Ranking: React.FC = () => {
  const prospeccoes: RankItem[] = [
    { name: 'Kyros', initial: 'K', level: 1, value: 1, isWinner: true },
    { name: 'Gabriel Dantras', initial: 'GD', level: 1, value: 0 },
  ];

  const reunioes: RankItem[] = [
    { name: 'Gabriel Dantras', initial: 'GD', level: 1, value: 0, isWinner: true },
    { name: 'Kyros', initial: 'K', level: 1, value: 0 },
  ];

  const conversoes: RankItem[] = [
    { name: 'Gabriel Dantras', initial: 'GD', level: 1, value: 0, isWinner: true },
    { name: 'Kyros', initial: 'K', level: 1, value: 0 },
  ];

  const RenderMetricCard = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: RankItem[] }) => (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col space-y-5">
      <div className="flex items-center gap-2 text-blue-600">
        {icon}
        <h3 className="text-base font-bold text-[#1e293b]">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={`relative flex items-center gap-3 p-3 rounded-2xl transition-all ${
              item.isWinner 
                ? 'bg-gradient-to-r from-[#2c1e12] to-[#4d3620] text-white shadow-lg shadow-amber-900/10' 
                : 'bg-gray-50/50 border border-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${item.isWinner ? 'text-amber-400' : 'text-gray-300'}`}>
                {item.isWinner ? <Trophy size={18} /> : <Medal size={18} />}
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${
                item.isWinner ? 'bg-[#432e1a] border-[#5d4037] text-amber-200' : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {item.initial}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${item.isWinner ? 'text-white' : 'text-gray-700'}`}>
                {item.name}
              </p>
              <p className={`text-[10px] font-bold ${item.isWinner ? 'text-amber-400/80' : 'text-gray-400'}`}>
                Lv. {item.level}
              </p>
            </div>

            <div className={`text-xl font-bold ${item.isWinner ? 'text-amber-400' : 'text-gray-400'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 lg:p-10 space-y-10 animate-in fade-in duration-500 pb-24">
      
      {/* Empty Squad State Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
          <Users size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1e293b]">Nenhum squad cadastrado</h3>
          <p className="text-sm text-gray-400 font-medium">
            Crie squads em <span className="text-blue-600 font-bold">Comercial → Squads</span> para ver o ranking por equipe
          </p>
        </div>
      </div>

      {/* Metrics Ranking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RenderMetricCard 
          title="Prospecções" 
          icon={<PhoneCall size={18} />} 
          items={prospeccoes} 
        />
        <RenderMetricCard 
          title="Reuniões Agendadas" 
          icon={<CalendarDays size={18} />} 
          items={reunioes} 
        />
        <RenderMetricCard 
          title="Conversões" 
          icon={<Trophy size={18} />} 
          items={conversoes} 
        />
      </div>

      {/* Individual Statistics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-blue-600">
          <User size={18} />
          <h3 className="text-base font-bold text-[#1e293b]">Estatísticas Individuais</h3>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative group overflow-hidden">
          <div className="flex items-center gap-8">
            {/* Large Avatar with Badge */}
            <div className="relative">
              <div className="w-24 h-24 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-2xl font-black text-gray-900 shadow-inner">
                K
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                1
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-[#1e293b]">Kyros</h4>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs uppercase tracking-wider">Novato (Nível 1)</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">XP</span>
                  <span className="text-xs font-bold text-gray-900">1 / 500</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full w-[0.2%] bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI / Sparkle Feature Button Overlay Area */}
          <div className="absolute bottom-6 right-6">
             <button className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-blue-100 transition-all active:scale-95">
               <Sparkles size={22} className="fill-blue-600/10" />
             </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Ranking;
