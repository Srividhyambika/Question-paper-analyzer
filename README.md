# Exam PYQ Analyzer

## Project Overview

The **Exam PYQ Analyzer** is an AI-driven platform designed to bridge the gap between static curriculum and actual examination patterns. By processing syllabus documents, textbooks, and previous year questions (PYQs), the system provides students and educators with deep insights into cognitive complexity and topic weightage.

---

## Stakeholders, Roles & Interactions

Following the Digital Pumpkin framework, we identify three primary entities that interact with the system:

### 1. Primary Stakeholders & Roles

| Stakeholder | Role |
|------------|------|
| **Students** | Primary users who upload materials to generate personalized study strategies and identify high-priority topics. |
| **Educators/Faculty** | Reviewers who use the tool to ensure exam papers align with the syllabus and assess if the difficulty level matches Bloom's Taxonomy standards. |
| **Academic Administrators** | Oversight roles that monitor long-term trends in paper difficulty and syllabus coverage across different academic years. |

### 2. Stakeholder Interactions

* **Student ↔ System**: The student provides the "Inputs" (PDFs) and receives "Visual Analytics" (Radar charts, Heatmaps) to guide their preparation.

* **Educator ↔ System**: The educator uses the "Out-of-Syllabus Detection" to validate the quality and fairness of the question bank.

* **System ↔ Content**: The backend logic links questions to specific textbook chapters and sections, creating a "Knowledge Graph" for the user.

---

## Problem Statement, Objectives & Core Features

### 1. Problem Statement

Students often struggle to identify which topics are "critically important" versus "supplementary" from a vast syllabus. Traditional preparation relies on manual analysis of old papers, which is time-consuming and fails to measure **Cognitive Complexity**—leading to students being surprised by "out-of-the-box" questions that require deep thinking rather than rote memorization.

### 2. Project Objectives

* **Automate Alignment**: Instantly match exam questions to specific syllabus units and textbook sections.

* **Quantify Complexity**: Move beyond "Easy/Hard" by assigning a numerical "Cognitive Load" score (1-10) to every question.

* **Identify Gaps**: Flag questions that are out-of-syllabus or not covered in the prescribed textbooks.

* **Strategic Planning**: Generate an AI-driven study plan that prioritizes topics based on exam frequency and complexity.

### 3. Core Features

* **Three-Way PDF Pipeline**: Concurrent processing of Question Papers, Syllabus, and Multi-Textbook uploads.

* **Bloom's Taxonomy Classifier**: Categorizes questions into levels: Remember, Understand, Apply, Analyze, Evaluate, and Create.

* **Cognitive Complexity Engine**: Analyzes thinking depth, distinguishing between algorithmic (procedural) and heuristic (insight-based) questions.

* **Conversational AI Agent**: A chat interface that allows users to query their specific exam data (e.g., "Show me all questions requiring synthesis from Unit 3").

---

## Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** - Modern, fast web framework
- **PostgreSQL** - Relational database for structured data
- **Google Gemini API** - LLM for intelligent analysis
- **pdfplumber** - PDF text extraction
- **LangChain** - AI agent orchestration framework
- **ChromaDB** - Vector database for semantic search
- **sentence-transformers** - Embeddings generation
- **SQLAlchemy** - ORM for database operations

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Axios** - HTTP client
- **Lucide React** - Icon library

---

## System Architecture
