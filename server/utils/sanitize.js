// Strips potential prompt injection and malicious content
// before text is sent to the LLM

const sanitizeText = (text) => {
  if (!text || typeof text !== "string") return "";

  return text
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove common prompt injection attempts
    .replace(/ignore\s+previous\s+instructions?/gi, "[removed]")
    .replace(/you\s+are\s+now\s+(?:a\s+)?(?:an?\s+)?(?:evil|unrestricted|jailbroken)/gi, "[removed]")
    .replace(/forget\s+(?:all\s+)?(?:your\s+)?(?:previous\s+)?(?:instructions?|training)/gi, "[removed]")
    .replace(/act\s+as\s+(?:if\s+you\s+(?:are|were)\s+)?(?:a\s+)?(?:different|evil|unrestricted)/gi, "[removed]")
    // Remove excessive repeated characters (spam)
    .replace(/(.)\1{50,}/g, "$1$1$1")
    // Trim excessive whitespace
    .replace(/\s{10,}/g, " ")
    .trim();
};

const sanitizeQuestions = (questions) => {
  return questions.map((q) => ({
    ...q,
    questionText: sanitizeText(q.questionText),
  })).filter((q) => q.questionText.length > 5);
};

module.exports = { sanitizeText, sanitizeQuestions };
