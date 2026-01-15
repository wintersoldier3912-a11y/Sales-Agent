# Sales Proposal Copilot Agent (Prototype)

A Microsoft 365 Copilot–inspired AI agent designed to streamline the sales lifecycle—from lead ingestion and proposal drafting to manager approval and client communication.

## 🎯 Project Goal
This prototype simulates an end-to-end sales workflow. It demonstrates how generative AI can assist sales representatives by synthesizing CRM data into professional documents, managing pricing logic, and facilitating team collaboration within a unified interface.

## 🚀 Core Features

### 1. AI-Powered Copilot Chat
- **Lead Ingestion:** Simulate data retrieval from CRM systems (e.g., Acme Manufacturing).
- **Drafting:** Uses Gemini 3 Flash to generate high-impact Executive Summaries based on specific client pain points.
- **Context Awareness:** Tracks the conversation flow to assist in the next logical step (Proposal -> Approval -> Email).

### 2. Professional Proposal Editor
- **WYSIWYG Interface:** Word-like editing experience for sections like Scope of Work and Deliverables.
- **Template Management:** Save custom proposal structures as user-defined templates and re-apply them across different leads.
- **Version History:** Automatic snapshots and manual revision tracking with a one-click "Restore" feature.
- **Dynamic Pricing:** Real-time calculation of totals, volume discounts (e.g., ≥3 Robotic Arms), and manager-approved manual discounts.

### 3. Integrated Approval Workflow
- **Role Switching:** Toggle between **Sales Rep** and **Manager** views to test the full lifecycle.
- **Discount Controls:** Reps can request manual discounts (up to 15%) which require Manager sign-off.
- **Status Tracking:** Visual badges and watermarks indicating `Draft`, `Pending`, `Approved`, or `Rejected` states.

### 4. Finalization & Export
- **Multi-Format Export:** Download the finalized, approved proposal as a simulated **PDF** or **DOCX** file.
- **Email Integration:** Outlook-style modal that pre-fills client contact info and uses AI to draft a personalized cover letter.

## 🛠 Technical Setup

### Prerequisites
- An API Key from [Google AI Studio](https://aistudio.google.com/).
- The key must be provided via the `process.env.API_KEY` environment variable.

### Project Structure
- `App.tsx`: Main state orchestration and layout.
- `components/`: Modular UI components (Chat, Editor, Approval Panel, Modals).
- `services/geminiService.ts`: Integration with `@google/genai` using the `gemini-3-flash-preview` model.
- `types.ts` & `constants.ts`: Strongly typed interfaces and mock CRM/Pricebook data.

## 🧪 Testing Scenarios

1.  **Scenario: The AI Draft**
    - Click **"Ingest Lead from CRM"** in the Copilot panel.
    - Click **"Generate Draft Proposal"**.
    - Observe the AI-generated Executive Summary tailored to Acme's "Manual assembly throughput" pain point.

2.  **Scenario: Pricing & Templates**
    - In the Pricing table, increase **Robotic Arm** quantity to 3. Notice the automatic "Volume Reward" trigger.
    - Modify the "Terms" section and click the **Templates** tab on the left to save it as a "New Standard" template.

3.  **Scenario: The Approval Loop**
    - In the Right Panel, request a 10% manual discount with a note.
    - Use the **Viewing as** dropdown in the top navigation to switch to **Manager**.
    - Review the request in the right panel and click **Approve**.
    - Switch back to **Sales Rep** to see the "Approved" watermark and the unlocked "Compose Email" action.

## 🎨 Design Language
- **Microsoft 365 Inspiration:** Uses a neutral gray/white palette (`#F3F2F1`) with Contoso Blue (`#0078D4`) accents.
- **Typography:** Clean, professional interface using the **Inter** font family.
- **Accessibility:** Semantic HTML structure with ARIA labels for interactive elements.

---
*Note: This is a prototype intended for demonstration purposes. File exports are simulated and data is currently held in-memory (volatile state).*