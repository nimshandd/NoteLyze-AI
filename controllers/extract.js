console.log("🔥 CONTROLLER FILE ACTIVE 🔥");

const path = require("path");

const { extractPdfText } = require("../services/pdfExtractor");
const { extractPptxText } = require("../services/pptxExtractor");
const { cleanText } = require("../services/textCleaner");
const textChunker = require("../services/textChunker");
const { applyPreset } = require("../services/presetProcessor");
const { validateMCQOutput } = require("../services/mcqValidator");
const { buildPrompt } = require("../services/promptBuilder");
const { PRESETS } = require("../presets/presetConfig");

// ---------------- TEMP AI MOCK ----------------
// ---------------- TEMP AI MOCK ----------------
const callAI = async (prompt, presetConfig) => {

  switch (presetConfig.outputStyle) {

    case "bullets":
      return `
## Sample Heading
- Key point 1
- Key point 2
- Key point 3
`;

    case "structured_paragraphs":
      return `
### Topic Overview
This is a structured explanation paragraph generated as a mock.

### Key Concepts
Detailed explanation of main ideas in structured format.
`;

    case "one_liners":
      return `
Concept 1 – Short definition.
Concept 2 – Short definition.
Concept 3 – Short definition.
`;

    case "mcq":
      let questions = "";
      for (let i = 1; i <= (presetConfig.questionCount || 5); i++) {
        questions += `
Q${i}. Sample question ${i}?
A. Option A
B. Option B
C. Option C
D. Option D
Correct Answer: A
`;
      }
      return questions;

    case "qa":
      return `
Q1. What is a hash function?
Answer:
A function that converts data into a fixed-length value.
`;

    case "table":
      return `
| Concept | Description |
|----------|-------------|
| Hashing | Converts input into fixed output |
| HMAC | Message authentication mechanism |
`;

    case "flashcards":
      return `
Card 1:
Q: What is encryption?
A: Converting data into unreadable form.

Card 2:
Q: What is decryption?
A: Converting data back to readable form.
`;

    default:
      return "Mock response generated successfully.";
  }
};


// ---------------- CONTROLLER ----------------
const extractText = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    let rawText = "";

    // 1️⃣ EXTRACT TEXT
    if (ext === ".pdf") {
      rawText = await extractPdfText(req.file.buffer);

    } else if (ext === ".pptx") {
      rawText = await extractPptxText(req.file.buffer);

    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // 2️⃣ CLEAN TEXT
    rawText = cleanText(rawText);

    // 3️⃣ HARD VALIDATION
    if (!rawText || rawText.length < 200) {
      return res.status(400).json({
        error: "File has no readable text (scanned, image-only, or corrupted)"
      });
    }

    console.log("✅ Extracted & cleaned text length:", rawText.length);

    // 4️⃣ PRESET
    const presetKey = req.body.preset || "exam";
    const presetConfig = PRESETS[presetKey];

    if (!presetConfig) {
      return res.status(400).json({ error: "Invalid preset key" });
    }

    // 5️⃣ CHUNKING (REAL CHUNKER)
    const chunks = textChunker(rawText, {
      compressionLevel: presetConfig.compressionLevel || "medium",
      maxChunks: 3
    });

    if (!chunks.length) {
      throw new Error("Chunking produced no output");
    }

    console.log("✅ Chunks created:", chunks.length);

    // 6️⃣ APPLY PRESET METADATA
    const presetChunks = applyPreset(chunks, presetConfig);

    // 7️⃣ BUILD AI PROMPT
    const prompt = buildPrompt({
      text: presetChunks[0]?.content,
      preset: presetConfig
    });

    // 8️⃣ CALL AI (TEMP MOCK)
    const aiResponseText = await callAI(prompt, presetConfig);

    // 9️⃣ MCQ VALIDATION (if needed)
    if (presetKey === "mcq") {
      const validation = validateMCQOutput(
        aiResponseText,
        presetConfig.questionCount
      );

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error
        });
      }
    }

    return res.json({
      success: true,
      fileType: ext.replace(".", ""),
      preset: presetConfig.name,
      chunksCount: chunks.length,
      data: aiResponseText
    });

  } catch (err) {
    console.error("❌ EXTRACTION ERROR:", err.message);
    return res.status(500).json({
      error: "Extraction failed",
      details: err.message
    });
  }
};

module.exports = { extractText };
