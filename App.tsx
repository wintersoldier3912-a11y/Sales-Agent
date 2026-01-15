
import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Lead, 
  ProposalContent, 
  ApprovalStatus, 
  ApprovalRequest, 
  Message,
  LineItem,
  Version
} from './types';
import { SAMPLE_LEAD, PRICEBOOK, INITIAL_PROPOSAL_TEXT } from './constants';
import { generateProposalContent, generateDraftEmail } from './services/geminiService';

// Components
import ChatPanel from './components/ChatPanel';
import ProposalEditor from './components/ProposalEditor';
import ApprovalPanel from './components/ApprovalPanel';
import EmailComposerModal from './components/EmailComposerModal';
import TopNav from './components/TopNav';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.SALES_REP);
  const [lead, setLead] = useState<Lead | null>(null);
  const [proposal, setProposal] = useState<ProposalContent>({
    ...INITIAL_PROPOSAL_TEXT,
    pricing: [],
    discount: 0
  });
  const [versions, setVersions] = useState<Version[]>([]);
  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Sales Copilot. How can I help you today? You can start by ingesting a lead from CRM.", timestamp: new Date() }
  ]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const saveVersion = (proposalState: ProposalContent, label: string) => {
    const newVersion: Version = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      proposal: JSON.parse(JSON.stringify(proposalState)),
      label
    };
    setVersions(prev => [newVersion, ...prev]);
  };

  const handleIngestLead = () => {
    addMessage('user', 'Ingest lead from CRM for Acme Manufacturing');
    setTimeout(() => {
      setLead(SAMPLE_LEAD);
      addMessage('assistant', `Lead "${SAMPLE_LEAD.company}" ingested successfully. Opportunity: "${SAMPLE_LEAD.opportunity}". Ready to generate a draft?`);
    }, 800);
  };

  const handleGenerateProposal = async () => {
    if (!lead) return;
    addMessage('user', 'Generate draft proposal');
    addMessage('system', 'Copilot is analyzing lead data and generating an AI Executive Summary...');
    
    const initialPricing: LineItem[] = [
      { id: '1', name: 'Robotic Arm', price: PRICEBOOK.ROBOTIC_ARM, quantity: 1 },
      { id: '2', name: 'ML Quality Module', price: PRICEBOOK.ML_QUALITY_MODULE, quantity: 1 },
      { id: '3', name: 'Onsite Install (Days)', price: PRICEBOOK.ONSITE_INSTALL, quantity: 5 }
    ];

    // AI summary generation based on lead pain points and scope
    const aiSummary = await generateProposalContent(lead);
    
    const newProposal: ProposalContent = {
      ...INITIAL_PROPOSAL_TEXT,
      pricing: initialPricing,
      executiveSummary: aiSummary,
      discount: 0
    };

    setProposal(newProposal);
    saveVersion(newProposal, "AI Draft Generated");
    addMessage('assistant', "I've synthesized an Executive Summary focused on Acme's throughput bottlenecks and rework rates. The pricing table has also been populated with initial requirements.");
  };

  const handleRequestApproval = (note: string, requestedDiscount?: number) => {
    if (proposal.pricing.length === 0) return;
    addMessage('user', requestedDiscount ? `Requesting approval with ${requestedDiscount}% discount` : 'Requesting manager approval');
    
    const newRequest: ApprovalRequest = {
      id: Math.random().toString(36).substr(2, 9),
      requester: 'Sales Rep',
      note: note || 'Ready for review.',
      status: ApprovalStatus.PENDING,
      timestamp: new Date().toLocaleTimeString(),
      requestedDiscount
    };
    setApproval(newRequest);
    addMessage('assistant', "Approval request sent. I'll notify you when the manager responds.");
  };

  const handleManagerAction = (status: ApprovalStatus, managerNote: string) => {
    if (!approval) return;
    setApproval({ ...approval, status });
    
    if (status === ApprovalStatus.APPROVED) {
      const finalDiscount = approval.requestedDiscount || proposal.discount;
      const updatedProposal = { ...proposal, discount: finalDiscount };
      setProposal(updatedProposal);
      saveVersion(updatedProposal, "Approved Version");
      addMessage('assistant', `Approved! ${finalDiscount > 0 ? `A ${finalDiscount}% discount has been applied.` : ''} Note: "${managerNote}".`);
    } else {
      addMessage('assistant', `Rejected: "${managerNote}". Please adjust and resubmit.`);
    }
  };

  const handleRestoreVersion = (v: Version) => {
    setProposal(v.proposal);
    addMessage('system', `Restored to version: ${v.label} (${v.timestamp})`);
  };

  const handleComposeEmail = async () => {
    if (!lead) return;
    setIsEmailModalOpen(true);
    const draft = await generateDraftEmail(lead, proposal.executiveSummary);
    setEmailDraft(draft);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNav role={role} onRoleChange={setRole} />
      
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[360px] border-r border-[#EDEBE9] bg-white">
          <ChatPanel 
            messages={messages} 
            onIngest={handleIngestLead}
            onGenerate={handleGenerateProposal}
            lead={lead}
            onSendMessage={(msg) => addMessage('user', msg)}
          />
        </div>

        <div className="flex-1 bg-[#F3F2F1] overflow-y-auto p-8 relative">
          <ProposalEditor 
            lead={lead} 
            proposal={proposal} 
            setProposal={setProposal} 
            approvalStatus={approval?.status || ApprovalStatus.DRAFT}
            versions={versions}
            onRestore={handleRestoreVersion}
          />
        </div>

        <div className="w-[320px] border-l border-[#EDEBE9] bg-white p-4 overflow-y-auto">
          <ApprovalPanel 
            role={role}
            approval={approval} 
            onAction={handleManagerAction}
            onRequest={handleRequestApproval}
            canFinalize={approval?.status === ApprovalStatus.APPROVED}
            onComposeEmail={handleComposeEmail}
          />
        </div>
      </main>

      <EmailComposerModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        lead={lead}
        draft={emailDraft}
      />
    </div>
  );
};

export default App;
