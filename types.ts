
export enum UserRole {
  SALES_REP = 'Sales Rep',
  MANAGER = 'Manager'
}

export interface Lead {
  company: string;
  contact: string;
  opportunity: string;
  painPoints: string[];
  email: string;
}

export interface LineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Version {
  id: string;
  timestamp: string;
  proposal: ProposalContent;
  label: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  executiveSummary: string;
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  terms: string;
}

export interface ProposalContent {
  executiveSummary: string;
  scopeOfWork: string;
  deliverables: string;
  pricing: LineItem[];
  timeline: string;
  terms: string;
  discount: number;
  manualDiscountRequest?: number;
}

export enum ApprovalStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface ApprovalRequest {
  id: string;
  requester: string;
  note: string;
  status: ApprovalStatus;
  timestamp: string;
  requestedDiscount?: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
