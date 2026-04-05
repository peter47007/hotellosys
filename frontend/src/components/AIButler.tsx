// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\components\AIButler.tsx

import React, { useState, useRef, useEffect } from 'react';
import { chatWithButler } from '../services/gemini.service';

interface AIButlerProps {
  context: any;
}

const AIButler: React.FC<AIButlerProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Good day. How may I assist with hotel operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await chatWithButler(userMsg, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', text: response || "I'm not sure about that." }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-robot text-sm"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm">Hotello Butler</h4>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-400">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about occupancy, stock..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-blue-600 hover:scale-110'}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-50 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default AIButler;