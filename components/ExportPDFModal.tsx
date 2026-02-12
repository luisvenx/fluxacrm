import React, { useState } from 'react';
import { X, FileText, ChevronDown, Check, Loader2, Download, FileSpreadsheet, File } from 'lucide-react';

interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportPDFModal: React.FC<ExportPDFModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'xlsx'>('pdf');
  const [options, setOptions] = useState({
    charts: true,
    details: true,
    summary: true
  });

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[550px] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Download size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Exportar Relatórios</h2>
              <p className="text-xs text-slate-400 font-medium">Gere documentos analíticos e auditáveis</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-8">
          {/* Interval Selection */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">Período de Consolidação</h3>
            <div className="relative group">
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all cursor-pointer">
                <option>Relatório Mensal (Fev/2026)</option>
                <option>Trimestre Consolidado (Q1)</option>
                <option>Relatório Anual (FY 2026)</option>
                <option>Personalizado...</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-600" size={18} />
            </div>
          </div>

          {/* Module Selection */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">Módulos Inclusos</h3>
            <div className="grid gap-3">
              {[
                { id: 'charts', label: 'Matriz de Fluxo de Caixa (Gráficos)' },
                { id: 'details', label: 'Journal de Lançamentos Analítico' },
                { id: 'summary', label: 'EBITDA & DRE Consolidado' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOptions(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof options] }))}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                    options[item.id as keyof typeof options] 
                      ? 'border-rose-100 bg-rose-50/30' 
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-semibold ${options[item.id as keyof typeof options] ? 'text-rose-700' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    options[item.id as keyof typeof options] ? 'bg-rose-500 border-rose-500 scale-110 shadow-sm' : 'bg-white border-slate-200'
                  }`}>
                    {options[item.id as keyof typeof options] && <Check size={10} className="text-white" strokeWidth={4} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">Formato do Arquivo</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => setFormat('pdf')}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${
                  format === 'pdf' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <File size={16} /> PDF Profissional
              </button>
              <button 
                onClick={() => setFormat('xlsx')}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${
                  format === 'xlsx' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet size={16} /> XLSX Auditoria
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleExport}
              disabled={isExporting}
              className={`flex-1 py-4 text-white rounded-full text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 ${
                format === 'pdf' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Gernado Arquivo...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Baixar Relatório
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPDFModal;