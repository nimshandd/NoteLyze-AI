const pdfParse = require("pdf-parse");

/**
 * Extract text from PDF buffer safely.
 * - Suppresses font-related warnings
 * - Guarantees string output
 * - Throws clear errors when text is unusable
 */
const extractPdfText = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid PDF buffer");
  }

  let text = "";

  try {
    const data = await pdfParse(buffer, {
      normalizeWhitespace: true,
      disableFontFace: true
    });

    text = data.text || "";
  } catch (err) {
    console.error("❌ PDF parsing failed:", err.message);
    throw new Error("Failed to parse PDF file");
  }

  if (!text || typeof text !== "string") {
    throw new Error("PDF extraction returned invalid text");
  }

  text = text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length < 100) {
    throw new Error(
      "PDF has no readable text (likely scanned or font-corrupted)"
    );
  }

  console.log("✅ PDF text extracted:", text.length, "chars");

  return text;
};

module.exports = { extractPdfText };
