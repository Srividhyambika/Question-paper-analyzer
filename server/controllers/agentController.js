// Placeholder — full LangChain agent comes in Phase 3
// For now returns a structured stub so frontend can be built against it

const query = async (req, res, next) => {
  try {
    const { message, paperId } = req.body;

    if (!message) {
      res.status(400);
      return next(new Error("Message is required."));
    }

    // Stub response — replace with LangChain agent in Phase 3
    res.json({
      response: `Agent received: "${message}" for paper ${paperId || "none"}. Full agent coming in Phase 3.`,
      paperId,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { query };