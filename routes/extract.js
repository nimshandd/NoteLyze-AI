const express = require("express");
const multer = require("multer");
const { extractText } = require("../controllers/extract");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, function (err) {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File too large. Maximum allowed size is 5MB."
        });
      }

      return res.status(400).json({
        error: err.message
      });
    }

    if (err) {
      return res.status(500).json({
        error: "Upload failed"
      });
    }

    next();
  });

}, extractText);

module.exports = router;