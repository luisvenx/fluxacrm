
import React from 'react';
import { Wrench } from 'lucide-react';

interface GenericSectionProps {
  title: string;
  description: string;
}

const GenericSection: React.FC<GenericSectionProps> = ({ title, description }) => {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 text-blue-600 mb-4 animate-pulse shadow-sm">
        <Wrench size={40} />
      </div>
      <h2 className="text-3xl font-black tracking-tight text-gray-900">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed font-medium">
        {description} Esta funcionalidade está sendo preparada para oferecer a melhor experiência de gestão financeira e empresarial.
      </p>
      <div className="flex gap-4 pt-4">
        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
        </div>
      </div>
    </div>
  );
};

export default GenericSection;
