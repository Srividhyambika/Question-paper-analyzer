const mongoose = require("mongoose");

// Stores chunked textbook content for RAG
// Each chunk is a small passage with its embedding vector

const textbookSchema = new mongoose.Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    title: {
      type: String,            // Textbook name
    },
    chunks: [
      {
        chunkIndex: Number,
        chapterTitle: String,
        content: String,       // The actual text passage (~500 tokens)
        embedding: {
          type: [Number],      // Vector from Gemini embeddings
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Textbook", textbookSchema);