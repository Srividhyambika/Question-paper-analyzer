const mongoose = require("mongoose");

// Stores structured topics extracted from the syllabus PDF
// Used for matching each question against syllabus coverage

const syllabusSchema = new mongoose.Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    rawText: {
      type: String,            // Full extracted text, kept for fallback
    },
    units: [
      {
        unitNumber: Number,
        unitTitle: String,
        topics: [String],      // ["Binary Trees", "AVL Trees", "Heaps"]
        learningOutcomes: [String],
      },
    ],
    allTopics: {
      type: [String],          // Flat list for quick LLM matching
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);