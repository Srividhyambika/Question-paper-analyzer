const mongoose = require("mongoose");

// One document per question extracted from the paper
// This is the richest schema — stores all LLM analysis output

const questionSchema = new mongoose.Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    questionNumber: {
      type: String,            // "Q1", "Q2(a)", "Q3(b)(ii)" etc.
    },
    questionText: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      default: 0,
    },

    // --- Syllabus Matching ---
    syllabusMatch: {
      matched: { type: Boolean, default: false },
      topic: { type: String, default: "" },
      unit: { type: String, default: "" },
      confidence: { type: Number, default: 0 }, // 0-100
    },
    isOutOfSyllabus: {
      type: Boolean,
      default: false,
    },

    // --- Difficulty ---
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    // --- Bloom's Taxonomy ---
    bloomsLevel: {
      level: { type: Number, min: 1, max: 6 },
      label: { type: String }, // "Remember", "Understand", "Apply" etc.
    },

    // --- Cognitive Complexity ---
    cognitiveComplexity: {
      score: { type: Number, min: 1, max: 10 },
      thinkingType: {
        type: String,
        enum: ["convergent", "divergent", "analytical", "integrative", "evaluative"],
      },
      depthCategory: {
        type: String,
        enum: ["surface", "intermediate", "deep", "complex"],
      },
      reasoning: { type: String }, // LLM's justification
    },

    // --- Textbook Reference (from RAG) ---
    textbookReference: {
      found: { type: Boolean, default: false },
      chapterTitle: { type: String },
      relevantPassage: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);