# Exam PYQ Analyzer

An AI-powered exam question paper analyzer built on the MERN stack. Upload a question paper, syllabus, and textbooks — the system extracts and parses all questions, stores them in MongoDB, and prepares them for LLM-powered analysis.

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Full Stack — MERN setup, PDF upload & parsing, authentication, React UI | Complete |
| Phase 2 | LLM Integration — Gemini API, syllabus matching, difficulty & Bloom's analysis | In Progress |
| Phase 3 | AI Agent — LangChain.js agent, conversational interface, year-over-year comparison | Upcoming |

---

## What It Does (Phase 1)

### Core Features
- Upload three PDFs: question paper, syllabus, and one or more textbooks
- Extracts and segments individual questions (including sub-questions like Q1a, Q1b, Q1c)
- Parses syllabus into structured units and topic lists
- Chunks textbook content for RAG (Retrieval Augmented Generation) in Phase 2
- Stores everything in MongoDB with full relational structure
- Displays extracted questions in a results dashboard
- Upload history with status tracking and delete functionality
- Paper comparison view (side-by-side, enhanced in Phase 3)

### Authentication & Security
- JWT-based authentication (register, login, logout)
- Role-based access control — Student and Admin roles
- Password shown as dots, copy-paste disabled in password fields
- Passwords hashed with bcrypt (12 salt rounds) — never stored in plaintext, invisible even in MongoDB
- Password strength classification: Weak / Medium / Strong with live meter
- Real-time password rule checklist (uppercase, lowercase, number, special character, min length)
- Regex-based password validation enforced on both frontend and backend
- Password cannot match username or date of birth
- Protected routes — unauthenticated users redirected to login
- Admin-only routes — non-admin users redirected to home

### Visitor Analytics (Admin Dashboard)
- Total visit count across all sessions
- Average time spent per session (formatted as Xm Ys)
- Total registered users
- Visits per day chart (last 7 days)
- Stats refresh automatically every 30 seconds

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, shadcn/ui, Recharts, React Query |
| Backend | Node.js + Express |
| Database | MongoDB (local via MongoDB Community Server) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| PDF Parsing | pdf-parse |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## Project Structure

```
exam-analyzer/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Card, Badge, Input, Progress, Tabs
│   │   │   ├── upload/              # UploadZone, UploadProgress
│   │   │   ├── dashboard/           # SummaryCard, QuestionTable
│   │   │   ├── charts/              # BloomsChart, DifficultyChart
│   │   │   ├── agent/               # AgentChat (stub for Phase 3)
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx   # ProtectedRoute, AdminRoute
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Upload page
│   │   │   ├── Analysis.jsx         # Results dashboard
│   │   │   ├── History.jsx          # Past uploads
│   │   │   ├── Compare.jsx          # Side-by-side paper comparison
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx         # With live password strength meter
│   │   │   ├── AdminDashboard.jsx   # Visitor stats
│   │   │   └── NotFound.jsx
│   │   ├── store/
│   │   │   ├── authContext.jsx      # AuthProvider + AuthContext
│   │   │   └── useAuth.js           # useAuth hook
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API calls
│   │   └── lib/
│   │       └── utils.js             # cn() utility
│   └── package.json
│
└── server/                          # Express backend
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   └── multer.js                # PDF upload config
    ├── controllers/
    │   ├── uploadController.js
    │   ├── analysisController.js
    │   ├── authController.js        # register, login, getMe
    │   ├── adminController.js       # visitor stats, session tracking
    │   └── agentController.js       # stub for Phase 3
    ├── middleware/
    │   ├── authMiddleware.js        # protect, adminOnly
    │   ├── errorHandler.js
    │   └── validateUpload.js
    ├── models/
    │   ├── Paper.js
    │   ├── Question.js
    │   ├── Syllabus.js
    │   ├── Textbook.js
    │   ├── AnalysisResult.js
    │   ├── User.js                  # username, dob, hashed password, role
    │   └── VisitorLog.js            # session start/end, duration
    ├── routes/
    │   ├── uploadRoutes.js
    │   ├── analysisRoutes.js
    │   ├── authRoutes.js
    │   ├── adminRoutes.js
    │   └── agentRoutes.js
    ├── services/
    │   └── pdfService.js
    ├── utils/
    │   └── passwordUtils.js         # validatePassword, classifyStrength
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Community Server running locally on port 27017
- MongoDB Compass (optional, for visual DB inspection)

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

### Upload
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload` | Protected | Upload question paper + syllabus + textbooks |
| GET | `/api/upload/history` | Protected | Get all past uploads |
| DELETE | `/api/upload/:id` | Protected | Delete a paper and all related data |

### Analysis
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/analysis/run/:paperId` | Protected | Trigger analysis |
| GET | `/api/analysis/status/:paperId` | Protected | Get processing status |
| GET | `/api/analysis/results/:paperId` | Protected | Get full results |
| GET | `/api/analysis/compare?ids=id1,id2` | Protected | Compare two papers |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin only | Visitor analytics |
| POST | `/api/admin/visit/start` | Public | Start session tracking |
| POST | `/api/admin/visit/end` | Public | End session + record duration |

### Agent
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/agent/query` | Protected | Query AI agent (Phase 3) |

---

## Password Rules

| Rule | Requirement |
|------|-------------|
| Length | Minimum 8 characters |
| Uppercase | At least one uppercase letter (A-Z) |
| Lowercase | At least one lowercase letter (a-z) |
| Number | At least one digit (0-9) |
| Special character | At least one of `!@#$%^&*` etc. |
| Username | Must not match username |
| Date of birth | Must not contain DOB in any common format |

**Strength classification:**
- **Weak** — score ≤ 3 (fails most rules)
- **Medium** — score 4–5 (passes basic rules)
- **Strong** — score 6–7 (long, complex, all rules passed)

---

## MongoDB Collections

```
users              — credentials (hashed), role, DOB
visitorlogs        — session start/end, duration per visit
papers             — upload metadata, processing status
syllabuses         — structured units and topic lists
textbooks          — chunked content for RAG
questions          — one document per sub-question
analysisresults    — aggregated summary (populated in Phase 2)
```

---

## PDF Parsing Notes

- Question segmentation supports formats: `Q.01`, `Q1`, `Q1.`, `Q 1`, `Question 1`, `1.`, `1)`
- Zero-padded numbers (`Q01`, `Q02`) are handled correctly
- Sub-questions (`a`, `b`, `c`) are detected and stored separately (e.g. `Q1a`, `Q1b`, `Q1c`)
- Instruction lines ("Answer any FIVE...") are automatically filtered out
- Tables in PDFs are flattened to text by `pdf-parse` — handled gracefully by the LLM in Phase 2
- If segmentation fails, full text is stored as a single block (fallback)

---

## Upcoming (Phase 2)

- Gemini API integration for per-question analysis
- Syllabus matching with confidence scoring (0–100%)
- Difficulty classification: Easy / Medium / Hard
- Bloom's Taxonomy level detection (L1–L6): Remember, Understand, Apply, Analyze, Evaluate, Create
- Cognitive complexity scoring (1–10) with thinking type classification
- Textbook RAG with MongoDB Atlas Vector Search
- Full results dashboard with Bloom's pie chart and difficulty bar chart

---

## Contributers
Anoushka Karra, Srividhyambika Gubba