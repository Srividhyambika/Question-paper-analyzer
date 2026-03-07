const express = require("express");
const router = express.Router();
const { uploadPDFs, getUploadHistory, deletePaper } = require("../controllers/uploadController");
const { uploadFields } = require("../config/multer");
const validateUpload = require("../middleware/validateUpload");

router.post("/", uploadFields, validateUpload, uploadPDFs);
router.get("/history", getUploadHistory);
router.delete("/:id", deletePaper);

module.exports = router;