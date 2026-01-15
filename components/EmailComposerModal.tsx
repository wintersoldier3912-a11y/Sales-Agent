
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  draft: string;
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ isOpen, onClose, lead, draft }) => {
  const [body, setBody] = useState('');

  useEffect(() => {
    if (draft) setBody(draft);
  }, [draft]);

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[700px] h-[600px] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#FAF9F8] px-4 py-2 border-b border-[#EDEBE9] flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-[#0078D4] rounded flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
             </div>
             <span className="text-xs font-semibold text-[#323130]">New Message</span>
          </div>
          <button onClick={onClose} className="text-[#605E5C] hover:bg-[#EDEBE9] p-1 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Fields */}
        <div className="p-4 space-y-2 border-b border-[#EDEBE9] bg-white">
          <div className="flex items-center text-sm">
            <span className="w-16 text-[#605E5C]">To</span>
            <div className="flex-1 bg-[#F3F2F1] px-2 py-1 rounded flex items-center space-x-2">
               <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-800">RS</div>
               <span className="font-medium">{lead.contact} &lt;{lead.email}&gt;</span>
            </div>
          </div>
          <div className="flex items-center text-sm border-t border-gray-50 pt-2">
            <span className="w-16 text-[#605E5C]">Subject</span>
            <input 
              type="text" 
              defaultValue={`Proposal: ${lead.opportunity}`}
              className="flex-1 outline-none font-medium"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-[#EDEBE9] bg-[#FAF9F8] flex items-center space-x-4">
            <div className="flex space-x-2 border-r border-[#EDEBE9] pr-4">
                <button className="text-xs font-bold hover:bg-[#EDEBE9] px-2 py-1 rounded">B</button>
                <button className="text-xs italic hover:bg-[#EDEBE9] px-2 py-1 rounded">I</button>
                <button className="text-xs underline hover:bg-[#EDEBE9] px-2 py-1 rounded">U</button>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#605E5C] bg-[#DFF6DD] px-2 py-1 rounded border border-[#107C10]/20">
                <svg className="w-4 h-4 text-[#107C10]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l5 5a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                <span>proposal_factory_automation.pdf attached</span>
            </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-full resize-none outline-none text-sm leading-relaxed"
            placeholder="Type your message here..."
          />
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-[#FAF9F8] border-t border-[#EDEBE9] flex items-center space-x-3">
          <button 
            onClick={() => {
                alert('Email sent successfully!');
                onClose();
            }}
            className="bg-[#0078D4] text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-[#005A9E]"
          >
            Send
          </button>
          <button 
            onClick={onClose}
            className="bg-white border border-[#EDEBE9] text-[#323130] px-4 py-2 rounded-sm text-sm font-semibold hover:bg-[#FAF9F8]"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposerModal;
