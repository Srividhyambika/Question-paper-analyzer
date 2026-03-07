const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // e.g. questionPaper-1709123456789.pdf
    const prefix = file.fieldname;
    const uniqueSuffix = Date.now();
    cb(null, `${prefix}-${uniqueSuffix}.pdf`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error(`${file.originalname} is not a PDF`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
});

// Named field config matching what the frontend will send
// questionPaper: 1 file, syllabus: 1 file, textbooks: up to 5
const uploadFields = upload.fields([
  { name: "questionPaper", maxCount: 1 },
  { name: "syllabus", maxCount: 1 },
  { name: "textbooks", maxCount: 5 },
]);

module.exports = { upload, uploadFields };