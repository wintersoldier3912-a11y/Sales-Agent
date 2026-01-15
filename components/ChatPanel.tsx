
import React, { useState, useRef, useEffect } from 'react';
import { Message, Lead } from '../types';

interface ChatPanelProps {
  messages: Message[];
  onIngest: () => void;
  onGenerate: () => void;
  onSendMessage: (msg: string) => void;
  lead: Lead | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onIngest, onGenerate, onSendMessage, lead }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#EDEBE9] bg-[#FAF9F8]">
        <div className="flex items-center space-x-2 text-[#0078D4]">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="font-semibold text-sm">Copilot</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-[#0078D4] text-white rounded-br-none' 
                : msg.role === 'system'
                ? 'bg-[#F3F2F1] text-[#605E5C] border border-[#EDEBE9] italic'
                : 'bg-white border border-[#EDEBE9] text-[#323130] rounded-bl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#EDEBE9] space-y-3">
        {!lead && (
          <button 
            onClick={onIngest}
            className="w-full text-left p-2 rounded border border-[#0078D4] text-[#0078D4] hover:bg-[#F0F6FF] text-xs font-medium transition-colors"
          >
            🎯 Ingest Lead from CRM...
          </button>
        )}
        {lead && (
           <button 
           onClick={onGenerate}
           className="w-full text-left p-2 rounded border border-[#0078D4] text-[#0078D4] hover:bg-[#F0F6FF] text-xs font-medium transition-colors"
         >
           📝 Generate Draft Proposal...
         </button>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot..."
            className="w-full bg-[#FAF9F8] border border-[#D1D0CF] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
          />
          <button type="submit" className="absolute right-2 top-2 text-[#0078D4]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
