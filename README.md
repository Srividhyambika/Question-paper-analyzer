# Exam PYQ Analyzer

An AI-powered application that analyzes exam question papers to determine syllabus coverage, difficulty levels, and cognitive complexity requirements.

##  Week 1 Progress: Project Foundations
* **MERN Scaffolding:** Initialized React (Vite) and Node/Express environments.
* **Database Design:** Created Mongoose schema for `Analysis` to handle Question Papers, Syllabuses, and Textbooks.
* **File Upload UI:** Developed a triple-file upload component with state management.
* **PDF Processing:** Integrated `pdf-parse` for backend text extraction.

## Features
- **Triple PDF Upload:** Simultaneous processing of Question Papers, Syllabuses, and Textbooks.
- **Syllabus Matching:** Automatically identifies out-of-syllabus questions.
- **Cognitive Complexity Analysis:** Assesses thinking depth (Surface vs. Deep Analysis).
- **Bloom's Taxonomy Classification:** Categorizes questions from "Remember" to "Create."
- **Visual Analytics:** Interactive charts and heatmaps for syllabus coverage.
- **AI Agent:** Uses Google Gemini for intelligent cross-referencing and recommendations.

## Tech Stack

### Backend
- **Node.js & Express:** Core server logic (Express & Node).
- **MongoDB & Mongoose:** NoSQL database for storing extracted text and analysis results.
- **Google Gemini API:** LLM for cognitive and syllabus analysis.
- **pdf-parse:** Server-side PDF text extraction.
- **Multer:** Middleware for handling multipart/form-data file uploads.

### Frontend
- **React 18:** Component-based UI logic.
- **Vite:** Next-generation frontend tooling.
- **Tailwind CSS:** Utility-first styling for a professional dashboard.
- **Recharts:** For visual representation of difficulty and complexity.
- **Axios:** For seamless API communication.

## Project Structure
```text
exam-analyzer/
├── client/              # React Frontend
│   ├── src/
│   │   ├── api/         # Axios configuration
│   │   ├── components/  # UI Components (FileUpload.jsx)
│   │   ├── App.jsx      # Main application entry
│   │   └── index.css    # Tailwind directives
│   └── package.json
├── server/              # Node.js Backend
│   ├── models/          # Mongoose Schemas (Analysis.js)
│   ├── utils/           # PDF extraction utilities (pdfExtractor.js)
│   ├── index.js         # Express server entry point
│   ├── .env             # Environment variables (Database/API keys)
│   └── package.json
└── README.md
```

## License

MIT

## Contributors

Gubba Sri Vidyambika, 
Anoushka Karra
## Contributors

Gubba Sri Vidyambika, 
Anoushka Karra
