# Exam PYQ Analyzer

An AI-powered application that analyzes exam question papers to determine syllabus coverage, difficulty levels, and cognitive complexity requirements.

## Features

- PDF Upload: Question papers, syllabus, and textbooks
- Syllabus Matching: Identifies out-of-syllabus questions
- Cognitive Complexity Analysis: Assesses thinking depth required
- Bloom's Taxonomy Classification: Categorizes cognitive levels
- Visual Analytics: Charts and graphs for insights
- AI-Powered: Uses Google Gemini for intelligent analysis

## Tech Stack

### Backend
- Python 3.10+
- FastAPI
- PostgreSQL
- Google Gemini API
- pdfplumber
- LangChain
- SQLAlchemy

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts
- Axios

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Google Gemini API Key


## Project Structure
```
exam-pyq-analyzer/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## License

MIT

## Contributors

Gubba Sri Vidyambika
Anoushka Karra
