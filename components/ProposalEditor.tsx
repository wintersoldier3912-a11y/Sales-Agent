
import React, { useState } from 'react';
import { ProposalContent, Lead, ApprovalStatus, Version } from '../types';

interface ProposalEditorProps {
  lead: Lead | null;
  proposal: ProposalContent;
  setProposal: React.Dispatch<React.SetStateAction<ProposalContent>>;
  approvalStatus: ApprovalStatus;
  versions: Version[];
  onRestore: (v: Version) => void;
}

const ProposalEditor: React.FC<ProposalEditorProps> = ({ lead, proposal, setProposal, approvalStatus, versions, onRestore }) => {
  const [showHistory, setShowHistory] = useState(false);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#605E5C] space-y-4">
        <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">No Lead Selected</p>
        <p className="text-sm">Please ingest a lead from CRM via Copilot to start.</p>
      </div>
    );
  }

  const handleUpdateField = (field: keyof ProposalContent, value: string) => {
    setProposal(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setProposal(prev => ({
      ...prev,
      pricing: prev.pricing.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    }));
  };

  const calculateSubtotal = () => {
    return proposal.pricing.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // Logic: 5% volume discount for 3+ robotic arms
  const roboticArmItem = proposal.pricing.find(i => i.name === 'Robotic Arm');
  const volumeDiscountRate = (roboticArmItem && roboticArmItem.quantity >= 3) ? 5 : 0;
  
  const subtotal = calculateSubtotal();
  const volumeDiscountAmount = subtotal * (volumeDiscountRate / 100);
  const manualDiscountAmount = subtotal * (proposal.discount / 100);
  const total = subtotal - volumeDiscountAmount - manualDiscountAmount;

  return (
    <div className="relative">
      {/* Version History Sidebar Toggle */}
      <div className="absolute -left-12 top-0 h-full">
         <button 
           onClick={() => setShowHistory(!showHistory)}
           className={`p-2 rounded-l-md shadow-md border border-r-0 border-[#EDEBE9] bg-white text-[#605E5C] hover:text-[#0078D4] transition-all flex flex-col items-center space-y-2 ${showHistory ? 'translate-x-0' : 'translate-x-0'}`}
           title="Version History"
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <span className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-wider py-2">History</span>
         </button>
      </div>

      {/* Version History List */}
      {showHistory && (
        <div className="absolute -left-[280px] top-0 w-[260px] bg-white shadow-xl border border-[#EDEBE9] rounded-md p-4 z-40 animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#F3F2F1]">
            <h3 className="text-sm font-bold">Version History</h3>
            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {versions.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4">No snapshots yet</p>}
            {versions.map((v) => (
              <div key={v.id} className="p-3 rounded-md bg-[#FAF9F8] border border-[#EDEBE9] hover:border-[#0078D4] transition-all cursor-pointer group" onClick={() => onRestore(v)}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-[#0078D4]">{v.label}</span>
                  <span className="text-[10px] text-gray-400">{v.timestamp.split(',')[1]}</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">{v.timestamp.split(',')[0]}</p>
                <button className="text-[10px] text-[#0078D4] font-bold opacity-0 group-hover:opacity-100 uppercase transition-opacity">Restore</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[800px] mx-auto bg-white min-h-[1056px] p-16 editor-paper rounded shadow-sm border border-[#EDEBE9]">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#323130] mb-2 uppercase tracking-tight">Proposal</h1>
            <p className="text-[#0078D4] font-semibold">{lead.opportunity}</p>
          </div>
          <div className="text-right text-xs text-[#605E5C] uppercase tracking-widest font-bold">
            <p>Confidential</p>
            <p className="text-[#A19F9D] mt-1">{new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <section className="space-y-8 text-sm">
          {/* Client Info */}
          <div className="bg-[#FAF9F8] p-4 rounded-md border border-[#EDEBE9]">
            <h3 className="text-xs font-bold text-[#605E5C] uppercase mb-2">Prepared For</h3>
            <p className="font-bold text-[#323130]">{lead.contact}</p>
            <p className="text-[#605E5C]">{lead.company}</p>
            <p className="text-[#605E5C]">{lead.email}</p>
          </div>

          {/* Executive Summary */}
          <div>
            <div className="flex items-center space-x-2 mb-4 border-b border-[#EDEBE9] pb-2">
               <h2 className="text-lg font-bold text-[#323130]">Executive Summary</h2>
               <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">AI Generated</span>
            </div>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 resize-none leading-relaxed min-h-[150px]"
              value={proposal.executiveSummary}
              onChange={(e) => handleUpdateField('executiveSummary', e.target.value)}
            />
          </div>

          {/* Scope of Work */}
          <div>
            <h2 className="text-lg font-bold border-b border-[#EDEBE9] pb-2 mb-4 text-[#323130]">Scope of Work</h2>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 resize-none leading-relaxed min-h-[100px]"
              value={proposal.scopeOfWork}
              onChange={(e) => handleUpdateField('scopeOfWork', e.target.value)}
            />
          </div>

          {/* Pricing Table */}
          <div>
            <h2 className="text-lg font-bold border-b border-[#EDEBE9] pb-2 mb-4 text-[#323130]">Pricing & Payment</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-[#605E5C] uppercase border-b border-[#EDEBE9]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {proposal.pricing.map((item) => (
                  <tr key={item.id} className="border-b border-[#F3F2F1] hover:bg-[#FAF9F8]">
                    <td className="py-3 font-medium">
                      {item.name}
                      {item.name === 'Robotic Arm' && item.quantity >= 3 && (
                        <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">Volume Discount Applied</span>
                      )}
                    </td>
                    <td className="py-3 text-right">${item.price.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
                        >-</button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button 
                           onClick={() => handleQuantityChange(item.id, 1)}
                           className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
                        >+</button>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium">${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-4 text-right text-[#605E5C] font-medium">Subtotal</td>
                  <td className="py-4 text-right font-medium">${subtotal.toLocaleString()}</td>
                </tr>
                {volumeDiscountRate > 0 && (
                  <tr className="text-green-600">
                    <td colSpan={3} className="py-1 text-right font-medium italic">Volume Discount ({volumeDiscountRate}%)</td>
                    <td className="py-1 text-right font-medium">-${volumeDiscountAmount.toLocaleString()}</td>
                  </tr>
                )}
                {proposal.discount > 0 && (
                   <tr className="text-[#0078D4]">
                      <td colSpan={3} className="py-1 text-right font-medium italic">Manager Approved Discount ({proposal.discount}%)</td>
                      <td className="py-1 text-right font-medium">-${manualDiscountAmount.toLocaleString()}</td>
                   </tr>
                )}
                <tr className="text-lg font-bold">
                  <td colSpan={3} className="py-4 text-right border-t border-[#EDEBE9]">Estimated Total</td>
                  <td className="py-4 text-right text-[#0078D4] border-t border-[#EDEBE9]">${total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                  <h4 className="text-xs font-bold text-[#605E5C] uppercase mb-2">Project Timeline</h4>
                  <p className="text-[#323130]">{proposal.timeline}</p>
              </div>
              <div>
                  <h4 className="text-xs font-bold text-[#605E5C] uppercase mb-2">Payment Terms</h4>
                  <p className="text-[#323130]">{proposal.terms}</p>
              </div>
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-[#EDEBE9] text-center">
          <div className="flex items-center justify-center space-x-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="w-6 h-6 bg-[#0078D4] rounded-sm"></div>
            <span className="font-bold tracking-tight text-[#323130]">CONTOSO DYNAMICS</span>
          </div>
        </footer>

        <div className="absolute top-8 right-8 rotate-12 opacity-10 pointer-events-none select-none">
          <span className={`text-6xl font-black uppercase border-8 p-4 ${
            approvalStatus === ApprovalStatus.APPROVED ? 'border-green-600 text-green-600' :
            approvalStatus === ApprovalStatus.PENDING ? 'border-yellow-600 text-yellow-600' :
            'border-gray-400 text-gray-400'
          }`}>
            {approvalStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;
