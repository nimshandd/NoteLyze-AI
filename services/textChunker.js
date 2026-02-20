const textChunker = (text, options = {}) => {
  if (typeof text !== "string") {
    throw new Error("textChunker: input must be a string");
  }

  const cleanText = text.trim();

  if (cleanText.length < 100) {
    throw new Error("textChunker: text too short to chunk");
  }

  const compressionLevel = options.compressionLevel || "medium";
  const maxChunks = options.maxChunks || 3;

  const LIMITS = {
    low: 3500,
    medium: 2200,
    high: 1200
  };

  if (!LIMITS[compressionLevel]) {
    throw new Error(`textChunker: invalid compressionLevel "${compressionLevel}"`);
  }

  const maxLength = LIMITS[compressionLevel];
  const chunks = [];
  let currentChunk = "";

  // PDFs ≠ real newlines → split by WORDS
  const words = cleanText.split(/\s+/);

  for (const word of words) {
    if (!word) continue;

    // Force-push if single word is huge
    if (word.length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      chunks.push(word.slice(0, maxLength));
      continue;
    }

    if ((currentChunk + " " + word).length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = word;

      if (chunks.length >= maxChunks) break;
    } else {
      currentChunk += " " + word;
    }
  }

  if (currentChunk.trim() && chunks.length < maxChunks) {
    chunks.push(currentChunk.trim());
  }

  if (!chunks.length) {
    throw new Error("textChunker: no chunks produced");
  }

  return chunks;
};

module.exports = textChunker;
