
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NewKanbanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewKanbanModal: React.FC<NewKanbanModalProps> = ({ isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState('#5c6cf2');

  const colors = [
    '#5c6cf2', // Blue (Selected in image)
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#3b82f6', // Sky Blue
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[480px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-[#1e293b]">Novo Kanban</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Nome *</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: Conteúdo LinkedIn"
                className="w-full bg-white border-2 border-blue-600 rounded-[14px] py-3.5 px-4 text-[14px] focus:outline-none text-gray-700 font-medium shadow-sm shadow-blue-500/10 transition-all placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#1e293b]">Descrição</label>
            <textarea 
              rows={4}
              placeholder="Descrição do kanban..."
              className="w-full bg-white border border-[#e2e8f0] rounded-[14px] py-3.5 px-4 text-[14px] focus:outline-none focus:border-blue-400 text-gray-700 transition-all resize-none placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Cor */}
          <div className="space-y-4">
            <label className="text-[14px] font-semibold text-[#1e293b]">Cor</label>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full transition-all relative flex items-center justify-center ${
                    selectedColor === color 
                    ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-lg' 
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-7 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="px-9 py-3.5 bg-[#8ca1db] text-white rounded-[14px] text-[14px] font-bold hover:bg-[#7a8ec9] transition-all shadow-md shadow-blue-200/50 active:scale-95"
            >
              Criar Kanban
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewKanbanModal;
