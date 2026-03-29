require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// ─── Helper: strip markdown code fences from JSON responses ──────────────────
const cleanJSON = (text) => {
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
};

// ─── Helper: retry on rate limit (429) ───────────────────────────────────────
const withRetry = async (fn, retries = 3, delayMs = 15000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("429");
      if (is429 && i < retries - 1) {
        console.log(`Rate limited. Retrying in ${delayMs / 1000}s... (attempt ${i + 2}/${retries})`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
};

// ─── Analyze a single question ────────────────────────────────────────────────
// Returns structured JSON with all analysis fields in one call

const analyzeQuestion = async (questionText, syllabusTopics, questionNumber) => {
  const prompt = `
You are an expert academic analyzer. Analyze the following exam question and return ONLY a valid JSON object with no extra text, no markdown, no explanation.

EXAM QUESTION (${questionNumber}):
"${questionText}"

SYLLABUS TOPICS:
${syllabusTopics.join("\n")}

Return this exact JSON structure:
{
  "syllabusMatch": {
    "matched": boolean,
    "topic": "matched topic name or empty string",
    "unit": "unit name or empty string",
    "confidence": number between 0 and 100
  },
  "isOutOfSyllabus": boolean,
  "difficulty": "easy" or "medium" or "hard",
  "bloomsLevel": {
    "level": number between 1 and 6,
    "label": "Remember" or "Understand" or "Apply" or "Analyze" or "Evaluate" or "Create"
  },
  "cognitiveComplexity": {
    "score": number between 1 and 10,
    "thinkingType": "convergent" or "divergent" or "analytical" or "integrative" or "evaluative",
    "depthCategory": "surface" or "intermediate" or "deep" or "complex",
    "reasoning": "one sentence explanation"
  }
}

Rules:
- isOutOfSyllabus is true only if confidence < 40
- difficulty easy = direct recall, medium = application, hard = synthesis/evaluation
- bloomsLevel 1=Remember, 2=Understand, 3=Apply, 4=Analyze, 5=Evaluate, 6=Create
- cognitiveComplexity score 1-3=surface, 4-6=intermediate, 7-8=deep, 9-10=complex
`;

  return withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // low temperature for consistent structured output
      max_tokens: 500,
    });

    const raw = response.choices[0].message.content;
    const cleaned = cleanJSON(raw);
    return JSON.parse(cleaned);
  });
};

// ─── Generate summary for a paper ────────────────────────────────────────────
// Called after all questions are analyzed — generates the AnalysisResult doc

const generateSummary = async (questions, syllabusTopics) => {
  const analyzedQuestions = questions.filter((q) => q.difficulty);

  if (analyzedQuestions.length === 0) return null;

  // Calculate distributions from stored question data
  const difficultyDistribution = { easy: 0, medium: 0, hard: 0 };
  const bloomsDistribution = {
    remember: 0, understand: 0, apply: 0,
    analyze: 0, evaluate: 0, create: 0,
  };
  const complexityDistribution = {
    surface: 0, intermediate: 0, deep: 0, complex: 0,
  };

  let totalComplexity = 0;
  let outOfSyllabusCount = 0;
  const topicsCovered = new Set();

  analyzedQuestions.forEach((q) => {
    if (q.difficulty) difficultyDistribution[q.difficulty]++;
    if (q.bloomsLevel?.label) {
      const key = q.bloomsLevel.label.toLowerCase();
      if (bloomsDistribution[key] !== undefined) bloomsDistribution[key]++;
    }
    if (q.cognitiveComplexity?.depthCategory) {
      const key = q.cognitiveComplexity.depthCategory;
      if (complexityDistribution[key] !== undefined) complexityDistribution[key]++;
    }
    if (q.cognitiveComplexity?.score) totalComplexity += q.cognitiveComplexity.score;
    if (q.isOutOfSyllabus) outOfSyllabusCount++;
    if (q.syllabusMatch?.topic) topicsCovered.add(q.syllabusMatch.topic);
  });

  const syllabusCoveragePercent = Math.round(
    ((analyzedQuestions.length - outOfSyllabusCount) / analyzedQuestions.length) * 100
  );

  const overallDifficultyScore = Math.round(
    totalComplexity / analyzedQuestions.length
  );

  const topicsNotCovered = syllabusTopics.filter(
    (t) => ![...topicsCovered].some((covered) =>
      covered.toLowerCase().includes(t.toLowerCase().slice(0, 10))
    )
  );

  // Generate insights paragraph
  const insightsPrompt = `
Based on this exam analysis, write a 2-3 sentence insight paragraph for students.
Total questions: ${analyzedQuestions.length}
Out of syllabus: ${outOfSyllabusCount}
Difficulty: ${JSON.stringify(difficultyDistribution)}
Blooms levels: ${JSON.stringify(bloomsDistribution)}
Be concise and practical. No markdown.
`;

  let insights = "";
  try {
    const insightResponse = await withRetry(() =>
      groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: insightsPrompt }],
        temperature: 0.4,
        max_tokens: 200,
      })
    );
    insights = insightResponse.choices[0].message.content.trim();
  } catch {
    insights = "Analysis complete. Review the question breakdown for detailed insights.";
  }

  return {
    overallDifficultyScore,
    syllabusCoveragePercent,
    outOfSyllabusCount,
    difficultyDistribution,
    bloomsDistribution,
    complexityDistribution,
    topicsCovered: [...topicsCovered],
    topicsNotCovered: topicsNotCovered.slice(0, 20),
    insights,
  };
};

module.exports = { analyzeQuestion, generateSummary };