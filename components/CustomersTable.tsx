
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomersTable: React.FC = () => {
  const headers = ['CLIENTE', 'FATURADO', 'EM ABERTO', 'STATUS'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[500px] shadow-sm group transition-all overflow-hidden">
      <div className="p-8 pb-6 border-b border-slate-50">
        <h3 className="text-slate-900 font-bold text-base tracking-tight uppercase italic">Monitoramento de <span className="text-[#01223d] not-italic">Clientes</span></h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resumo de Liquidez por Conta</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-4 px-8 py-4 border-b border-slate-100 bg-slate-50/30">
          {headers.map((header) => (
            <span key={header} className={`text-[9px] font-black text-slate-400 tracking-[0.15em] ${header === 'EM ABERTO' || header === 'STATUS' ? 'text-right' : ''}`}>
              {header}
            </span>
          ))}
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/10">
          <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">Nenhum dado consolidado</span>
        </div>
      </div>

      <div className="p-6 border-t border-slate-50 bg-white">
        <button className="flex items-center gap-2 text-[#01223d] text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all group/btn">
          Gestão de Carteira <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-[#b4a183]" />
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
