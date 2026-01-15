
import React, { useState } from 'react';
import { UserRole, ApprovalStatus, ApprovalRequest } from '../types';

interface ApprovalPanelProps {
  role: UserRole;
  approval: ApprovalRequest | null;
  onAction: (status: ApprovalStatus, note: string) => void;
  onRequest: (note: string, requestedDiscount?: number) => void;
  canFinalize: boolean;
  onComposeEmail: () => void;
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ role, approval, onAction, onRequest, canFinalize, onComposeEmail }) => {
  const [requestNote, setRequestNote] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [discountValue, setDiscountValue] = useState<number>(0);

  const getStatusBadge = (status: ApprovalStatus) => {
    const colors = {
      [ApprovalStatus.DRAFT]: 'bg-[#F3F2F1] text-[#605E5C]',
      [ApprovalStatus.PENDING]: 'bg-[#FFF4CE] text-[#323130]',
      [ApprovalStatus.APPROVED]: 'bg-[#DFF6DD] text-[#107C10]',
      [ApprovalStatus.REJECTED]: 'bg-[#FDE7E9] text-[#A4262C]',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[status]}`}>{status}</span>;
  };

  const handleExport = (type: 'PDF' | 'DOCX') => {
    // In a real app, this would use libraries like jspdf or docx.js
    // For this prototype, we simulate the download trigger.
    const filename = `Proposal_Automation_${new Date().getTime()}.${type.toLowerCase()}`;
    alert(`Generating ${type} export...\nFile "${filename}" has been prepared for download.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b border-[#EDEBE9]">
        <svg className="w-5 h-5 text-[#0078D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-sm">Approval Workflow</h3>
      </div>

      {!approval && role === UserRole.SALES_REP && (
        <div className="space-y-4">
          <p className="text-xs text-[#605E5C]">Submit your proposal for manager review.</p>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#605E5C] uppercase">Manual Discount Request (%)</label>
            <div className="flex items-center space-x-2">
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={discountValue} 
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="flex-1 accent-[#0078D4]"
              />
              <span className="text-xs font-bold w-8">{discountValue}%</span>
            </div>
            <p className="text-[10px] text-gray-400">Max allowed: 15%</p>
          </div>

          <textarea 
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            placeholder="Reason for discount / revision..."
            className="w-full text-xs p-2 border border-[#EDEBE9] rounded-sm h-20 outline-none focus:ring-1 focus:ring-[#0078D4]"
          />
          <button 
            onClick={() => onRequest(requestNote, discountValue > 0 ? discountValue : undefined)}
            className="w-full bg-[#0078D4] text-white py-2 rounded text-xs font-semibold hover:bg-[#005A9E] transition-colors"
          >
            Submit for Approval
          </button>
        </div>
      )}

      {approval && (
        <div className="p-4 bg-[#FAF9F8] rounded border border-[#EDEBE9] space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#605E5C]">Status</span>
            {getStatusBadge(approval.status)}
          </div>
          
          {approval.requestedDiscount && (
             <div className="flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-100">
                <span className="text-[10px] font-bold text-[#0078D4] uppercase">Requested Discount</span>
                <span className="text-xs font-bold text-[#0078D4]">{approval.requestedDiscount}%</span>
             </div>
          )}

          <div className="text-[10px] text-[#A19F9D]">
            Requested by {approval.requester} at {approval.timestamp}
          </div>

          <div className="text-xs italic bg-white p-2 rounded border border-[#EDEBE9]">
            "{approval.note}"
          </div>

          {role === UserRole.MANAGER && approval.status === ApprovalStatus.PENDING && (
            <div className="space-y-3 pt-2">
              <input 
                type="text" 
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Manager comments..."
                className="w-full text-xs p-2 border border-[#EDEBE9] rounded-sm outline-none"
              />
              <div className="flex space-x-2">
                <button 
                  onClick={() => onAction(ApprovalStatus.APPROVED, actionNote)}
                  className="flex-1 bg-[#107C10] text-white py-2 rounded text-xs font-bold hover:bg-[#0B590B]"
                >
                  Approve
                </button>
                <button 
                  onClick={() => onAction(ApprovalStatus.REJECTED, actionNote)}
                  className="flex-1 bg-[#A4262C] text-white py-2 rounded text-xs font-bold hover:bg-[#7D1D1F]"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {canFinalize && (
        <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-[#605E5C] uppercase">Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                  onClick={() => handleExport('PDF')}
                  className="flex items-center justify-center space-x-1 bg-white border border-[#EDEBE9] py-2 rounded text-xs font-semibold hover:bg-[#FAF9F8]"
              >
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l5 5a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                  <span>PDF</span>
              </button>
              <button 
                  onClick={() => handleExport('DOCX')}
                  className="flex items-center justify-center space-x-1 bg-white border border-[#EDEBE9] py-2 rounded text-xs font-semibold hover:bg-[#FAF9F8]"
              >
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A1 1 0 0111.293 2.707l5 5a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                  <span>DOCX</span>
              </button>
            </div>
            <button 
                onClick={onComposeEmail}
                className="w-full flex items-center justify-center space-x-2 bg-[#0078D4] text-white py-2 rounded text-xs font-semibold hover:bg-[#005A9E]"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>Compose Email</span>
            </button>
        </div>
      )}

      <div className="pt-6 border-t border-[#EDEBE9]">
        <h4 className="text-xs font-bold text-[#605E5C] uppercase mb-4">Team Activity</h4>
        <div className="space-y-4">
           {[1, 2].map(i => (
             <div key={i} className="flex space-x-3 opacity-60">
               <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0"></div>
               <div className="flex-1">
                 <div className="h-2 bg-gray-200 rounded w-1/2 mb-2"></div>
                 <div className="h-2 bg-gray-100 rounded w-full"></div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovalPanel;
