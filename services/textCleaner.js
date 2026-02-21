const cleanText = (text) => {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/•/g, "- ")
    .replace(/Page \d+/gi, "")
    .replace(/©.*$/gim, "")
    .trim();
};

module.exports = { cleanText };
