const path = require("path");
const Paper = require("../models/Paper");
const Syllabus = require("../models/Syllabus");
const Textbook = require("../models/Textbook");
const { parseQuestionPaper, parseSyllabus, parseTextbook } = require("../services/pdfService");

// POST /api/upload
// Accepts: questionPaper (1), syllabus (1), textbooks (1-5)
// Creates Paper + Syllabus + Textbook documents, returns paperId

const uploadPDFs = async (req, res, next) => {
  try {
    const { title, year, subject } = req.body;
    const files = req.files;

    const questionPaperFile = files.questionPaper[0];
    const syllabusFile = files.syllabus[0];
    const textbookFiles = files.textbooks;

    // ── 1. Create Paper record ──────────────────────────────────────────────
    const paper = await Paper.create({
      title: title || questionPaperFile.originalname,
      year: year ? parseInt(year) : null,
      subject: subject || "",
      questionPaperPath: questionPaperFile.path,
      syllabusPath: syllabusFile.path,
      textbookPaths: textbookFiles.map((f) => f.path),
      status: "processing",
    });

    // ── 2. Parse question paper ─────────────────────────────────────────────
    const { rawText: qpRaw, questions } = await parseQuestionPaper(questionPaperFile.path);

    paper.totalQuestions = questions.length;
    paper.totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    await paper.save();

    // ── 3. Parse syllabus ───────────────────────────────────────────────────
    const { rawText: sylRaw, units, allTopics } = await parseSyllabus(syllabusFile.path);

    await Syllabus.create({
      paperId: paper._id,
      rawText: sylRaw,
      units,
      allTopics,
    });

    // ── 4. Parse textbooks ──────────────────────────────────────────────────
    for (const tbFile of textbookFiles) {
      const { title: tbTitle, chunks } = await parseTextbook(
        tbFile.path,
        tbFile.originalname
      );
      await Textbook.create({
        paperId: paper._id,
        title: tbTitle,
        chunks,
      });
    }

    // ── 5. Respond — analysis triggered separately ──────────────────────────
    res.status(201).json({
      message: "Upload successful. Ready for analysis.",
      paperId: paper._id,
      questionsFound: questions.length,
      syllabusTopics: allTopics.length,
      textbooksProcessed: textbookFiles.length,
      // Send questions back so frontend can preview before analysis
      questions,
    });

  } catch (err) {
    next(err);
  }
};

// GET /api/upload/history
// Returns all past uploads for the history page

const getUploadHistory = async (req, res, next) => {
  try {
    const papers = await Paper.find()
      .sort({ createdAt: -1 })
      .select("title year subject status totalQuestions totalMarks createdAt");
    res.json(papers);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/upload/:id
// Removes a paper and all related documents

const deletePaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Paper = require("../models/Paper");
    const Question = require("../models/Question");
    const AnalysisResult = require("../models/AnalysisResult");

    await Promise.all([
      Paper.findByIdAndDelete(id),
      Syllabus.deleteMany({ paperId: id }),
      Textbook.deleteMany({ paperId: id }),
      Question.deleteMany({ paperId: id }),
      AnalysisResult.deleteOne({ paperId: id }),
    ]);

    res.json({ message: "Paper and all related data deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadPDFs, getUploadHistory, deletePaper };