const express = require("express");
const router = express.Router();
const { getStats, startVisit, endVisit } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Visitor tracking — open (no auth needed, called on page load)
router.post("/visit/start", startVisit);
router.post("/visit/end", endVisit);

// Stats — admin only
router.get("/stats", protect, adminOnly, getStats);

module.exports = router;