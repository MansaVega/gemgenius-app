
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Bonjour ! Je suis l\'assistant IA d\'IDRIS. Comment puis-je vous aider avec votre inventaire aujourd\'hui ?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMsg.text, history);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Désolé, une erreur technique est survenue.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-stone-100 rounded-lg border border-stone-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-neutral-900 p-4 border-b border-neutral-800 flex items-center gap-3">
        <Bot className="text-[#e6dac3]" />
        <h3 className="font-serif text-[#e6dac3] tracking-wider">IDRIS Assistant</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent bg-[#FDFCF8]">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              msg.role === 'user' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-[#e6dac3] text-neutral-900 border-[#d4c5a5]'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] px-5 py-3 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-neutral-900 text-stone-100 rounded-l-xl rounded-tr-xl' 
                : 'bg-white text-stone-800 border border-stone-200 rounded-r-xl rounded-tl-xl'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-stone-400 text-sm p-2 pl-12">
            <Loader2 className="animate-spin text-[#e6dac3]" size={16} />
            <span className="font-light italic">Analyse en cours...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-stone-50 border border-stone-300 text-stone-900 rounded-md px-4 py-3 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all placeholder-stone-400 font-light"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-neutral-900 hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 text-[#e6dac3] px-6 rounded-md transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
