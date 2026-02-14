require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');


const { extractText } = require('./utils/pdfExtractor');
const Analysis = require('./models/Analysis');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
console.log("URI Check:", process.env.MONGO_URI);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

// THE UPLOAD ROUTE
app.post('/api/upload', upload.fields([
  { name: 'questionPaper', maxCount: 1 },
  { name: 'syllabus', maxCount: 1 },
  { name: 'textbook', maxCount: 1 }
]), async (req, res) => {
  try {
    const { questionPaper, syllabus, textbook } = req.files;

    if (!questionPaper || !syllabus || !textbook) {
      return res.status(400).json({ error: "Please upload all three required PDFs." });
    }

    console.log(" Files received. Starting extraction...");

    // Extract text from all three buffers
    const [qpText, syText, tbText] = await Promise.all([
      extractText(questionPaper[0].buffer),
      extractText(syllabus[0].buffer),
      extractText(textbook[0].buffer)
    ]);

    // Save to MongoDB
    const newAnalysis = new Analysis({
      files: {
        questionPaper: { text: qpText, fileName: questionPaper[0].originalname },
        syllabus: { text: syText, fileName: syllabus[0].originalname },
        textbook: { text: tbText, fileName: textbook[0].originalname },
      },
      status: 'Pending'
    });

    await newAnalysis.save();
    console.log(" Analysis saved to Database!");

    res.status(200).json({ 
      message: "Analysis started successfully!", 
      id: newAnalysis._id 
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
