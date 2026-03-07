const express = require("express");
const router = express.Router();
const { runAnalysis, getStatus, getResults, comparePapers } = require("../controllers/analysisController");

router.post("/run/:paperId", runAnalysis);
router.get("/status/:paperId", getStatus);
router.get("/results/:paperId", getResults);
router.get("/compare", comparePapers);

module.exports = router;