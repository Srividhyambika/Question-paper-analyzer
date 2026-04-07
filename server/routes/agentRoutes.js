const express = require("express");
const router = express.Router();
const { query, chat } = require("../controllers/agentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/query", protect, query);
router.post("/chat", protect, chat);

module.exports = router;
