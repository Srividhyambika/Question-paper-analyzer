const express = require('express');
const multer = require('multer');
const { extractText } = require('./utils/pdfExtractor');
const Analysis = require('./models/Analysis');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// The field names MUST match the frontend input names
app.post('/api/upload', upload.fields([
  { name: 'questionPaper', maxCount: 1 },
  { name: 'syllabus', maxCount: 1 },
  { name: 'textbook', maxCount: 1 }
]), async (req, res) => {
  try {
    const { questionPaper, syllabus, textbook } = req.files;

    const newAnalysis = new Analysis({
      projectName: `Analysis_${Date.now()}`,
      files: {
        questionPaper: { 
            text: await extractText(questionPaper[0].buffer), 
            fileName: questionPaper[0].originalname 
        },
        syllabus: { 
            text: await extractText(syllabus[0].buffer), 
            fileName: syllabus[0].originalname 
        },
        textbook: { 
            text: await extractText(textbook[0].buffer), 
            fileName: textbook[0].originalname 
        }
      }
    });

    await newAnalysis.save();
    res.status(200).json({ message: "Files uploaded and text extracted!", id: newAnalysis._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));