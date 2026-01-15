
import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProposalContent = async (lead: Lead): Promise<string> => {
  const prompt = `
    You are an expert Sales Engineer. Generate a high-impact Executive Summary for a professional sales proposal.
    
    CLIENT DATA:
    Lead: ${lead.company}
    Contact: ${lead.contact}
    Opportunity: ${lead.opportunity}
    Pain Points: ${lead.painPoints.join(', ')}

    PROPOSED SCOPE:
    Deployment of robotic assembly units and ML modules to supervise production lines. Installation includes hardware setup, software integration, and onsite personnel training.

    INSTRUCTIONS:
    1. Focus heavily on how the "Factory Floor Automation" directly solves the "Manual assembly throughput bottlenecks" and "High rework rate".
    2. Maintain a professional, persuasive, and visionary tone.
    3. The response should ONLY contain the Executive Summary text, about 2-3 paragraphs.
    4. Do not include section headers like "Executive Summary".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate AI summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI summary. Contoso Dynamics is prepared to transform your factory floor with industry-leading automation, targeting your specific throughput bottlenecks and rework challenges.";
  }
};

export const generateDraftEmail = async (lead: Lead, proposalSummary: string): Promise<string> => {
    const prompt = `
        Draft a professional follow-up email to ${lead.contact} from Acme Manufacturing regarding the proposal for ${lead.opportunity}.
        Context: ${proposalSummary}
        Make it warm, professional, and clear.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Failed to draft email.";
    } catch (error) {
        return "Email draft failed.";
    }
}
