
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, Maximize2, Minimize2, Terminal, Copy, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o **Fluxa AI Agent**. \n\nEstou pronto para te ajudar com:\n* **Análises Financeiras** (DRE, EBITDA)\n* **Gestão de Imóveis** e Ativos\n* **Conversão de Leads** e Pipeline\n\nComo posso acelerar seus resultados hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Função para renderizar texto formatado (Markdown Simples)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, i) => {
      // Listas com marcadores
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <li key={i} className="ml-4 list-disc mb-1 pl-1">
            {parseBold(content)}
          </li>
        );
      }
      
      // Parágrafos normais ou linhas vazias
      return (
        <p key={i} className={line.trim() === '' ? 'h-3' : 'mb-2 last:mb-0'}>
          {parseBold(line)}
        </p>
      );
    });
  };

  // Auxiliar para processar negritos **texto**
  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = 'gemini-3-flash-preview';
      
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `Você é o "Fluxa AI Agent", um assistente de inteligência artificial ultra-sofisticado da plataforma Fluxa Imob.
          
          DIRETRIZES DE FORMATAÇÃO:
          1. Use sempre **negrito** para termos técnicos, valores monetários ou métricas (ex: **R$ 50.000,00**, **EBITDA**, **CAC**).
          2. Use listas com '*' para tópicos ou planos de ação.
          3. Use quebras de linha duplas para separar parágrafos.
          4. Se for apresentar números, prefira o formato: "Métrica: **Valor**".
          5. Mantenha um tom executivo, focado em dados e lucratividade.
          
          CONTEXTO: Você opera no mercado imobiliário brasileiro e entende de corretagem, administração de aluguéis e finanças corporativas.`,
          temperature: 0.4,
        },
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const last = [...prev];
            last[last.length - 1] = { role: 'model', text: fullText };
            return last;
          });
        }
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, houve um erro na comunicação com a **Engine Gemini**. Verifique sua conexão e tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#203267] text-white rounded-full shadow-[0_20px_50px_rgba(32,50,103,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group"
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-bounce border-2 border-white">AI</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-in-out ${isMinimized ? 'h-20 w-80' : 'h-[650px] w-[450px]'} flex flex-col bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden`}>
      {/* Header */}
      <div className="bg-[#203267] p-6 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <Bot size={22} className="text-indigo-200" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.1em]">Fluxa Intelligence</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Active SQL Agent</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors">
            {isMinimized ? <Maximize2 size={16}/> : <Minimize2 size={16}/>}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Interface */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`flex gap-4 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border-2 transition-transform hover:scale-110 ${m.role === 'user' ? 'bg-white border-slate-200 text-slate-400 shadow-sm' : 'bg-indigo-50 border-indigo-100 text-[#203267] shadow-sm'}`}>
                    {m.role === 'user' ? <User size={16}/> : <Sparkles size={16}/>}
                  </div>
                  <div className="space-y-2 group">
                    <div className={`p-5 rounded-3xl text-[13px] font-medium leading-[1.6] shadow-sm relative ${
                      m.role === 'user' 
                        ? 'bg-[#203267] text-white rounded-tr-none' 
                        : 'bg-white text-slate-600 border border-slate-100 rounded-tl-none prose prose-slate max-w-none'
                    }`}>
                      {m.text ? renderFormattedText(m.text) : (
                        <div className="flex gap-1.5 py-1">
                          <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-duration:800ms]"></span>
                          <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:200ms]"></span>
                          <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:400ms]"></span>
                        </div>
                      )}
                    </div>
                    {m.role === 'model' && m.text && (
                      <button 
                        onClick={() => handleCopy(m.text, i)}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-[#203267] transition-all ml-1"
                      >
                        {copiedIndex === i ? <><Check size={10} className="text-emerald-500"/> Copiado</> : <><Copy size={10}/> Copiar resposta</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-6 bg-white border-t border-slate-100 shrink-0">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Analise meu faturamento deste mês..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.75rem] py-5 pl-6 pr-16 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#203267] focus:bg-white transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#203267] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-20 disabled:grayscale disabled:scale-90 active:scale-95 shadow-xl shadow-indigo-900/20"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 px-2">
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                  <Terminal size={12} className="text-slate-200" />
                  Gemini Flash 3.0 Realtime
               </div>
               <span className="text-[9px] font-bold text-slate-400 uppercase opacity-50">Shift + Enter para quebra</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatAssistant;
