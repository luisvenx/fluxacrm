
import React, { useState } from 'react';
import { X, FileText, ChevronDown, Check, Loader2 } from 'lucide-react';

interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportPDFModal: React.FC<ExportPDFModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState({
    charts: true,
    details: true,
    summary: true
  });

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    // Simulação de geração de PDF
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b]">Exportar Relatório</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Período do Relatório</label>
            <div className="relative">
              <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 text-gray-700 font-medium cursor-pointer">
                <option>Mês Atual (Fevereiro 2026)</option>
                <option>Mês Anterior (Janeiro 2026)</option>
                <option>Últimos 3 Meses</option>
                <option>Ano Completo (2026)</option>
                <option>Personalizado...</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Conteúdo do PDF</label>
            <div className="grid gap-3">
              {[
                { id: 'charts', label: 'Incluir Gráficos de Distribuição' },
                { id: 'details', label: 'Listagem Detalhada de Lançamentos' },
                { id: 'summary', label: 'Resumo Consolidado por Centro' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOptions(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof options] }))}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-gray-50 transition-all text-left group"
                >
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{item.label}</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${options[item.id as keyof typeof options] ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                    {options[item.id as keyof typeof options] && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-10">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-4 bg-[#0047AB] text-white rounded-2xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <FileText size={18} />
                Gerar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPDFModal;
