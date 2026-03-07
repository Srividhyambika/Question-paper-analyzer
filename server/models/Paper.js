const mongoose = require("mongoose");

// Top-level record created when user uploads the 3 PDFs
// Everything else (questions, syllabus, textbook) references this by paper_id

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,         // e.g. "CS301 - 2023 End Sem"
    },
    year: {
      type: Number,            // For year-over-year comparison
    },
    subject: {
      type: String,
    },
    questionPaperPath: {
      type: String,
      required: true,          // Path to uploaded PDF in /uploads
    },
    syllabusPath: {
      type: String,
      required: true,
    },
    textbookPaths: {
      type: [String],          // Array — multiple textbooks allowed
      required: true,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }         // Gives createdAt, updatedAt automatically
);

module.exports = mongoose.model("Paper", paperSchema);