require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";
const { sanitizeText } = require("../utils/sanitize");

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
  const cleanText = sanitizeText(questionText);
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

// ─── GenAI: Topic-wise Summary ────────────────────────────────────────────────
const generateTopicSummary = async (questions, analysisResult) => {
  const topicData = questions.reduce((acc, q) => {
    const topic = q.syllabusMatch?.topic || "General";
    if (!acc[topic]) acc[topic] = { questions: [], difficulty: [], blooms: [] };
    acc[topic].questions.push(q.questionText?.slice(0, 100));
    if (q.difficulty) acc[topic].difficulty.push(q.difficulty);
    if (q.bloomsLevel?.label) acc[topic].blooms.push(q.bloomsLevel.label);
    return acc;
  }, {});

  const prompt = `You are an academic analyst. Based on this exam paper analysis, generate a topic-wise summary.

Topics and their questions:
${JSON.stringify(topicData, null, 2)}

Overall insights: ${analysisResult?.insights || ""}

Write a clear topic-wise breakdown. For each topic:
- What concept it tests
- Cognitive level required
- How heavily it was tested
- One key thing students should focus on

Format as natural flowing paragraphs per topic, not bullet points. Be specific and actionable. Maximum 400 words total.`;

  return withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 600,
    });
    return response.choices[0].message.content.trim();
  });
};

// ─── GenAI: Predicted Questions ───────────────────────────────────────────────
const generatePredictedQuestions = async (questions, paper) => {
  const questionSummaries = questions.map((q) => ({
    text: q.questionText?.slice(0, 150),
    topic: q.syllabusMatch?.topic,
    difficulty: q.difficulty,
    blooms: q.bloomsLevel?.label,
  }));

  const prompt = `You are an experienced exam setter. Based on these past exam questions from ${paper.subject || "this subject"} (${paper.year || "recent year"}), predict 5 likely questions for the next exam.

Past questions analyzed:
${JSON.stringify(questionSummaries, null, 2)}

Generate 5 predicted questions that:
1. Cover topics not heavily tested this year (gap filling)
2. Follow similar difficulty and cognitive patterns
3. Are realistic exam-style questions
4. Include a mix of difficulty levels

Format as:
Q1. [question text]
Topic: [topic] | Difficulty: [easy/medium/hard] | Bloom's: [level]
Why predicted: [one sentence reason]

Then Q2, Q3, Q4, Q5 in the same format.`;

  return withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });
    return response.choices[0].message.content.trim();
  });
};

// ─── GenAI: Mnemonics for Hard Questions ──────────────────────────────────────
const generateMnemonics = async (questions) => {
  const hardQuestions = questions
    .filter((q) => q.difficulty === "hard" || q.cognitiveComplexity?.score >= 7)
    .slice(0, 5);

  if (hardQuestions.length === 0) {
    return "No hard or high-complexity questions found in this paper. Great news — the paper is manageable!";
  }

  const prompt = `You are a creative study coach. For each of these difficult exam questions, create a memorable mnemonic, memory trick, or mental model to help students remember the concept.

Hard questions:
${hardQuestions.map((q, i) => `${i + 1}. ${q.questionText?.slice(0, 200)}`).join("\n")}

For each question provide:
- A catchy acronym, rhyme, visual story, or analogy
- One sentence explaining how to use it
- A key formula or framework if applicable

Be creative, memorable, and student-friendly. Avoid being too academic.`;

  return withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 700,
    });
    return response.choices[0].message.content.trim();
  });
};

// ─── GenAI: Study Schedule ────────────────────────────────────────────────────
const generateStudySchedule = async (questions, analysisResult, examDate, hoursPerDay) => {
  const today = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
  const totalHours = daysLeft * hoursPerDay;

  const hardCount = questions.filter((q) => q.difficulty === "hard").length;
  const mediumCount = questions.filter((q) => q.difficulty === "medium").length;
  const easyCount = questions.filter((q) => q.difficulty === "easy").length;
  const topics = analysisResult?.topicsCovered || [];
  const gaps = analysisResult?.topicsNotCovered || [];

  const prompt = `You are an expert academic planner. Create a detailed day-by-day study schedule.

Exam details:
- Days until exam: ${daysLeft}
- Study hours per day: ${hoursPerDay}
- Total available hours: ${totalHours}
- Subject: ${analysisResult?.subject || "this subject"}

Paper analysis:
- Hard questions: ${hardCount}
- Medium questions: ${mediumCount}  
- Easy questions: ${easyCount}
- Topics covered in exam: ${topics.slice(0, 10).join(", ")}
- Syllabus gaps (not tested but in syllabus): ${gaps.slice(0, 5).join(", ") || "none"}

Create a realistic day-by-day schedule that:
1. Prioritizes hard and complex topics first
2. Allocates more time to high-cognitive-load topics
3. Includes revision days before the exam
4. Covers syllabus gaps
5. Ends with a full mock practice day

Format as:
Day 1 (Date): [topics] — [hours] — [focus]
Day 2 (Date): ...
...

Keep it practical and motivating. Maximum ${Math.min(daysLeft, 14)} days shown.`;

  return withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 900,
    });
    return response.choices[0].message.content.trim();
  });
};

module.exports = {
  analyzeQuestion,
  generateSummary,
  generateTopicSummary,
  generatePredictedQuestions,
  generateMnemonics,
  generateStudySchedule,
};
