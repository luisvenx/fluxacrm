
import React from 'react';
import { X, Upload, ChevronDown, Info, FileText } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-8 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Importar Extrato</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-2 space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Importe seus lançamentos automaticamente através de arquivos <strong>OFX</strong>, <strong>CSV</strong> ou <strong>XLSX</strong> exportados do seu banco.
            </p>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Vincular à Conta Bancária</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 font-medium text-gray-700 cursor-pointer">
                  <option>Selecione uma conta</option>
                  <option>Itaú Unibanco - Principal</option>
                  <option>Nubank - Reserva</option>
                  <option>Banco do Brasil - Tributos</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="border-2 border-dashed border-blue-100 bg-blue-50/20 rounded-[24px] p-10 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-blue-50/40 transition-all border-spacing-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">Arraste seu arquivo aqui</p>
                <p className="text-xs text-gray-400">ou clique para procurar em seu computador</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
              <Info size={16} className="text-orange-400 mt-0.5" />
              <p className="text-[11px] text-orange-700 font-medium leading-relaxed">
                Certifique-se de que o arquivo contém as colunas de Data, Descrição e Valor para uma importação precisa.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              className="px-8 py-3 bg-[#1147b1] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              Iniciar Importação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
