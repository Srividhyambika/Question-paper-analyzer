# Exam PYQ Analyzer

An AI-powered exam question paper analyzer built on the MERN stack. Upload a question paper, syllabus, and textbooks — the system extracts and parses all questions, analyzes each one using a large language model, and delivers a comprehensive report covering syllabus coverage, difficulty, Bloom's Taxonomy, and cognitive complexity. An AI agent answers natural language queries about the paper and generates personalized study strategies.

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Full Stack — MERN setup, PDF upload & parsing, authentication, React UI | ✅ Complete |
| Phase 2 | LLM Integration — Groq API, syllabus matching, difficulty & Bloom's analysis | ✅ Complete |
| Phase 3 | AI Agent — tool-based agent, conversational interface, study strategy generation | ✅ Complete |

---

## What It Does

### Core Pipeline
- Upload three PDFs: question paper, syllabus, and one or more textbooks
- Automatically extracts and segments individual questions and sub-questions (Q1a, Q1b, Q1c)
- Parses syllabus into structured units and topic lists
- Chunks textbook content into 500-word passages for RAG
- Runs every question through the Groq LLM in a single structured prompt
- Stores all results in MongoDB and displays them in an interactive dashboard

### Per-Question Analysis
- Syllabus matching with confidence score (0–100%)
- Out-of-syllabus detection (flagged when confidence < 40%)
- Difficulty classification: Easy / Medium / Hard
- Bloom's Taxonomy level detection: L1 Remember → L6 Create
- Cognitive complexity score (1–10) with thinking type classification
- AI reasoning justification per question

### Dashboard & Visualisation
- Summary cards: total questions, syllabus coverage %, out-of-syllabus count, difficulty score
- Bloom's Taxonomy pie chart
- Difficulty distribution bar chart
- Cognitive complexity radar chart
- Topics covered vs not covered breakdown with AI insights paragraph
- Expandable question cards with complexity bars, search, filter by difficulty and Bloom's level
- Notes field on each question (saved to MongoDB)
- PDF export with preview modal and download
- Print-friendly layout

### Authentication & Security
- JWT-based authentication with 7-day token expiry
- Role-based access control — Student and Admin roles
- Passwords hashed with bcrypt (12 salt rounds) — invisible in MongoDB
- Password strength meter: Weak / Medium / Strong with live rule checklist
- Regex validation: uppercase, lowercase, number, special character, minimum length
- Password cannot match username or date of birth
- Copy-paste disabled on all password fields
- Rate limiting: 100 requests per 15 minutes globally, 10 on auth routes
- Input sanitization to strip prompt injection attempts before LLM processing
- Auto-delete uploaded PDFs after analysis — only extracted text kept in DB

### AI Agent (Phase 3)
- Tool-based intent detection — LLM decides which tool to call based on the query
- 7 tools: get questions by difficulty, syllabus gaps, Bloom's breakdown, out-of-syllabus questions, paper summary, study plan generation, paper comparison
- Conversational memory across messages within a session
- Floating global AI assistant available on every page
- Suggested starter questions
- General AI study assistant for questions unrelated to a specific paper

### Generative AI Panel (GenAI)
- Topic-wise Summary: AI-generated approach guides for every topic identified in the paper.
- Next Exam Predictions: Predicts likely questions based on identified topic gaps and historical patterns.
- Memory Tricks & Mnemonics: Generates custom mental models and mnemonics for complex concepts.
- Personalized Study Schedule: Users input their exam date and available study hours to generate a day-by-day plan.
- PDF Export: Integrated jsPDF logic allows users to download their personalized study schedules as professionally formatted PDFs.

### Admin & Analytics
- Visitor session tracking (start/end timestamps, duration)
- Admin dashboard: total visits, average time spent, visits per day chart, registered user count
- Stats refresh every 30 seconds

### Profile & Personalisation
- Profile page with SVG character avatars: Kung Fu Panda, Monkey King, Ninja Turtle, Spider-Man, Batman
- Initials fallback with consistent color per username if no avatar selected
- Username update with duplicate check
- Avatar persists across sessions and devices

### UI & Experience
- Animated landing page with scroll-triggered animations, animated stat counters, how-it-works section, sample analysis cards, FAQ accordion
- Neon dark mode with deep background and glowing card/button effects
- Light/dark mode toggle with localStorage persistence
- Toast notifications for all key actions
- Loading skeleton on analysis page
- Custom 404 and 500 error pages
- Split-panel login and register pages with illustration and tagline

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, Recharts, React Query, React Router v6, Lucide React|
| Backend | Node.js + Express |
| Database | MongoDB (local via MongoDB Community Server) |
| LLM | Groq API — Llama 3.3 70B Versatile |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| PDF Tools | pdf-parse (Extraction), jsPDF (Generation/Export) |
| Rate Limiting | express-rate-limit |
| PDF Export | jsPDF + html2canvas |
| Notifications | react-hot-toast |
| HTTP Client | Axios |

---

## Project Structure

```
exam-analyzer/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Card, Badge, Input, Progress, Tabs, Avatar, Tooltip, Skeleton
│   │   │   ├── upload/              # UploadZone, UploadProgress
│   │   │   ├── dashboard/           # SummaryCard, QuestionTable, TopicsCoverage, ExportReport, AnalysisSkeleton, GenAIPanel
│   │   │   ├── charts/              # BloomsChart, DifficultyChart, ComplexityRadar
│   │   │   ├── agent/               # AgentChat, FloatingAgent
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Animated public landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx             # Upload page
│   │   │   ├── Analysis.jsx         # Results dashboard
│   │   │   ├── History.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── Profile.jsx          # Avatar picker + username update
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── ServerError.jsx
│   │   ├── store/
│   │   │   ├── authContext.jsx
│   │   │   ├── useAuth.js
│   │   │   ├── themeContext.jsx
│   │   │   └── useTheme.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── lib/
│   │       └── utils.js
│   └── package.json
│
└── server/                          # Express backend
    ├── config/
    │   ├── db.js
    │   └── multer.js
    ├── controllers/
    │   ├── uploadController.js
    │   ├── analysisController.js
    │   ├── authController.js
    │   ├── adminController.js
    │   └── agentController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── validateUpload.js
    ├── models/
    │   ├── Paper.js
    │   ├── Question.js              # includes notes field
    │   ├── Syllabus.js
    │   ├── Textbook.js
    │   ├── AnalysisResult.js
    │   ├── User.js                  # includes avatar field
    │   └── VisitorLog.js
    ├── routes/
    │   ├── uploadRoutes.js
    │   ├── analysisRoutes.js        # includes PATCH /question/:id/notes
    │   ├── authRoutes.js            # includes PATCH /profile
    │   ├── adminRoutes.js
    │   └── agentRoutes.js           # includes POST /chat
    ├── services/
    │   ├── pdfService.js
    │   ├── geminiService.js         # Groq API integration
    │   └── agentService.js          # Tool-based agent
    └── utils/
        ├── passwordUtils.js
        └── sanitize.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Community Server running locally on port 27017
- MongoDB Compass (optional, for visual DB inspection)
- Groq API key (free at console.groq.com)

### 1. Start MongoDB
```bash
mkdir -p ~/data/db
mongod --dbpath ~/data/db
```
Keep this terminal open.

### 2. Start the backend
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5001`

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Protected | Get current user |
| PATCH | `/api/auth/profile` | Protected | Update username and avatar |

### Upload
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload` | Protected | Upload question paper + syllabus + textbooks |
| GET | `/api/upload/history` | Protected | Get all past uploads |
| DELETE | `/api/upload/:id` | Protected | Delete paper and all related data |

### Analysis
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/analysis/run/:paperId` | Protected | Trigger LLM analysis |
| GET | `/api/analysis/status/:paperId` | Protected | Get processing status |
| GET | `/api/analysis/results/:paperId` | Protected | Get full results |
| GET | `/api/analysis/compare?ids=id1,id2` | Protected | Compare two papers |
| PATCH | `/api/analysis/question/:id/notes` | Protected | Save notes to a question |

### Agent
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/agent/query` | Protected | Query agent about a specific paper |
| POST | `/api/agent/chat` | Protected | General AI study assistant chat |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin only | Visitor analytics |
| POST | `/api/admin/visit/start` | Public | Start session tracking |
| POST | `/api/admin/visit/end` | Public | End session and record duration |

---

## MongoDB Collections

```
users              — credentials (hashed), role, DOB, avatar
visitorlogs        — session start/end, duration per visit
papers             — upload metadata, PDF paths, processing status
syllabuses         — structured units and topic lists
textbooks          — chunked content (500 words/chunk) for RAG
questions          — one document per sub-question with full LLM analysis + notes
analysisresults    — aggregated distributions, insights, topic coverage
```

---

## Password Rules

| Rule | Requirement |
|------|-------------|
| Length | Minimum 8 characters |
| Uppercase | At least one (A-Z) |
| Lowercase | At least one (a-z) |
| Number | At least one (0-9) |
| Special character | At least one (!@#$%^&* etc.) |
| Username | Must not match username |
| Date of birth | Must not contain DOB in any format |

Strength: Weak (≤3) / Medium (4–5) / Strong (6–7)

---

## PDF Parsing Notes

- Supports formats: `Q.01`, `Q1`, `Q1.`, `Q 1`, `Question 1`, `1.`, `1)`
- Zero-padded numbers (`Q01`, `Q02`) handled correctly
- Sub-questions (`a`, `b`, `c`) split into separate documents
- Instruction lines ("Answer any FIVE...") filtered out automatically
- Tables flattened to text — handled gracefully by LLM
- Fallback: if segmentation fails, full text stored as single block

---

## Agent Tools

| Tool | Description |
|------|-------------|
| `get_questions_by_difficulty` | Filter questions by easy/medium/hard or complexity score range |
| `get_syllabus_gaps` | Find syllabus topics not covered in the paper |
| `get_blooms_breakdown` | Distribution of Bloom's levels across all questions |
| `get_out_of_syllabus` | All questions flagged as outside the syllabus |
| `get_paper_summary` | Overall stats, distributions, and insights |
| `generate_study_plan` | Personalized study strategy based on analysis |
| `compare_papers` | Side-by-side comparison with another uploaded paper |

---

## Major Challenges & How They Were Resolved

### 1. Gemini API Free Tier Quota
**Problem:** Google Gemini API returned 429 errors with `limit: 0` — the free tier quota for `gemini-2.0-flash` was unavailable on the project's Google account.

**Resolution:** Switched to Groq API which offers a genuinely generous free tier with no daily limits and faster inference. The switch required only changing the SDK and model name — no prompt changes needed. Groq's `llama-3.3-70b-versatile` model performs comparably for structured JSON output tasks.

---

### 2. PDF Parsing Inconsistencies
**Problem:** `pdf-parse` extracts raw text without structure. Question papers use wildly different numbering formats (`Q.01`, `Q1.`, `1)`, `Question 1:`). Tables are flattened to meaningless text. Instruction lines like "Answer any FIVE full questions" were being picked up as questions.

**Resolution:** Built a multi-strategy regex parser with three fallback patterns. Added a `skipPhrases` filter to reject instruction lines. Implemented sub-question detection (`a`, `b`, `c` parts) as separate documents. Added a final fallback that stores the full text as a single block rather than crashing. Table noise is tolerated since the LLM handles noisy text well.

---

### 3. HTTP Timeout on Large Papers
**Problem:** Analyzing 42 questions sequentially with 1-second delays between LLM calls takes 3–5 minutes. Express routes time out long before that, causing the frontend to show errors even when analysis was actually completing in the background.

**Resolution:** Changed `runAnalysis` to respond immediately with a 200 and then continue processing asynchronously in a background function. The frontend polls `/api/analysis/status/:paperId` every 3 seconds and navigates to results only when status becomes `completed`.

---

### 4. ESM vs CommonJS Conflicts
**Problem:** Vite scaffolds React projects as ES Modules (`"type": "module"` in package.json). Tailwind v4 auto-installed via `npx tailwindcss init` conflicted with shadcn/ui's validator which expected CommonJS config. The shadcn CLI consistently failed with "No Tailwind CSS configuration found" despite the file existing.

**Resolution:** Forced Tailwind v3 (`tailwindcss@3.4.19`), converted config to CommonJS (`.cjs` extension), and ultimately bypassed the shadcn CLI entirely — built all UI components (Button, Card, Badge, Input, Progress, Tabs) manually from scratch. This gave full control over the component code and avoided the CLI dependency entirely.

---

### 5. Git Merge Conflicts from Concurrent Editing
**Problem:** Teammate edited files directly on GitHub while local development continued simultaneously. Every `git pull` resulted in 30+ merge conflicts across all files. Rebase made it worse by stacking conflicts across multiple commits.

**Resolution:** Used `git push --force` to establish the local version as the source of truth. Established a workflow rule: teammate only edits documentation on GitHub directly, all code changes go through local → push. Set up separate git user configs on the same laptop so commits show on each contributor's profile independently.

---

### 6. LLM JSON Parsing Failures
**Problem:** Groq occasionally wraps JSON responses in markdown code fences (` ```json ... ``` `) or adds explanatory text before the JSON object, causing `JSON.parse()` to throw and the entire analysis run to fail.

**Resolution:** Added a `cleanJSON()` helper that strips markdown fences before parsing. Wrapped every LLM call in a `withRetry()` function that catches 429 rate limit errors and waits 15 seconds before retrying up to 3 times. Individual question failures are caught and saved without analysis rather than crashing the entire pipeline.

---

### 7. MongoDB `module.exports` Missing
**Problem:** After adding the `notes` field to `Question.js`, the file was accidentally saved without the `module.exports = mongoose.model(...)` line at the bottom, causing `Question.find is not a function` errors across all routes that used the model.

**Resolution:** Identified via the error stack trace pointing to `analysisController.js`. Added the missing export line. Established a checklist: every new model file must end with `module.exports = mongoose.model("ModelName", schema)`.

---

### 8. Dark Mode White Flash and Partial Coverage
**Problem:** On page reload, the app briefly shows white before React loads and applies the dark class, causing a flash. Some pages (Login, Register) rendered outside the main app layout and didn't pick up the dark background. Hardcoded `text-slate-800` classes were invisible on dark backgrounds.

**Resolution:** Added an inline script to `index.html` that reads `localStorage` and applies the `dark` class to `html` before React loads, eliminating the flash. Fixed standalone pages by explicitly adding `dark:bg-[hsl(230_25%_6%)]` to their outermost divs. Audited all components for hardcoded slate colors and added `dark:text-white` / `dark:text-slate-300` variants throughout.

---

### 9. Avatar Not Persisting After Logout
**Problem:** Profile avatar saved to MongoDB correctly but was lost after logout and re-login. The login response didn't include the `avatar` field, so the auth context received an incomplete user object and defaulted to null avatar.

**Resolution:** Updated both the login and register responses in `authController.js` to include `avatar` in the user object. Updated `getMe` to also return `avatar`. This ensures the complete user profile is available immediately after login without requiring a page reload.

---

### 10. Rate Limit on Groq During Analysis
**Problem:** Sending 42 LLM requests back-to-back hit Groq's per-minute rate limit partway through analysis, causing failures for later questions in the paper.

**Resolution:** Added a 1-second delay between each question's LLM call using `setTimeout`. Combined with the `withRetry()` function that waits 15 seconds on 429 errors, this keeps the request rate within Groq's free tier limits while still completing a full paper analysis in 3–5 minutes.

---

## Upcoming / Future Scope

- Deploy frontend to Vercel, backend to Render, database to MongoDB Atlas
- MongoDB Atlas Vector Search for textbook RAG — find relevant textbook passages per question
- OCR support for scanned or image-based PDFs
- Email notifications when analysis completes
- Year-over-year trend analysis across multiple papers
- Support for MCQ and numerical question formats
- Teacher dashboard for managing standardized syllabi
- Mobile app using React Native
