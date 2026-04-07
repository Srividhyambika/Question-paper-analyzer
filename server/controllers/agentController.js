const { runAgent } = require("../services/agentService");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const query = async (req, res, next) => {
  try {
    const { message, paperId, conversationHistory = [] } = req.body;
    if (!message) { res.status(400); return next(new Error("Message is required.")); }
    if (!paperId) { res.status(400); return next(new Error("paperId is required.")); }
    const result = await runAgent(message, paperId, conversationHistory);
    res.json({ response: result.response, toolUsed: result.toolUsed });
  } catch (err) { next(err); }
};

// General chat — no paper context needed
const chat = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message) { res.status(400); return next(new Error("Message is required.")); }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI study assistant for students using the Exam PYQ Analyzer app. 
You help students understand:
- How to interpret their exam analysis results
- Bloom's Taxonomy levels and what they mean for studying
- Cognitive complexity and how to approach difficult questions
- General exam preparation strategies
- How to use the app's features
Keep responses concise, practical, and encouraging. Use bullet points for lists.`,
        },
        ...conversationHistory.slice(-6),
        { role: "user", content: message },
      ],
      temperature: 0.5,
      max_tokens: 400,
    });

    res.json({ response: response.choices[0].message.content.trim() });
  } catch (err) { next(err); }
};

module.exports = { query, chat };
