const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Extract text from PPTX using Python microservice
 * @param {Buffer} buffer - PPTX file buffer from multer
 * @returns {Promise<string>} extracted text
 */
const extractPptxText = async (buffer) => {
  if (!buffer) {
    throw new Error("No PPTX buffer provided");
  }

  // 1️⃣ write buffer to temp file
  const tempFilePath = path.join(
    os.tmpdir(),
    `pptx-${Date.now()}.pptx`
  );

  fs.writeFileSync(tempFilePath, buffer);

  try {
    // 2️⃣ send file to python service
    const form = new FormData();
    form.append("file", fs.createReadStream(tempFilePath));

    const response = await axios.post(
      "http://localhost:7000/extract-pptx",
      form,
      {
        headers: form.getHeaders(),
        timeout: 15000
      }
    );

    if (!response.data || !response.data.slides) {
      throw new Error("Invalid response from PPTX service");
    }

    // 3️⃣ merge slide text
    const text = response.data.slides
      .map(slide => slide.text)
      .join("\n\n");

    return text;

  } catch (err) {
    throw new Error(`PPTX extraction failed: ${err.message}`);
  } finally {
    // 4️⃣ cleanup temp file (always)
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};

module.exports = { extractPptxText };
