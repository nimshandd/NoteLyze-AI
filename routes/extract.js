const express = require("express");
const multer = require("multer");
const { extractText } = require("../controllers/extract");

const router = express.Router();

// 🔴 MUST use memoryStorage
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), extractText);

module.exports = router;
