// Ensures all 3 required PDF types were uploaded before processing continues

const validateUpload = (req, res, next) => {
  const files = req.files;

  if (!files || !files.questionPaper || files.questionPaper.length === 0) {
    res.status(400);
    return next(new Error("Question paper PDF is required."));
  }

  if (!files.syllabus || files.syllabus.length === 0) {
    res.status(400);
    return next(new Error("Syllabus PDF is required."));
  }

  if (!files.textbooks || files.textbooks.length === 0) {
    res.status(400);
    return next(new Error("At least one textbook PDF is required."));
  }

  next();
};

module.exports = validateUpload;