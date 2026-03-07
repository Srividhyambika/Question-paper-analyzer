const Paper = require("../models/Paper");
const Question = require("../models/Question");
const AnalysisResult = require("../models/AnalysisResult");
const Syllabus = require("../models/Syllabus");
const { parseQuestionPaper } = require("../services/pdfService");

// POST /api/analysis/run/:paperId
// Triggers full LLM analysis — placeholder until geminiService is built

const runAnalysis = async (req, res, next) => {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);
    if (!paper) {
      res.status(404);
      return next(new Error("Paper not found."));
    }

    // Re-parse questions from stored PDF
    const { questions } = await parseQuestionPaper(paper.questionPaperPath);
    const syllabus = await Syllabus.findOne({ paperId });

    // Save questions to DB (without LLM analysis for now — that comes in Phase 2)
    await Question.deleteMany({ paperId }); // clear any previous run

    const questionDocs = questions
  .filter((q) => q.questionText && q.questionText.trim().length > 0)
  .map((q) => ({
    paperId,
    questionNumber: q.questionNumber,
    questionText: q.questionText.trim(),
    marks: q.marks || 0,
  }));

if (questionDocs.length > 0) {
  await Question.insertMany(questionDocs);
}

    await Question.insertMany(questionDocs);

    await Paper.findByIdAndUpdate(paperId, { status: "completed" });

    res.json({
      message: "Questions stored. LLM analysis coming in Phase 2.",
      questionsStored: questionDocs.length,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/analysis/status/:paperId
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

// GET /api/analysis/results/:paperId
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

// GET /api/analysis/compare?ids=id1,id2
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