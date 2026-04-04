const Paper = require("../models/Paper");
const Question = require("../models/Question");
const AnalysisResult = require("../models/AnalysisResult");
const Syllabus = require("../models/Syllabus");
const { analyzeQuestion, generateSummary } = require("../services/geminiService");
const { parseQuestionPaper, deleteFile } = require("../services/pdfService");

// POST /api/analysis/run/:paperId
const runAnalysis = async (req, res, next) => {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);
    if (!paper) {
      res.status(404);
      return next(new Error("Paper not found."));
    }

    await Paper.findByIdAndUpdate(paperId, { status: "processing" });

    // Get syllabus topics
    const syllabus = await Syllabus.findOne({ paperId });
    const syllabusTopics = syllabus?.allTopics || [];

    // Re-parse questions
    const { questions: parsedQuestions } = await parseQuestionPaper(paper.questionPaperPath);

    // Clear previous questions
    await Question.deleteMany({ paperId });

    // Respond immediately — analysis runs in background
    res.json({
      message: "Analysis started. This takes 2-3 minutes for a full paper.",
      totalQuestions: parsedQuestions.length,
    });

    // ── Background analysis ─────────────────────────────────────────────────
    // Runs after response is sent — avoids HTTP timeout on large papers
    const analyzeInBackground = async () => {
      const savedQuestions = [];

      for (const q of parsedQuestions) {
        if (!q.questionText || q.questionText.trim().length < 10) continue;

        try {
          console.log(`Analyzing ${q.questionNumber}...`);
          const analysis = await analyzeQuestion(q.questionText, syllabusTopics, q.questionNumber);

          const saved = await Question.create({
            paperId,
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            marks: q.marks || 0,
            syllabusMatch: analysis.syllabusMatch,
            isOutOfSyllabus: analysis.isOutOfSyllabus,
            difficulty: analysis.difficulty,
            bloomsLevel: analysis.bloomsLevel,
            cognitiveComplexity: analysis.cognitiveComplexity,
          });

          savedQuestions.push(saved);

          // Small delay between calls to stay within rate limits
          await new Promise((res) => setTimeout(res, 1000));

        } catch (err) {
          console.error(`Failed to analyze ${q.questionNumber}:`, err.message);
          // Save question without analysis rather than failing entire run
          const saved = await Question.create({
            paperId,
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            marks: q.marks || 0,
          });
          savedQuestions.push(saved);
        }
      }

      // Generate and save summary
      try {
        const summaryData = await generateSummary(savedQuestions, syllabusTopics);
        if (summaryData) {
          await AnalysisResult.findOneAndUpdate(
            { paperId },
            { paperId, ...summaryData },
            { upsert: true, new: true }
          );
        }
      } catch (err) {
        console.error("Summary generation failed:", err.message);
      }

      deleteFile(paper.questionPaperPath);
      deleteFile(paper.syllabusPath);
      paper.textbookPaths?.forEach((p) => deleteFile(p));
      
      await Paper.findByIdAndUpdate(paperId, { status: "completed" });
      console.log(`Analysis complete for paper ${paperId}`);
    };

    analyzeInBackground();

  } catch (err) {
    await Paper.findByIdAndUpdate(req.params.paperId, { status: "failed" });
    next(err);
  }
};

// Keep the rest of the controller functions unchanged
const getStatus = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.paperId).select("status title");
    if (!paper) {
      res.status(404);
      return next(new Error("Paper not found."));
    }
    res.json({ status: paper.status, title: paper.title });
  } catch (err) {
    next(err);
  }
};

const getResults = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const [paper, questions, analysisResult, syllabus] = await Promise.all([
      Paper.findById(paperId),
      Question.find({ paperId }),
      AnalysisResult.findOne({ paperId }),
      Syllabus.findOne({ paperId }).select("allTopics units"),
    ]);
    if (!paper) {
      res.status(404);
      return next(new Error("Paper not found."));
    }
    res.json({ paper, questions, analysisResult, syllabus });
  } catch (err) {
    next(err);
  }
};

const comparePapers = async (req, res, next) => {
  try {
    const ids = req.query.ids?.split(",");
    if (!ids || ids.length < 2) {
      res.status(400);
      return next(new Error("Provide at least 2 paper IDs to compare."));
    }
    const results = await Promise.all(
      ids.map(async (id) => {
        const [paper, analysisResult] = await Promise.all([
          Paper.findById(id).select("title year subject totalQuestions totalMarks"),
          AnalysisResult.findOne({ paperId: id }),
        ]);
        return { paper, analysisResult };
      })
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = { runAnalysis, getStatus, getResults, comparePapers };