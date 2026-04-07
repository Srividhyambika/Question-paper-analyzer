const Groq = require("groq-sdk");
const Question = require("../models/Question");
const AnalysisResult = require("../models/AnalysisResult");
const Paper = require("../models/Paper");
const Syllabus = require("../models/Syllabus");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "get_questions_by_difficulty",
    description: "Get questions filtered by difficulty level (easy, medium, hard) or cognitive complexity score range",
    parameters: ["difficulty", "minComplexity", "maxComplexity"],
  },
  {
    name: "get_syllabus_gaps",
    description: "Find topics in the syllabus that were not covered in the question paper",
    parameters: [],
  },
  {
    name: "get_blooms_breakdown",
    description: "Get distribution of Bloom's taxonomy levels across all questions",
    parameters: [],
  },
  {
    name: "get_out_of_syllabus",
    description: "Get all questions that are outside the syllabus",
    parameters: [],
  },
  {
    name: "get_paper_summary",
    description: "Get overall summary statistics for the paper including difficulty score, coverage percentage, and insights",
    parameters: [],
  },
  {
    name: "generate_study_plan",
    description: "Generate a personalized study strategy based on the paper analysis",
    parameters: ["focusArea"],
  },
  {
    name: "compare_papers",
    description: "Compare this paper with another paper by year or title",
    parameters: ["compareWithYear"],
  },
];

// ─── Tool Executors ───────────────────────────────────────────────────────────

const executeTool = async (toolName, params, paperId) => {
  switch (toolName) {

    case "get_questions_by_difficulty": {
      const filter = { paperId };
      if (params.difficulty) filter.difficulty = params.difficulty;
      if (params.minComplexity || params.maxComplexity) {
        filter["cognitiveComplexity.score"] = {};
        if (params.minComplexity) filter["cognitiveComplexity.score"].$gte = parseInt(params.minComplexity);
        if (params.maxComplexity) filter["cognitiveComplexity.score"].$lte = parseInt(params.maxComplexity);
      }
      const questions = await Question.find(filter).select(
        "questionNumber questionText difficulty bloomsLevel cognitiveComplexity marks"
      );
      return {
        count: questions.length,
        questions: questions.map((q) => ({
          number: q.questionNumber,
          text: q.questionText.slice(0, 120) + (q.questionText.length > 120 ? "..." : ""),
          difficulty: q.difficulty,
          bloomsLevel: q.bloomsLevel?.label,
          complexityScore: q.cognitiveComplexity?.score,
          marks: q.marks,
        })),
      };
    }

    case "get_syllabus_gaps": {
      const result = await AnalysisResult.findOne({ paperId });
      return {
        topicsCovered: result?.topicsCovered || [],
        topicsNotCovered: result?.topicsNotCovered || [],
        coveragePercent: result?.syllabusCoveragePercent || 0,
      };
    }

    case "get_blooms_breakdown": {
      const result = await AnalysisResult.findOne({ paperId });
      const questions = await Question.find({ paperId }).select("bloomsLevel questionNumber");
      return {
        distribution: result?.bloomsDistribution || {},
        questionsByLevel: questions.reduce((acc, q) => {
          const label = q.bloomsLevel?.label || "Unknown";
          if (!acc[label]) acc[label] = [];
          acc[label].push(q.questionNumber);
          return acc;
        }, {}),
      };
    }

    case "get_out_of_syllabus": {
      const questions = await Question.find({ paperId, isOutOfSyllabus: true }).select(
        "questionNumber questionText syllabusMatch"
      );
      return {
        count: questions.length,
        questions: questions.map((q) => ({
          number: q.questionNumber,
          text: q.questionText.slice(0, 150),
          confidence: q.syllabusMatch?.confidence,
        })),
      };
    }

    case "get_paper_summary": {
      const [paper, result] = await Promise.all([
        Paper.findById(paperId).select("title year subject totalQuestions totalMarks"),
        AnalysisResult.findOne({ paperId }),
      ]);
      return {
        title: paper?.title,
        year: paper?.year,
        subject: paper?.subject,
        totalQuestions: paper?.totalQuestions,
        overallDifficultyScore: result?.overallDifficultyScore,
        syllabusCoveragePercent: result?.syllabusCoveragePercent,
        outOfSyllabusCount: result?.outOfSyllabusCount,
        difficultyDistribution: result?.difficultyDistribution,
        bloomsDistribution: result?.bloomsDistribution,
        insights: result?.insights,
      };
    }

    case "generate_study_plan": {
      const [result, questions] = await Promise.all([
        AnalysisResult.findOne({ paperId }),
        Question.find({ paperId }).select(
          "questionNumber difficulty bloomsLevel cognitiveComplexity syllabusMatch isOutOfSyllabus"
        ),
      ]);

      const hardQuestions = questions.filter((q) => q.difficulty === "hard");
      const highComplexity = questions.filter((q) => q.cognitiveComplexity?.score >= 7);
      const outOfSyllabus = questions.filter((q) => q.isOutOfSyllabus);

      return {
        totalQuestions: questions.length,
        hardCount: hardQuestions.length,
        highComplexityCount: highComplexity.length,
        outOfSyllabusCount: outOfSyllabus.length,
        topicsCovered: result?.topicsCovered || [],
        topicsNotCovered: result?.topicsNotCovered || [],
        difficultyDistribution: result?.difficultyDistribution,
        bloomsDistribution: result?.bloomsDistribution,
        focusArea: params.focusArea || "general",
      };
    }

    case "compare_papers": {
      const currentPaper = await Paper.findById(paperId).select("title year subject");
      const currentResult = await AnalysisResult.findOne({ paperId });

      // Find another paper by year if specified
      const otherFilter = { _id: { $ne: paperId } };
      if (params.compareWithYear) otherFilter.year = parseInt(params.compareWithYear);

      const otherPaper = await Paper.findOne(otherFilter).select("title year subject totalQuestions");
      if (!otherPaper) return { error: "No other paper found to compare with." };

      const otherResult = await AnalysisResult.findOne({ paperId: otherPaper._id });

      return {
        current: {
          title: currentPaper.title,
          year: currentPaper.year,
          difficulty: currentResult?.overallDifficultyScore,
          coverage: currentResult?.syllabusCoveragePercent,
          distribution: currentResult?.difficultyDistribution,
        },
        other: {
          title: otherPaper.title,
          year: otherPaper.year,
          difficulty: otherResult?.overallDifficultyScore,
          coverage: otherResult?.syllabusCoveragePercent,
          distribution: otherResult?.difficultyDistribution,
        },
      };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
};

// ─── Intent Detection ─────────────────────────────────────────────────────────
// LLM decides which tool to call based on the user's message

const detectIntent = async (message, conversationHistory) => {
  const systemPrompt = `You are an intelligent exam analysis assistant. Based on the user's message, decide which tool to call.

Available tools:
${TOOLS.map((t) => `- ${t.name}: ${t.description}`).join("\n")}

Respond with ONLY a JSON object in this format:
{
  "tool": "tool_name",
  "params": { "param1": "value1" },
  "directAnswer": null
}

If no tool is needed and you can answer directly from conversation context, set tool to null and provide directAnswer as a string.
If the user is just greeting or asking something general not related to the paper, set tool to null and directAnswer to a helpful message.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-4), // last 4 messages for context
      { role: "user", content: message },
    ],
    temperature: 0.1,
    max_tokens: 200,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return { tool: "get_paper_summary", params: {}, directAnswer: null };
  }
};

// ─── Generate Final Response ──────────────────────────────────────────────────
// Takes tool output and generates a natural language response

const generateResponse = async (message, toolName, toolData, conversationHistory) => {
  const isStudyPlan = toolName === "generate_study_plan";

  const systemPrompt = isStudyPlan
    ? `You are an expert academic advisor. Generate a detailed, actionable study plan based on the exam analysis data provided. Structure it clearly with priorities, time allocation suggestions, and specific topic recommendations. Be encouraging and practical.`
    : `You are a helpful exam analysis assistant. Answer the student's question using the data provided. Be concise, specific, and helpful. Use bullet points where appropriate. Don't repeat raw numbers unnecessarily — interpret them meaningfully.`;

  const userContent = `
Student question: "${message}"

Analysis data:
${JSON.stringify(toolData, null, 2)}

Provide a helpful, natural response based on this data.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-4),
      { role: "user", content: userContent },
    ],
    temperature: 0.4,
    max_tokens: 600,
  });

  return response.choices[0].message.content.trim();
};

// ─── Main Agent Function ──────────────────────────────────────────────────────

const runAgent = async (message, paperId, conversationHistory = []) => {
  try {
    // Step 1: Detect intent and select tool
    const intent = await detectIntent(message, conversationHistory);

    // Step 2: If direct answer (no tool needed)
    if (!intent.tool || intent.directAnswer) {
      return {
        response: intent.directAnswer || "I'm here to help you analyze your exam paper. Try asking about difficulty, topics, or study strategies.",
        toolUsed: null,
      };
    }

    // Step 3: Execute the tool
    const toolData = await executeTool(intent.tool, intent.params || {}, paperId);

    // Step 4: Generate natural language response
    const response = await generateResponse(message, intent.tool, toolData, conversationHistory);

    return { response, toolUsed: intent.tool };

  } catch (err) {
    console.error("Agent error:", err.message);
    return {
      response: "I encountered an issue processing your request. Please try again.",
      toolUsed: null,
    };
  }
};

module.exports = { runAgent, TOOLS };
