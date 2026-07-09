'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { aiService } from '@/services/aiService';
import { toast } from 'react-toastify';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your TeamCore AI Assistant. I can help you analyze team reports, identify blockers, or generate weekly summaries. What would you like to know today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedPrompts = [
    'Generate weekly team summary',
    'Identify current open blockers',
    'Analyze workload distribution',
  ];

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.askQuestion(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: response.data.answer }
      ]);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'I encountered an error connecting to the AI provider.';
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: errorMessage }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (user?.role !== 'manager') {
    return (
      <DashboardLayout activePage="/ai-assistant" activeTab="AI Assistant">
        <div className="p-xl text-center text-secondary font-body-lg">Access Denied: Managers only.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="/ai-assistant" activeTab="AI Assistant">
      <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-md border-b border-outline-variant flex items-center gap-sm bg-surface-container-lowest">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>smart_toy</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-primary">TeamCore AI (Beta)</h2>
            <p className="text-[12px] text-secondary">Powered by advanced LLM analytics</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-lg space-y-md bg-surface">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-md rounded-lg text-body-md ${
                msg.sender === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-none' 
                  : 'bg-surface-variant text-on-surface-variant rounded-tl-none border border-outline-variant'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-md rounded-lg bg-surface-variant text-on-surface-variant rounded-tl-none border border-outline-variant flex gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-lg pb-sm flex gap-sm overflow-x-auto">
            {predefinedPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-sm py-xs border border-outline rounded-full text-[12px] text-secondary hover:bg-surface-container hover:text-primary transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-md border-t border-outline-variant bg-surface-container-lowest">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-sm"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to summarize this week's reports..."
              className="flex-1 h-12 border border-outline-variant rounded-full px-lg bg-surface text-on-surface focus:outline-primary focus:border-primary font-body-md"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
