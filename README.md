# Exam PYQ Analyzer

An AI-powered exam question paper analyzer built on the MERN stack. Upload a question paper, syllabus, and textbooks — the system extracts and parses all questions, analyzes each one using a large language model, and delivers a comprehensive report covering syllabus coverage, difficulty, Bloom's Taxonomy, and cognitive complexity.

The project deliberately demonstrates three distinct AI paradigms within one application: **LLM-based structured classification**, **Generative AI** for open-ended content, and **Agentic AI** for autonomous tool-based reasoning.

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Full Stack — MERN setup, PDF upload & parsing, authentication, React UI | ✅ Complete |
| Phase 2 | LLM Integration — Groq API, syllabus matching, difficulty & Bloom's analysis | ✅ Complete |
| Phase 3 | AI Agent + GenAI — tool-based agent, generative features, study strategy | ✅ Complete |

---

## AI Feature Classification

This project separates three AI paradigms clearly across the Analysis page tabs:

| Feature | AI Type | Why |
|---------|---------|-----|
| Difficulty classification | LLM-Based | Fixed output space (easy/medium/hard), deterministic, temp 0.1 |
| Bloom's Taxonomy detection | LLM-Based | Fixed 6-level taxonomy, structured JSON, temp 0.1 |
| Cognitive complexity scoring | LLM-Based | Fixed 1-10 scale with defined categories, temp 0.1 |
| Syllabus matching | LLM-Based | Binary match with confidence score, temp 0.1 |
| Out-of-syllabus detection | LLM-Based | Derived from confidence threshold (< 40%) |
| AI insights paragraph | Generative AI | Open-ended text, different each run, temp 0.4 |
| Topic-wise summary | Generative AI | Novel narrative synthesis across topics, temp 0.5 |
| Predicted exam questions | Generative AI | Creative generation based on gap patterns, temp 0.7 |
| Memory mnemonics | Generative AI | Highest creativity, unique each run, temp 0.8 |
| Study schedule | Generative AI | Personalised to user inputs, adaptive, temp 0.4 |
| Agent intent detection | Agentic AI | Model autonomously selects tool, temp 0.1 |
| Agent response generation | Agentic AI | Two-step: tool execution then language generation |
| Conversational memory | Agentic AI | Context maintained across turns in session |

---

## What It Does

### Core Pipeline
- Upload three PDFs: question paper, syllabus, and one or more textbooks
- Automatically extracts and segments individual questions and sub-questions (Q1a, Q1b, Q1c)
- Parses syllabus into structured units and topic lists
- Chunks textbook content into 500-word passages for RAG
- Runs every question through Groq LLM in a single structured prompt
- Stores all results in MongoDB and displays them in an interactive dashboard
- Automatically deletes uploaded PDFs after analysis — only extracted text retained

### LLM-Based Analysis (Charts Tab)
- Syllabus matching with confidence score (0–100%)
- Out-of-syllabus detection when confidence < 40%
- Difficulty: Easy / Medium / Hard
- Bloom's Taxonomy: L1 Remember → L6 Create
- Cognitive complexity score (1–10) with thinking type and reasoning
- Bloom's pie chart, difficulty bar chart, cognitive complexity radar chart

### Generative AI Features (AI Insights Tab)
- **Topic-wise Summary** — narrative breakdown of what each topic tests
- **Predicted Exam Questions** — 5 AI-predicted questions based on gap analysis and patterns
- **Memory Mnemonics** — custom memory tricks and mental models for hard questions
- **Study Schedule** — personalised day-by-day plan based on exam date and available hours

### Agentic AI (Agent Tab)
- Tool-based intent detection — LLM picks the right tool automatically
- 7 tools: difficulty filter, syllabus gaps, Bloom's breakdown, out-of-syllabus, paper summary, study plan, paper comparison
- Conversational memory across messages within a session
- Tool label shown above each response
- Floating global AI assistant available on every page (general study help)

### Generative AI Panel (GenAI)
- Topic-wise Summary: AI-generated approach guides for every topic identified in the paper.
- Next Exam Predictions: Predicts likely questions based on identified topic gaps and historical patterns.
- Memory Tricks & Mnemonics: Generates custom mental models and mnemonics for complex concepts.
- Personalized Study Schedule: Users input their exam date and available study hours to generate a day-by-day plan.
- PDF Export: Integrated jsPDF logic allows users to download their personalized study schedules as professionally formatted PDFs.

### Authentication & Security
- JWT-based authentication with 7-day token expiry
- Role-based access: Student and Admin
- Passwords hashed with bcrypt (12 salt rounds) — invisible in MongoDB
- Password strength meter: Weak / Medium / Strong with live rule checklist
- Regex validation: uppercase, lowercase, number, special character, minimum 8 characters
- Password cannot match username or date of birth (multiple format checks)
- Copy-paste disabled on password fields
- Rate limiting: 100 requests/15 min globally, 10/15 min on auth routes
- Input sanitization strips prompt injection attempts before LLM processing

### Admin & Analytics
- Visitor session tracking (start/end, duration)
- Admin dashboard: total visits, average time spent, visits per day chart, user count
- Stats auto-refresh every 30 seconds

### Profile & Personalisation
- SVG character avatars: Kung Fu Panda, Monkey King, Ninja Turtle, Spider-Man, Batman
- Initials fallback with consistent color per username
- Username update with duplicate check
- Avatar persists across sessions

### UI & Experience
- Animated landing page: scroll animations, stat counters, how-it-works, sample cards, FAQ
- Neon dark mode with deep background and glowing card/button effects
- Light/dark toggle with localStorage persistence — no flash on reload
- Toast notifications for all key actions
- Loading skeleton on analysis page
- Expandable question cards with complexity bars, search, filter
- Notes field per question (saved to MongoDB)
- PDF export with preview modal and download
- Print-friendly layout (always renders in light mode)
- Custom 404 and 500 error pages

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS v3, Recharts, React Query, React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB (local via MongoDB Community Server) |
| LLM | Groq API — Llama 3.3 70B Versatile (only external service) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| PDF Parsing | pdf-parse |
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
│   │   │   ├── ui/                  # Button, Card, Badge, Input, Progress,
│   │   │   │                        # Tabs, Avatar, Tooltip, Skeleton
│   │   │   ├── upload/              # UploadZone, UploadProgress
│   │   │   ├── dashboard/           # SummaryCard, QuestionTable, TopicsCoverage,
│   │   │   │                        # ExportReport, AnalysisSkeleton, GenAIPanel
│   │   │   ├── charts/              # BloomsChart, DifficultyChart, ComplexityRadar
│   │   │   ├── agent/               # AgentChat, FloatingAgent
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Animated public landing page
│   │   │   ├── Login.jsx            # Split-panel with illustration
│   │   │   ├── Register.jsx         # Split-panel with live password meter
│   │   │   ├── Home.jsx             # PDF upload page
│   │   │   ├── Analysis.jsx         # Results dashboard (LLM / GenAI / Agent tabs)
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
│   │   │   └── api.js               # All Axios calls
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
    │   ├── Question.js              # notes field included
    │   ├── Syllabus.js
    │   ├── Textbook.js
    │   ├── AnalysisResult.js
    │   ├── User.js                  # avatar field included
    │   └── VisitorLog.js
    ├── routes/
    │   ├── uploadRoutes.js
    │   ├── analysisRoutes.js        # includes GenAI endpoints + notes PATCH
    │   ├── authRoutes.js            # includes profile PATCH
    │   ├── adminRoutes.js
    │   └── agentRoutes.js           # includes /chat endpoint
    ├── services/
    │   ├── pdfService.js            # parsing + auto-delete
    │   ├── geminiService.js         # LLM + GenAI via Groq
    │   └── agentService.js          # tool-based agent
    └── utils/
        ├── passwordUtils.js
        └── sanitize.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Community Server running locally on port 27017
- Groq API key (free at console.groq.com)
- MongoDB Compass (optional)

### 1. Start MongoDB
```bash
mkdir -p ~/data/db
mongod --dbpath ~/data/db
```
Keep this terminal open.

### 2. Backend
```bash
cd server
npm install
npm run dev
```
Runs on `http://localhost:5001`

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

---


## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register with password validation |
| POST | `/api/auth/login` | Public | Login, returns JWT + avatar |
| GET | `/api/auth/me` | Protected | Get current user profile |
| PATCH | `/api/auth/profile` | Protected | Update username and avatar |

### Upload
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload` | Protected | Upload 3 PDFs, parse, store |
| GET | `/api/upload/history` | Protected | All past uploads |
| DELETE | `/api/upload/:id` | Protected | Delete paper and all related data |

### Analysis — LLM
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/analysis/run/:paperId` | Protected | Trigger async LLM analysis |
| GET | `/api/analysis/status/:paperId` | Protected | Poll processing status |
| GET | `/api/analysis/results/:paperId` | Protected | Full results |
| GET | `/api/analysis/compare?ids=id1,id2` | Protected | Compare two papers |
| PATCH | `/api/analysis/question/:id/notes` | Protected | Save question notes |

### Analysis — Generative AI
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/analysis/genai/topic-summary/:paperId` | Protected | Generate topic-wise summary |
| POST | `/api/analysis/genai/predicted-questions/:paperId` | Protected | Generate predicted questions |
| POST | `/api/analysis/genai/mnemonics/:paperId` | Protected | Generate memory tricks |
| POST | `/api/analysis/genai/study-schedule/:paperId` | Protected | Generate study schedule |

### Agent
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/agent/query` | Protected | Query agent about a paper |
| POST | `/api/agent/chat` | Protected | General AI study assistant |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin only | Visitor analytics |
| POST | `/api/admin/visit/start` | Public | Log session start |
| POST | `/api/admin/visit/end` | Public | Log session end + duration |

---

## Agent Tools

| Tool | Trigger Examples | Returns |
|------|-----------------|---------|
| `get_questions_by_difficulty` | "Show hard questions", "Filter by complexity > 7" | Filtered question list |
| `get_syllabus_gaps` | "Which topics are missing?", "Show coverage gaps" | topicsCovered, topicsNotCovered |
| `get_blooms_breakdown` | "Show Bloom's distribution", "How many apply-level questions?" | Distribution + questions by level |
| `get_out_of_syllabus` | "Any out-of-syllabus questions?" | Count + question details |
| `get_paper_summary` | "Overall difficulty?", "Summarize this paper" | All stats + insights |
| `generate_study_plan` | "Create a study plan", "What should I focus on?" | Priority topics + strategy |
| `compare_papers` | "Compare with 2023", "Year-over-year comparison" | Both papers' stats side by side |

---

## Password Rules

| Rule | Check |
|------|-------|
| Minimum 8 characters | `password.length >= 8` |
| Uppercase letter | `/[A-Z]/` |
| Lowercase letter | `/[a-z]/` |
| Number | `/[0-9]/` |
| Special character | `/[!@#$%^&*()_+...]/ ` |
| Not matching username | `password.toLowerCase() !== username.toLowerCase()` |
| Not containing DOB | Checked against YYYY-MM-DD, YYYYMMDD, DDMMYYYY, MMDD formats |

Strength: score ≤ 3 → Weak / 4–5 → Medium / 6–7 → Strong

---

## MongoDB Collections

```
users              — credentials (hashed), role, DOB, avatar
visitorlogs        — session start/end/duration
papers             — upload metadata, async pipeline status
syllabuses         — structured units and flat topic list
textbooks          — 500-word chunks with overlap (RAG-ready)
questions          — full LLM analysis per sub-question + user notes
analysisresults    — pre-aggregated chart data + AI insights
```

---

## Major Challenges & Resolutions

### 1. Gemini API Quota — Switched to Groq
The Google Gemini API returned 429 errors with `limit: 0` on the free tier for `gemini-2.0-flash`. Resolved by switching to Groq API (Llama 3.3 70B) which offers a generous free tier with no daily limits and faster inference. Only the SDK and model name needed changing.

### 2. PDF Parsing Inconsistencies
`pdf-parse` extracts unstructured raw text. Question papers use many numbering formats; tables are flattened; instruction lines were being picked up as questions. Resolved with a multi-strategy regex parser (3 fallback patterns), a `skipPhrases` filter, sub-question detection for a/b/c parts, and a full-text fallback to prevent crashes.

### 3. HTTP Timeout on Large Papers
Analyzing 42 questions sequentially takes 3–5 minutes — far beyond Express timeout. Resolved by responding with HTTP 200 immediately and running analysis in a background async function. Frontend polls `/status` every 3 seconds and navigates only on completion.

### 4. ESM vs CommonJS Conflicts
Vite scaffolds projects as ES Modules but shadcn CLI expected CommonJS Tailwind config. Resolved by forcing Tailwind v3, and building all UI components (Button, Card, Badge, etc.) manually — bypassing the shadcn CLI entirely.

### 5. Git Merge Conflicts
Teammate editing files directly on GitHub caused 30+ conflicts on every pull. Resolved with `git push --force` to establish local as source of truth, and a rule: code changes through local → push only, documentation edits only on GitHub.

### 6. LLM JSON Parsing Failures
Groq occasionally wraps JSON in markdown fences or adds preamble text. Resolved with a `cleanJSON()` helper that strips fences before parsing, and a `withRetry()` wrapper that handles 429 errors with a 15-second wait and up to 3 retries.

### 7. Missing `module.exports` in Question Model
After adding the `notes` field, the file was saved without `module.exports = mongoose.model(...)`, causing `Question.find is not a function` across all routes. Identified via stack trace, resolved by adding the missing export line.

### 8. Dark Mode White Flash and Partial Coverage
Page reload briefly showed white before React applied the dark class. Standalone pages (Login, Register) didn't inherit the dark background. Resolved by adding an inline script to `index.html` that reads localStorage and applies the dark class before React loads, and explicitly adding `dark:bg-[hsl(...)]` to standalone page wrappers.

### 9. Avatar Not Persisting After Logout
Avatar was saved to MongoDB but lost on re-login because the login response didn't include `avatar`. Resolved by updating both login and register responses in `authController.js` to include the full user profile including avatar.

### 10. Rate Limiting on Groq During Analysis
Sending 42 LLM requests back-to-back hit Groq's per-minute limit mid-analysis. Resolved by adding a 1-second delay between question calls combined with the `withRetry()` function, keeping requests within free tier limits while completing a full paper in under 5 minutes.

---

## Future Scope

- Deploy frontend to Vercel, backend to Render, database to MongoDB Atlas
- MongoDB Atlas Vector Search for true textbook RAG with chapter/page references
- OCR support for scanned or image-based PDFs (Tesseract.js)
- Multi-year trend analysis across 5+ papers
- Email notifications when analysis completes
- React Native mobile app
- Teacher dashboard for institutional syllabus management
- Export analysis to LMS platforms (Moodle, Google Classroom)
