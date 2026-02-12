
import React from 'react';
import { X, Upload, ChevronDown, Info, FileText } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Upload size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Importar Extrato</h2>
              <p className="text-xs text-slate-400 font-medium">Automatize seus lançamentos bancários</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Importe arquivos <span className="text-slate-900 font-bold">OFX, CSV ou XLSX</span> para sincronizar seus movimentos bancários sem digitação manual.
          </p>

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">Vincular à Conta de Destino</h3>
            <div className="relative group">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                <option>Selecione uma conta bancária</option>
                <option>Itaú Unibanco - Principal</option>
                <option>Nubank - Digital</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-600" size={18} />
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-blue-100 bg-blue-50/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-blue-50/40 transition-all">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">Arraste seu arquivo aqui</p>
              <p className="text-xs text-slate-400 font-medium">Formatos suportados: OFX, CSV, Excel</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
            <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
              O sistema tentará categorizar automaticamente seus lançamentos baseando-se no histórico anterior.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-4 pb-8">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              className="flex-1 py-4 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Processar Arquivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
