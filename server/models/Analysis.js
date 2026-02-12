const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  projectName: String,
  uploadDate: { type: Date, default: Date.now },
  files: {
    questionPaper: { text: String, fileName: String },
    syllabus: { text: String, fileName: String },
    textbook: { text: String, fileName: String },
  },
  status: { type: String, enum: ['Pending', 'Processing', 'Completed'], default: 'Pending' },
  results: Object // Will store LLM output in Week 2
});

module.exports = mongoose.model('Analysis', AnalysisSchema);