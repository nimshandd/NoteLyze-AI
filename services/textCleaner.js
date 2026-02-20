const cleanText = (text) => {
  return text
    .replace(/\r/g, "")               // remove CR
    .replace(/[ \t]+/g, " ")          // normalize spaces
    .replace(/\n{3,}/g, "\n\n")       // limit blank lines
    .replace(/•/g, "- ")              // normalize bullets
    .trim();
};

module.exports = { cleanText };
