
import { Lead, LineItem } from './types';

export const SAMPLE_LEAD: Lead = {
  company: "Acme Manufacturing Pvt Ltd",
  contact: "Riya Sharma",
  email: "riya.sharma@acme-mfg.co.in",
  opportunity: "Factory Floor Automation - Phase 1",
  painPoints: [
    "Manual assembly throughput bottlenecks",
    "High rework rate"
  ]
};

export const PRICEBOOK = {
  ROBOTIC_ARM: 15000,
  ML_QUALITY_MODULE: 12000,
  ONSITE_INSTALL: 800,
};

export const INITIAL_PROPOSAL_TEXT = {
  executiveSummary: "This proposal outlines the strategy for implementing high-efficiency automated systems at Acme Manufacturing. Our solution focuses on eliminating current manual bottlenecks and improving output quality through precision robotics and ML-driven quality control.",
  scopeOfWork: "Phase 1 involves the deployment of robotic assembly units and ML modules to supervise production lines. Installation includes hardware setup, software integration, and onsite personnel training.",
  deliverables: "- Robotic Assembly Unit (Base Model)\n- ML Quality Supervision Software\n- Training Manuals\n- Support Documentation",
  timeline: "6-8 weeks after Purchase Order",
  terms: "30% upfront payment, 70% on final delivery and acceptance testing."
};
