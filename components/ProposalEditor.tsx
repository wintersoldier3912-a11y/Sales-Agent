
import React, { useState, useEffect, useRef } from 'react';
import { ProposalContent, Lead, ApprovalStatus, Version, ProposalTemplate } from '../types';

interface ProposalEditorProps {
  lead: Lead | null;
  proposal: ProposalContent;
  setProposal: React.Dispatch<React.SetStateAction<ProposalContent>>;
  approvalStatus: ApprovalStatus;
  versions: Version[];
  onRestore: (v: Version) => void;
  onAutoSave?: (proposal: ProposalContent, label: string) => void;
  templates: ProposalTemplate[];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (template: ProposalTemplate) => void;
}

const ProposalEditor: React.FC<ProposalEditorProps> = ({ 
  lead, 
  proposal, 
  setProposal, 
  approvalStatus, 
  versions, 
  onRestore,
  onAutoSave,
  templates,
  onSaveTemplate,
  onApplyTemplate
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  
  const lastSavedRef = useRef<string>(JSON.stringify(proposal));
  const debounceTimerRef = useRef<number | null>(null);

  // Auto-save logic for manual edits
  useEffect(() => {
    const currentProposalStr = JSON.stringify(proposal);
    if (currentProposalStr !== lastSavedRef.current) {
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
      
      debounceTimerRef.current = window.setTimeout(() => {
        if (onAutoSave) {
          onAutoSave(proposal, "Manual Revision");
          lastSavedRef.current = JSON.stringify(proposal);
        }
      }, 8000); // 8-second debounce for manual edits
    }
  }, [proposal, onAutoSave]);

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

  const subtotal = calculateSubtotal();
  const roboticArmItem = proposal.pricing.find(i => i.name === 'Robotic Arm');
  const volumeDiscountRate = (roboticArmItem && roboticArmItem.quantity >= 3) ? 5 : 0;
  const volumeDiscountAmount = subtotal * (volumeDiscountRate / 100);
  const manualDiscountAmount = subtotal * (proposal.discount / 100);
  const total = subtotal - volumeDiscountAmount - manualDiscountAmount;

  return (
    <div className="relative">
      {/* Side Tabs for Vertical Access */}
      <div className="absolute -left-12 top-0 flex flex-col space-y-2">
         <button 
           onClick={() => { setShowHistory(!showHistory); setShowTemplateManager(false); }}
           className={`p-2 rounded-l-md shadow-md border border-r-0 border-[#EDEBE9] transition-all flex flex-col items-center space-y-2 z-50 ${showHistory ? 'bg-[#0078D4] text-white' : 'bg-white text-[#605E5C]'}`}
           title="Version History"
         >
           <svg className={`w-5 h-5 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <span className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-wider py-2">History</span>
         </button>

         <button 
           onClick={() => { setShowTemplateManager(!showTemplateManager); setShowHistory(false); }}
           className={`p-2 rounded-l-md shadow-md border border-r-0 border-[#EDEBE9] transition-all flex flex-col items-center space-y-2 z-50 ${showTemplateManager ? 'bg-[#0078D4] text-white' : 'bg-white text-[#605E5C]'}`}
           title="Templates"
         >
           <svg className={`w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
           </svg>
           <span className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-wider py-2">Templates</span>
         </button>
      </div>

      {/* Version History Drawer */}
      {showHistory && (
        <div className="absolute -left-[300px] top-0 w-[280px] bg-white shadow-xl border border-[#EDEBE9] rounded-md p-4 z-40 animate-in slide-in-from-right h-[calc(100vh-140px)] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#F3F2F1] flex-shrink-0">
            <div>
              <h3 className="text-sm font-bold text-[#323130]">Version History</h3>
              <p className="text-[10px] text-[#605E5C]">Track and revert changes</p>
            </div>
            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 p-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin">
            {versions.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-xs italic">No snapshots saved yet</p>
              </div>
            )}
            {versions.map((v) => (
              <div 
                key={v.id} 
                className="p-3 rounded-md bg-[#FAF9F8] border border-[#EDEBE9] hover:border-[#0078D4] hover:bg-white transition-all cursor-pointer group shadow-sm" 
                onClick={() => {
                  onRestore(v);
                  lastSavedRef.current = JSON.stringify(v.proposal);
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    v.label.includes('Approved') ? 'bg-green-100 text-green-700' : 
                    v.label.includes('AI') ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-[#0078D4]'
                  }`}>{v.label}</span>
                  <span className="text-[9px] text-gray-400 font-medium">{v.timestamp.split(',')[1]}</span>
                </div>
                <div className="text-[10px] text-gray-600 truncate mt-1">
                  {v.proposal.executiveSummary.substring(0, 40)}...
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-[9px]">
                  <span className="text-gray-400">{v.timestamp.split(',')[0]}</span>
                  <span className="text-[#0078D4] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase">Restore</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Manager Drawer */}
      {showTemplateManager && (
        <div className="absolute -left-[300px] top-0 w-[280px] bg-white shadow-xl border border-[#EDEBE9] rounded-md p-4 z-40 animate-in slide-in-from-right h-[calc(100vh-140px)] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#F3F2F1] flex-shrink-0">
            <div>
              <h3 className="text-sm font-bold text-[#323130]">Proposal Templates</h3>
              <p className="text-[10px] text-[#605E5C]">Save and load custom layouts</p>
            </div>
            <button onClick={() => setShowTemplateManager(false)} className="text-gray-400 hover:text-gray-600 p-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="mb-6 space-y-2">
            <label className="text-[10px] font-bold text-[#605E5C] uppercase">Save Current as Template</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Template name..."
                className="flex-1 text-xs p-2 border border-[#EDEBE9] rounded outline-none focus:ring-1 focus:ring-[#0078D4]"
              />
              <button 
                onClick={() => { if(newTemplateName) { onSaveTemplate(newTemplateName); setNewTemplateName(''); } }}
                className="bg-[#0078D4] text-white p-2 rounded hover:bg-[#005A9E]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin">
            <label className="text-[10px] font-bold text-[#605E5C] uppercase">Available Templates</label>
            {templates.map((t) => (
              <div 
                key={t.id} 
                className="p-3 rounded-md bg-[#FAF9F8] border border-[#EDEBE9] hover:border-[#0078D4] hover:bg-white transition-all cursor-pointer group shadow-sm flex justify-between items-center" 
                onClick={() => onApplyTemplate(t)}
              >
                <span className="text-xs font-semibold text-[#323130]">{t.name}</span>
                <span className="text-[10px] text-[#0078D4] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase">Apply</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[800px] mx-auto bg-white min-h-[1056px] p-16 editor-paper rounded shadow-sm border border-[#EDEBE9] transition-all duration-300">
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
          <div className="bg-[#FAF9F8] p-4 rounded-md border border-[#EDEBE9]">
            <h3 className="text-xs font-bold text-[#605E5C] uppercase mb-2">Prepared For</h3>
            <p className="font-bold text-[#323130]">{lead.contact}</p>
            <p className="text-[#605E5C]">{lead.company}</p>
            <p className="text-[#605E5C]">{lead.email}</p>
          </div>

          {/* Customizable Sections */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#EDEBE9] pb-2">
               <h2 className="text-lg font-bold text-[#323130]">Executive Summary</h2>
               <div className="flex space-x-2">
                 <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">AI Copilot Enhanced</span>
               </div>
            </div>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 resize-none leading-relaxed min-h-[150px] text-[#323130] outline-none"
              value={proposal.executiveSummary}
              onChange={(e) => handleUpdateField('executiveSummary', e.target.value)}
              placeholder="Enter summary..."
            />
          </div>

          <div>
            <h2 className="text-lg font-bold border-b border-[#EDEBE9] pb-2 mb-4 text-[#323130]">Scope of Work</h2>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 resize-none leading-relaxed min-h-[100px] text-[#323130] outline-none"
              value={proposal.scopeOfWork}
              onChange={(e) => handleUpdateField('scopeOfWork', e.target.value)}
              placeholder="Define scope..."
            />
          </div>

          <div>
            <h2 className="text-lg font-bold border-b border-[#EDEBE9] pb-2 mb-4 text-[#323130]">Deliverables</h2>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 resize-none leading-relaxed min-h-[80px] text-[#323130] outline-none"
              value={proposal.deliverables}
              onChange={(e) => handleUpdateField('deliverables', e.target.value)}
              placeholder="List deliverables..."
            />
          </div>

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
                  <tr key={item.id} className="border-b border-[#F3F2F1] hover:bg-[#FAF9F8] transition-colors">
                    <td className="py-3 font-medium">
                      {item.name}
                      {item.name === 'Robotic Arm' && item.quantity >= 3 && (
                        <span className="ml-2 text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">Volume Reward Applied</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-[#605E5C]">${item.price.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded border border-transparent hover:border-[#EDEBE9] hover:bg-white text-gray-500 transition-all"
                        >-</button>
                        <span className="w-6 text-center font-semibold">{item.quantity}</span>
                        <button 
                           onClick={() => handleQuantityChange(item.id, 1)}
                           className="w-6 h-6 flex items-center justify-center rounded border border-transparent hover:border-[#EDEBE9] hover:bg-white text-gray-500 transition-all"
                        >+</button>
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold text-[#323130]">${(item.price * item.quantity).toLocaleString()}</td>
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
                      <td colSpan={3} className="py-1 text-right font-medium italic">Executive Adjustment ({proposal.discount}%)</td>
                      <td className="py-1 text-right font-medium">-${manualDiscountAmount.toLocaleString()}</td>
                   </tr>
                )}
                <tr className="text-xl font-bold">
                  <td colSpan={3} className="py-6 text-right border-t border-[#EDEBE9]">Estimated Total</td>
                  <td className="py-6 text-right text-[#0078D4] border-t border-[#EDEBE9]">${total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#F3F2F1]">
              <div>
                  <h4 className="text-xs font-bold text-[#605E5C] uppercase mb-2">Project Timeline</h4>
                  <input 
                    className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 text-[#323130] font-medium outline-none"
                    value={proposal.timeline}
                    onChange={(e) => handleUpdateField('timeline', e.target.value)}
                    placeholder="Set timeline..."
                  />
              </div>
              <div>
                  <h4 className="text-xs font-bold text-[#605E5C] uppercase mb-2">Payment Terms</h4>
                  <input 
                    className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#0078D4]/20 rounded p-1 text-[#323130] font-medium outline-none"
                    value={proposal.terms}
                    onChange={(e) => handleUpdateField('terms', e.target.value)}
                    placeholder="Set terms..."
                  />
              </div>
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-[#EDEBE9] text-center">
          <div className="flex items-center justify-center space-x-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="w-6 h-6 bg-[#0078D4] rounded-sm"></div>
            <span className="font-bold tracking-tight text-[#323130]">CONTOSO DYNAMICS</span>
          </div>
        </footer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[30deg] opacity-[0.03] pointer-events-none select-none">
          <span className={`text-[12rem] font-black uppercase border-[20px] p-10 ${
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
