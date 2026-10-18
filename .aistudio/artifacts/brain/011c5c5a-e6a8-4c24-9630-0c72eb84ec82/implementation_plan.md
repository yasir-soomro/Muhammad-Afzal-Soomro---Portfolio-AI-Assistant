# Portfolio AI Assistant: Revised Implementation Plan

A modern, responsive developer portfolio for **Muhammad Afzal Soomro** featuring a persistent dual-pane layout with an AI assistant powered by Gemini. Visitors can explore verified projects and development experience, while conversing with a grounded assistant that references verified project records and avoids hallucinated information.

> [!IMPORTANT]
> **Plan Revision Summary**:
> - **Display Identity**: Set to **Muhammad Afzal Soomro**, Full-Stack Developer.
> - **Verified Portfolio Projects**: Limited strictly to verified records:
>   1. `Zentrix Store` (Full-stack web application).
>   2. `Real Estate Lead Management API` (Backend service, marked explicitly as **In Progress**).
> - **Elimination of Invented Data**: Removed all fictitious projects, fabricated career histories, unsupported performance claims, and placeholder external links.
> - **Data Source Architecture**: Switched to `data/portfolio.json` paired with a separate TypeScript/Zod validation schema (`lib/portfolio-schema.ts`) documenting required, optional, and unverified fields.
> - **Safe AI Output Pipeline**: Designed a structured server response (`{ answer: string, citedProjectIds: string[] }`) where project IDs are validated against `data/portfolio.json` on the server before reaching the client. Clickable URLs are generated solely from verified portfolio data.
> - **Realistic Architectural Stance**: Removed claims of "zero cold starts" or "guaranteed immunity to prompt injection." Documented in-memory rate limiting boundaries.
> - **Measurable Acceptance Criteria**: Added concrete verification tests for error states, citation pruning, accessibility, build execution, and 5 exact viewport widths (320px, 375px, 768px, 1024px, 1440px).
> - **Milestone Restructuring**: Core interface and basic non-streaming request/response flow are built and tested before adding optional streaming and cross-panel synchronization.

---

## 1. Overview & Core Concept

### Developer Profile & Role
- **Name**: Muhammad Afzal Soomro
- **Title**: Full-Stack Developer
- **Verified Starting Projects**:
  1. `Zentrix Store`: Full-stack e-commerce web application featuring product cataloging, responsive shopping workflows, and state-managed cart interactions.
  2. `Real Estate Lead Management API`: Backend service focused on lead ingestion, validation, status tracking, and automated routing (**In Progress**).
- **Core Stacks**: TypeScript, Next.js, Node.js, REST APIs, Tailwind CSS.

### Purpose
Provide a clean, transparent portfolio where visitors and recruiters can review verified technical work and interact with an AI assistant that answers questions accurately using only documented facts.

---

## 2. Requirements & Data Schema

### A. Core User Journeys
1. **Portfolio Inspection**: Visitor browses the showcase pane, inspecting verified project details, technology tags, and development status.
2. **Grounded Inquiries**: Visitor asks questions about projects, architecture, or tools (e.g. *"What is the current status of the Real Estate API?"* or *"What technologies power Zentrix Store?"*).
3. **Verified Citation Review**: The assistant returns an answer accompanied by validated project IDs. The interface displays clickable project badges that open the verified project details.
4. **Out-of-Scope Handling**: When asked about technologies or projects not in `data/portfolio.json`, the assistant transparently clarifies that the requested skill or project is not part of the verified portfolio.

### B. Portfolio Knowledge Base Schema (`data/portfolio.json`)

```typescript
// Defined in lib/portfolio-schema.ts
export interface PortfolioData {
  developer: {
    name: string;               // REQUIRED (Muhammad Afzal Soomro)
    title: string;              // REQUIRED (Full-Stack Developer)
    summary: string;            // REQUIRED (Truthful summary of focus & background)
    location?: string;          // OPTIONAL
    contact: {
      email?: string;           // OPTIONAL (soomroyasir81@gmail.com)
      github?: string;          // OPTIONAL (provided only if verified URL exists)
      linkedin?: string;        // OPTIONAL (provided only if verified URL exists)
    };
  };
  skills: {
    category: string;           // REQUIRED (e.g., "Languages & Frameworks", "Backend & APIs")
    items: string[];            // REQUIRED (Verified technical proficiencies)
  }[];
  projects: {
    id: string;                 // REQUIRED unique slug ("zentrix-store", "real-estate-api")
    title: string;              // REQUIRED
    status: 'completed' | 'in_progress' | 'active'; // REQUIRED
    summary: string;            // REQUIRED truthful description
    technologies: string[];     // REQUIRED verified tech stack
    architectureNotes?: string; // OPTIONAL details on data flow or endpoints
    liveUrl?: string;           // OPTIONAL verified URL only
    repoUrl?: string;           // OPTIONAL verified URL only
  }[];
}
```

#### Field Verification Status
- **Required**: `developer.name`, `developer.title`, `developer.summary`, `skills`, `projects.id`, `projects.title`, `projects.status`, `projects.summary`, `projects.technologies`.
- **Optional**: `developer.contact.email`, `projects.architectureNotes`, `projects.liveUrl`, `projects.repoUrl`.
- **Unverified / Excluded**: Arbitrary employment timelines, client testimonials, and unverified third-party statistics are strictly omitted until verified records are supplied.

---

## 3. UI/UX Plan & Design System

### Visual Direction & Theme
- **Style**: Clean, professional software developer workstation with dark-mode posture and high-contrast typography.
- **Palette (60-30-10 Distribution)**:
  - *60% Dominant Canvas*: Deep charcoal/neutral dark background (`#0B0F17`).
  - *30% Structural Surfaces*: Subtle slate cards (`#151C28`), hairline borders (`#222F3E`), and muted body text (`#94A3B8`).
  - *10% Focal Accent*: Electric cobalt (`#2563EB`) and subtle cyan highlight (`#06B6D4`) reserved strictly for active tabs, interactive buttons, and verified citation links.
- **Zero-Pill Discipline**: Static metadata (e.g. project status, tech list, dates) is formatted as plain text with subtle typographic dividers (`·`). Pill/capsule styling is strictly restricted to interactive buttons, filter toggles, and citation chips.
- **Top Bar Contract**:
  - Zone 1 (Wordmark): `Muhammad Afzal Soomro` (single-line text).
  - Zone 2 (Nav Links): `Projects · Skills · Assistant` (clean single-line text links).
  - Zone 3 (Action): Direct email action (`soomroyasir81@gmail.com`).

### Layout Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: [Muhammad Afzal Soomro]       —       [Projects · Skills]       —   [Contact] │
├───────────────────────────────────────────────────────┬────────────────────────────────┤
│ LEFT PANEL: PORTFOLIO SHOWCASE (60% Desktop)          │ RIGHT PANEL: AI ASSISTANT (40%)│
│                                                       │                                │
│ ┌─ Developer Intro ─────────────────────────────────┐ │ ┌─ Assistant Header ─────────┐ │
│ │ Muhammad Afzal Soomro                             │ │ │ Portfolio Assistant         │ │
│ │ Full-Stack Developer                              │ │ │ Verified against profile    │ │
│ └───────────────────────────────────────────────────┘ │ └─────────────────────────────┘ │
│                                                       │ ┌─ Message Stream ────────────┐ │
│ ┌─ Technical Skills Matrix ─────────────────────────┐ │ │ AI: Hello! Ask me about     │ │
│ │ Frontend · Backend · APIs · Tools                 │ │ │ Muhammad's projects or tech.│ │
│ └───────────────────────────────────────────────────┘ │ │                             │ │
│                                                       │ │ User: What is the status of │ │
│ ┌─ Project Showcase ────────────────────────────────┐ │ │       the Real Estate API?  │ │
│ │ ┌───────────────────────────────────────────────┐ │ │ │                             │ │
│ │ │ Zentrix Store                     [Completed] │ │ │ │ AI: It is currently In      │ │
│ │ │ Full-stack e-commerce web platform            │ │ │ │     Progress, focusing on   │ │
│ │ └───────────────────────────────────────────────┘ │ │ │     lead intake & routing.  │ │
│ │ ┌───────────────────────────────────────────────┐ │ │ │     [Ref: Real Estate API]  │ │
│ │ │ Real Estate Lead Management API [In Progress] │ │ │ └─────────────────────────────┘ │
│ │ │ Backend service for ingestion & routing       │ │ ┌─ Suggested Prompts ───────────┐ │
│ │ └───────────────────────────────────────────────┘ │ │ [Zentrix tech?] [API status?]│ │
│ └───────────────────────────────────────────────────┘ ├─────────────────────────────┤ │
│                                                       │ │ [Ask a question...]   [Send]│ │
│                                                       │ └─────────────────────────────┘ │
└───────────────────────────────────────────────────────┴────────────────────────────────┘
```

### Viewport Adaptation Matrix
- **320px (Small Mobile)**: Single-column stacked layout; touch targets $\ge 44\text{px}$; no horizontal overflow; chat accessible via sticky bottom action bar.
- **375px (Standard Mobile)**: Single-column showcase with floating bottom trigger to open full-screen assistant modal sheet.
- **768px (Tablet)**: Two-column collapsed layout; toggle button expands assistant side panel.
- **1024px (Small Desktop / Laptop)**: Persistent split view (55% showcase / 45% assistant).
- **1440px (Desktop Baseline)**: Balanced dual-pane workstation (60% showcase / 40% sticky assistant); independent scroll on left canvas.

---

## 4. Technical Architecture & AI Safety Pipeline

### System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT BROWSER (Next.js 15 App Router / React 19)                      │
│                                                                        │
│ ┌───────────────────────────┐         ┌──────────────────────────────┐ │
│ │ PortfolioShowcase View    │         │ AssistantPanel View          │ │
│ │ - Developer Bio & Skills  │         │ - Message History            │ │
│ │ - Verified Project Cards  │◄───────►│ - Prompt Chips               │ │
│ │ - Project Details Dialog  │ Synced  │ - Validated Citation Badges  │ │
│ └─────────────┬─────────────┘ Focus   └──────────────┬───────────────┘ │
└───────────────┼──────────────────────────────────────┼─────────────────┘
                │ Direct Read                          │ HTTP POST /api/chat
                ▼                                      ▼
┌─────────────────────────────┐         ┌────────────────────────────────┐
│ Static JSON Data Store      │         │ SERVER-SIDE API ROUTE          │
│ data/portfolio.json         │         │ app/api/chat/route.ts          │
│ (Validated by Zod schema)   │         │ - Validate Request Body        │
└───────────────┬─────────────┘         │ - In-Memory Token Bucket       │
                │ Server Injection      │ - Prompt Assembly with Ground  │
                └──────────────────────►│ - Gemini 3.8 Flash Execution  │
                                        │ - Server Citation Validation   │
                                        └──────────────┬─────────────────┘
                                                       ▼
                                        ┌────────────────────────────────┐
                                        │ @google/genai SDK              │
                                        │ - Model: 'gemini-3.8-flash'    │
                                        │ - Secret: GEMINI_API_KEY       │
                                        └────────────────────────────────┘
```

### Safe AI Output & Citation Verification Pipeline
To prevent the model from inventing project details or spitting out unverified external links:

1. **System Prompt Grounding**:
   - The contents of `data/portfolio.json` are passed into the model's `systemInstruction`.
   - The model is instructed to answer strictly based on the provided JSON data.
   - The model is instructed to format output as structured JSON matching `{ answer: string, citedProjectIds: string[] }`.
2. **Server-Side Citation Sanitization**:
   - Upon receiving the model's response, `app/api/chat/route.ts` parses the JSON.
   - It verifies every string in `citedProjectIds` against the set of valid IDs in `data/portfolio.json` (`['zentrix-store', 'real-estate-api']`).
   - Any unknown, hallucinated, or malformed ID is stripped from the list.
3. **Client-Side Rendering Safety**:
   - The client receives the clean `citedProjectIds` array.
   - Links to projects or external code repositories are rendered **exclusively** from the local `data/portfolio.json` record corresponding to that ID.
   - The model has no capability to inject arbitrary hyperlinked URLs into the user's browser.
4. **Defense-in-Depth Limitations (Honest Disclosure)**:
   - System prompts mitigate accidental hallucination but do *not* offer mathematical immunity against determined prompt injection.
   - The server validates all input types and response formats to isolate prompt boundaries.

### Secrets & Environment
- `process.env.GEMINI_API_KEY`: Kept strictly server-side in `app/api/chat/route.ts`. Never passed to client bundles.
- No custom telemetry headers or unneeded external tracking scripts.

### Rate Limiting & Scalability Realities
- **Static JSON Trade-Offs**: Eliminates database query latency and connection pools for this read-only application. However, container instances running on serverless environments (Cloud Run) still experience standard cold-start latencies (~1–2s on scale from zero).
- **In-Memory Rate Limiting Boundaries**:
  - Implemented as an in-memory sliding window (e.g. 10 requests per minute per IP).
  - *Limitation*: In multi-container or serverless scale-out scenarios, each instance maintains its own memory store, meaning limits are per-instance rather than globally shared.
  - *Recommendation*: For a developer portfolio with typical traffic, in-memory limiting adequately protects against casual abuse without the architectural complexity of Redis/Upstash. A shared Redis rate limiter is noted for future scale-up only if traffic warrants it.

---

## 5. Testable Acceptance Criteria

### A. Portfolio Data Validation
- [ ] `data/portfolio.json` validates against `lib/portfolio-schema.ts`.
- [ ] If required fields (`developer.name`, `projects[].id`) are missing, build or runtime initialization logs an explicit validation error.
- [ ] Verified projects list accurately reflects `Zentrix Store` and `Real Estate Lead Management API` (`in_progress`).

### B. API Key & Provider Failure Handling
- [ ] If `GEMINI_API_KEY` is missing or invalid, `/api/chat` returns HTTP 500 with `{ error: "AI service configuration missing" }`.
- [ ] The client displays a friendly error card with a "Retry" button; no raw stack traces appear in the UI.
- [ ] If Gemini returns an upstream 5xx or rate limit error, the server handles it gracefully and returns HTTP 503.

### C. Input Validation
- [ ] Submitting empty or whitespace-only queries is disabled in the UI and rejected with HTTP 400 on the server.
- [ ] Queries exceeding 500 characters are trimmed/rejected with HTTP 400.
- [ ] Conversation history payload exceeding 10 messages is truncated to the most recent 10 turns.

### D. Citation Verification & URL Integrity
- [ ] If the model returns `citedProjectIds: ["fake-project-123"]`, the server strips it before sending the response.
- [ ] Valid citation IDs (e.g. `zentrix-store`) render a badge that, when clicked, opens the Zentrix Store details.
- [ ] No external hyperlinks can be rendered by the assistant unless they originate from the verified `data/portfolio.json` file.

### E. Request Limits & Timeouts
- [ ] Rapid submission of >10 queries in 60 seconds from the same client triggers an HTTP 429 response.
- [ ] If the Gemini request exceeds 15 seconds, an `AbortController` terminates the request and returns HTTP 504.

### F. Accessibility & Keyboard Navigation
- [ ] Pressing `Tab` cycles through Top Bar links, project cards, and chat controls with visible focus rings (`focus-visible`).
- [ ] Pressing `Escape` closes any open project details modal.
- [ ] Focus is trapped inside the project modal while open and returned to the trigger button on close.

### G. Responsive Layout Across Viewports
- [ ] **320px**: No horizontal scrollbar; text does not clip; touch buttons measure at least 44px in height.
- [ ] **375px**: Layout renders cleanly in single column; floating chat launcher button appears.
- [ ] **768px**: Tablet view renders with readable cards; assistant is toggleable without blocking main content.
- [ ] **1024px**: Dual-column layout initializes with no overlapping text.
- [ ] **1440px**: Desktop split view displays full showcase on left and sticky assistant on right; zero horizontal overflow.

### H. Production Build & Execution
- [ ] `npm run build` succeeds without TypeScript or bundling errors.
- [ ] Application loads without hydration mismatch warnings in the browser console.

---

## 6. Implementation Milestones

### Milestone 1: Knowledge Base & Schema Setup
- **Objective**: Create `data/portfolio.json` with Muhammad Afzal Soomro's verified data and write the TypeScript validation schema.
- **Files**: `data/portfolio.json`, `lib/portfolio-schema.ts`.
- **Dependencies**: Existing Next.js, TypeScript.
- **Acceptance Criteria**: Schema validates JSON successfully; projects correctly list `Zentrix Store` and `Real Estate Lead Management API` (`in_progress`).
- **Verification**: Run TypeScript compiler check.

### Milestone 2: Core Responsive Portfolio Interface
- **Objective**: Build the Top Bar, developer intro, skills list, and verified project cards across all 5 target screen widths.
- **Files**: `app/page.tsx`, `components/portfolio/TopBar.tsx`, `components/portfolio/HeroSection.tsx`, `components/portfolio/ProjectCard.tsx`, `components/portfolio/ProjectModal.tsx`.
- **Dependencies**: `lucide-react`, `motion`.
- **Acceptance Criteria**: Fully responsive showcase layout with functional project detail modals; zero horizontal overflow at 320px–1440px.
- **Verification**: Inspect DOM and test layout at 320, 375, 768, 1024, and 1440px.

### Milestone 3: Server-Side Gemini Route & Basic Request/Response Flow
- **Objective**: Build `/api/chat/route.ts` with structured JSON responses, server citation validation, input sanitization, and basic client chat UI (non-streaming first).
- **Files**: `app/api/chat/route.ts`, `lib/gemini.ts`, `components/assistant/AssistantPanel.tsx`, `components/assistant/ChatInput.tsx`.
- **Dependencies**: `@google/genai`.
- **Acceptance Criteria**: Questions about Muhammad's projects return grounded answers with verified `citedProjectIds`; unknown citation IDs are filtered out; API key remains strictly server-side.
- **Verification**: Test valid questions, off-topic questions, and verify server logs.

### Milestone 4: Cross-Panel Interactions & Citations
- **Objective**: Wire citation badges and suggested prompt chips to the showcase view.
- **Files**: `components/assistant/ChatMessageList.tsx`, `components/assistant/PromptChips.tsx`, `app/page.tsx`.
- **Dependencies**: Existing state hooks.
- **Acceptance Criteria**: Clicking a citation badge highlights the project card on the left pane and opens its modal; clicking a prompt chip submits the query.
- **Verification**: Manual interaction testing in browser.

### Milestone 5: Security, Error States & Streaming Enhancement
- **Objective**: Add in-memory rate limiting, 15s timeout aborts, input length restrictions, error cards, and optional response streaming.
- **Files**: `app/api/chat/route.ts`, `components/assistant/AssistantPanel.tsx`.
- **Acceptance Criteria**: Rate limit triggers HTTP 429 after 10 requests; missing key or timeout shows clean fallback UI; inputs > 500 chars rejected.
- **Verification**: Execute test scripts simulating rapid requests and invalid payloads.

### Milestone 6: Final Responsive Verification & Build Audit
- **Objective**: Conduct comprehensive verification across all 5 viewport widths, keyboard accessibility, and production build checks.
- **Files**: `app/layout.tsx`, `metadata.json`.
- **Acceptance Criteria**: `npm run build` succeeds; zero hydration warnings; responsive checklist passes at 320, 375, 768, 1024, and 1440px.
- **Verification**: Run `compile_applet` and perform visual/functional tests.

---

## 7. Assumptions & Dependencies

### Remaining Assumptions
1. **Verified Project Details**: `Zentrix Store` and `Real Estate Lead Management API` are the initial verified projects. Additional projects can be added to `data/portfolio.json` in the future without code changes.
2. **Contact Email**: `soomroyasir81@gmail.com` is used as the verified contact point. External GitHub/LinkedIn links will only be displayed if verified URLs are added to the JSON data.
3. **Model Selection**: `gemini-3.8-flash` is selected for standard text Q&A tasks as per AI Studio guidelines.

### Dependencies
- `@google/genai` (^2.4.0) — already installed.
- `lucide-react` (^0.553.0) — already installed.
- `motion` (^12.23.24) — already installed.
- `tailwindcss` (4.1.11) — already configured.
- No new external packages required.
