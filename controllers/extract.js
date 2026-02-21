console.log("🔥 CONTROLLER FILE ACTIVE 🔥");

const path = require("path");
const config = require("../config/appConfig");
const { extractPdfText } = require("../services/pdfExtractor");
const { extractPptxText } = require("../services/pptxExtractor");
const { cleanText } = require("../services/textCleaner");
const textChunker = require("../services/textChunker");
const { buildPrompt } = require("../services/promptBuilder");
const { PRESETS } = require("../presets/presetConfig");
const { callAI } = require("../services/aiClient");

// ---------------- CONTROLLER ----------------
const extractText = async (req, res) => {
  const startTime = Date.now();

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

    // 5️⃣ CHUNKING (Preset-aware)
    const chunks = textChunker(rawText, {
      compressionLevel:
        presetConfig.compressionLevel ||
        config.processing.defaultCompression,
      maxChunks:
        presetConfig.maxChunks ||
        config.processing.maxChunks
    });

    if (!chunks.length) {
      throw new Error("Chunking produced no output");
    }

    console.log("✅ Chunks created:", chunks.length);

    let finalOutput;

    // 🔥 Global-generation presets (MCQ + shortQA only)
    const isGlobalGenerationPreset =
      presetConfig.type === "mcq" ||
      presetConfig.outputStyle === "qa";

    if (isGlobalGenerationPreset) {
      const mergedText = chunks.join("\n\n");

      const prompt = buildPrompt({
        text: mergedText,
        preset: presetConfig
      });

      finalOutput = await callAI(prompt, presetConfig);

    } else {
      // 🔥 Chunk-based presets
      const aiResults = [];

      for (let i = 0; i < chunks.length; i++) {
        console.log(`🚀 Processing chunk ${i + 1}/${chunks.length}`);

        const prompt = buildPrompt({
          text: chunks[i],
          preset: presetConfig
        });

        const aiResponseText = await callAI(prompt, presetConfig);
        aiResults.push(aiResponseText);
      }

      finalOutput = aiResults.join("\n\n");
    }

    // 6️⃣ EXECUTION TIME GUARD
    const duration = (Date.now() - startTime) / 1000;

    if (duration > 90) {
      throw new Error("Processing time exceeded safe limit");
    }

    console.log("Processing time:", duration, "seconds");

    return res.json({
      success: true,
      fileType: ext.replace(".", ""),
      preset: presetConfig.name,
      chunksCount: chunks.length,
      data: finalOutput
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