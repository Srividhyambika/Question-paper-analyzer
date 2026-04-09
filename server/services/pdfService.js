const pdfParse = require("pdf-parse");
const fs = require("fs");

// ─── Generic Text Extractor ───────────────────────────────────────────────────

const extractText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
};

// ─── Question Paper Parser ────────────────────────────────────────────────────
const parseQuestionPaper = async (filePath) => {
  const rawText = await extractText(filePath);

  // Strategy 1: Match Q.01, Q.02, Q. 01 style (your PDF format)
  let questionPattern = /(?:^|\n)\s*Q\.\s*0*(\d+)\s+/gim;
  let matches = [...rawText.matchAll(questionPattern)];

  // Strategy 2: fallback — Q1, Q2, Q 1
  if (matches.length < 2) {
    questionPattern = /(?:^|\n)\s*Q\.?\s*0*(\d+)[.\s)]/gim;
    matches = [...rawText.matchAll(questionPattern)];
  }

  // Strategy 3: fallback — plain numbered 1. 2. 3.
  if (matches.length < 2) {
    questionPattern = /(?:^|\n)\s*0*([1-9]\d*)\.\s+[A-Z]/gm;
    matches = [...rawText.matchAll(questionPattern)];
  }

  console.log(`Parser found ${matches.length} question markers`);

  const skipPhrases = /^(answer|note|instruction|all question|choose|attempt|section|page|usn|time|max|module|bloom|third|second|first)/i;

  const segments = [];

  matches.forEach((match, i) => {
    const start = match.index + match[0].length;
    const end = matches[i + 1]?.index ?? rawText.length;
    const text = rawText.slice(start, end).trim();

    if (text.length < 10) return;
    if (skipPhrases.test(text)) return;

    // Extract sub-questions (a, b, c parts) as separate entries
    const subPattern = /\n\s*([a-c])\s+(.+?)(?=\n\s*[a-c]\s+|\n\s*(?:OR|Q\.)|$)/gis;
    const subMatches = [...text.matchAll(subPattern)];

    if (subMatches.length > 0) {
      subMatches.forEach((sub) => {
        const subText = sub[2].trim();
        if (subText.length > 10) {
          segments.push({
            questionNumber: `Q${match[1]}${sub[1]}`,
            questionText: subText,
            marks: extractMarks(subText),
          });
        }
      });
    } else {
      segments.push({
        questionNumber: `Q${match[1]}`,
        questionText: text,
        marks: extractMarks(text),
      });
    }
  });

  if (segments.length === 0) {
    console.warn("Could not segment — storing full text as one block.");
    return {
      rawText,
      questions: [{ questionNumber: "Q1", questionText: rawText.trim(), marks: 0 }],
    };
  }

  console.log(`Segmented into ${segments.length} questions/sub-questions`);
  return { rawText, questions: segments };
};

// ─── Marks Extractor ─────────────────────────────────────────────────────────

const extractMarks = (text) => {
  const patterns = [
    /\b(\d{1,2})\s*(?:marks?|M|m)\b/i,     // 5 marks, 5M
    /\[(\d{1,2})\]/,                          // [5]
    /\((\d{1,2})\)\s*$/m,                     // (5) at end of line
    /L\d\s+(\d{1,2})\s*$/m,                   // L2 6 (your PDF format)
    /(\d{1,2})\s*$/m,                          // trailing number on last line
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const val = parseInt(match[1]);
      if (val > 0 && val <= 25) return val;   // sanity check — ignore 0 and >25
    }
  }
  return 0;
};

// ─── Syllabus Parser ──────────────────────────────────────────────────────────
// Extracts units/modules and their topics from syllabus PDF

const parseSyllabus = async (filePath) => {
  const rawText = await extractText(filePath);

  // Detect unit/module headings: "Unit 1", "Module 2", "UNIT I" etc.
  const unitPattern = /(?:unit|module)\s*[:\-]?\s*([IVX\d]+)[:\-]?\s*([^\n]+)/gi;
  const units = [];
  let match;

  while ((match = unitPattern.exec(rawText)) !== null) {
    units.push({
      unitNumber: units.length + 1,
      unitTitle: match[2].trim(),
      topics: [],
      learningOutcomes: [],
    });
  }

  // Extract bullet/numbered topics between unit headings
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  let currentUnit = null;

  lines.forEach((line) => {
    const isUnitHeading = /^(?:unit|module)\s*[:\-]?\s*([IVX\d]+)/i.test(line);
    if (isUnitHeading) {
      currentUnit = units.find((u) =>
        line.toLowerCase().includes(u.unitTitle.toLowerCase().slice(0, 10))
      );
      return;
    }
    // Lines starting with bullet, dash, or number are likely topics
    if (currentUnit && /^[-•*\d]/.test(line)) {
      const cleaned = line.replace(/^[-•*\d.)\s]+/, "").trim();
      if (cleaned.length > 3) currentUnit.topics.push(cleaned);
    }
  });

  // Flat topic list for quick LLM reference
  const allTopics = units.flatMap((u) => u.topics);

  return { rawText, units, allTopics };
};

// ─── Textbook Parser ──────────────────────────────────────────────────────────
// Chunks textbook into ~500 word passages for RAG

const parseTextbook = async (filePath, title = "Textbook") => {
  const rawText = await extractText(filePath);

  const words = rawText.split(/\s+/);
  const CHUNK_SIZE = 500;
  const OVERLAP = 50; // words overlap between chunks for context continuity
  const chunks = [];

  for (let i = 0; i < words.length; i += CHUNK_SIZE - OVERLAP) {
    const chunkWords = words.slice(i, i + CHUNK_SIZE);
    if (chunkWords.length < 20) break; // skip tiny trailing chunks

    // Try to detect a chapter title near the start of this chunk
    const chunkText = chunkWords.join(" ");
    const chapterMatch = chunkText.match(/chapter\s+\d+[:\-]?\s*([^\n.]+)/i);

    chunks.push({
      chunkIndex: chunks.length,
      chapterTitle: chapterMatch ? chapterMatch[1].trim() : "",
      content: chunkText,
      embedding: [], // filled later by ragService
    });
  }

  return { title, chunks };
};


const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete ${filePath}:`, err.message);
  }
};

module.exports = { extractText, parseQuestionPaper, parseSyllabus, parseTextbook, deleteFile };
