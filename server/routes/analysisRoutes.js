const express = require("express");
const router = express.Router();
const { runAnalysis, getStatus, getResults, comparePapers } = require("../controllers/analysisController");
const Question = require("../models/Question");
const { protect } = require("../middleware/authMiddleware");
const Paper = require("../models/Paper");

const {
  generateTopicSummary,
  generatePredictedQuestions,
  generateMnemonics,
  generateStudySchedule,
} = require("../services/geminiService");

// GenAI endpoints
router.post("/genai/topic-summary/:paperId", protect, async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const [questions, analysisResult] = await Promise.all([
      Question.find({ paperId }),
      AnalysisResult.findOne({ paperId }),
    ]);
    const summary = await generateTopicSummary(questions, analysisResult);
    res.json({ summary });
  } catch (err) { next(err); }
});

router.post("/genai/predicted-questions/:paperId", protect, async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const [questions, paper] = await Promise.all([
      Question.find({ paperId }),
      Paper.findById(paperId),
    ]);
    const predictions = await generatePredictedQuestions(questions, paper);
    res.json({ predictions });
  } catch (err) { next(err); }
});

router.post("/genai/mnemonics/:paperId", protect, async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const questions = await Question.find({ paperId });
    const mnemonics = await generateMnemonics(questions);
    res.json({ mnemonics });
  } catch (err) { next(err); }
});

router.post("/genai/study-schedule/:paperId", protect, async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { examDate, hoursPerDay = 3 } = req.body;
    if (!examDate) {
      res.status(400);
      return next(new Error("examDate is required."));
    }
    const [questions, analysisResult] = await Promise.all([
      Question.find({ paperId }),
      AnalysisResult.findOne({ paperId }),
    ]);
    const schedule = await generateStudySchedule(questions, analysisResult, examDate, hoursPerDay);
    res.json({ schedule });
  } catch (err) { next(err); }
});

router.post("/run/:paperId", runAnalysis);
router.get("/status/:paperId", getStatus);
router.get("/results/:paperId", getResults);
router.get("/compare", comparePapers);
router.patch("/question/:questionId/notes", protect, async (req, res, next) => {
  try {
    const { notes } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      { notes },
      { new: true }
    );
    res.json({ notes: question.notes });
  } catch (err) { next(err); }
});

module.exports = router;
