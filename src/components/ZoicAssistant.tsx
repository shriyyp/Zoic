/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import { askZoic } from '../services/aiChat';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ZoicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Woof! I'm your Zoic Assistant, powered by Gemini. Ask me anything about your pets or wildlife! 🐾" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await askZoic(userMsg, history);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-zoic-green text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-transform"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-0 sm:right-6 sm:w-96 sm:h-[600px] bg-white z-[60] flex flex-col shadow-2xl rounded-t-[32px] sm:rounded-b-none overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zoic-green p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest leading-none">Zoic Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold py-0.5 px-1.5 bg-white/20 rounded text-white/90 uppercase tracking-tighter">Gemini Powered</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-grow p-6 overflow-y-auto space-y-6 bg-zoic-sand-bg/20"
            >
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-zoic-green text-white' : 'bg-white text-zoic-green'}`}>
                      {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-[20px] text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-zoic-green text-white rounded-tr-none' : 'bg-white text-zoic-dark rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                     <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white text-zoic-green shadow-sm">
                      <Bot size={14} />
                    </div>
                    <div className="p-4 rounded-[20px] bg-white text-zoic-dark rounded-tl-none shadow-sm">
                      <Loader2 size={16} className="animate-spin text-zoic-green/40" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-white border-t border-zoic-sand-bg">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Powered by Gemini..."
                  className="w-full pl-6 pr-14 py-4 bg-zoic-sand-bg rounded-[20px] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zoic-green transition-all placeholder:text-zoic-dark/30"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 w-10 h-10 bg-zoic-green text-white rounded-[14px] flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
