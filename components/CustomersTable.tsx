
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomersTable: React.FC = () => {
  const headers = ['CLIENTE', 'FATURADO', 'RECEBIDO', 'EM ABERTO', 'STATUS'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col h-[340px] hover:border-gray-300 transition-all overflow-hidden shadow-sm">
      <div className="p-6">
        <h3 className="text-gray-900 font-bold text-lg">Clientes</h3>
        <p className="text-xs text-gray-400 font-medium">Visão geral por cliente</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-5 px-6 py-3 border-y border-gray-100 bg-gray-50">
          {headers.map((header) => (
            <span key={header} className="text-[10px] font-bold text-gray-400 tracking-widest">
              {header}
            </span>
          ))}
        </div>
        
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <span className="text-sm font-medium text-gray-300 uppercase tracking-widest font-black">Nenhum cliente encontrado</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <button className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:gap-3 transition-all uppercase tracking-widest">
          Ver todos os clientes <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
