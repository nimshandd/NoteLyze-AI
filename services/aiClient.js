// services/aiClient.js

const Groq = require("groq-sdk");
const OpenAI = require("openai");
const { encode } = require("gpt-tokenizer");
const { validateMCQOutput } = require("./mcqValidator"); // ✅ FIXED IMPORT

const provider = process.env.PROVIDER;

// --- API KEY VALIDATION ---
if (!provider) {
  throw new Error("PROVIDER not defined in .env");
}

if (provider === "groq" && !process.env.GROQ_API_KEY) {
  throw new Error("Groq API key missing in .env");
}

if (provider === "openai" && !process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key missing in .env");
}

// --- Clients ---
const groq =
  provider === "groq"
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

const openai =
  provider === "openai"
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

// --- Timeout Wrapper ---
async function callWithTimeout(promise, ms = 20000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI request timed out")), ms)
  );

  return Promise.race([promise, timeout]);
}

// --- Token Counter ---
function countTokens(text) {
  return encode(text).length;
}

/**
 * PRODUCTION-READY AI SERVICE
 */
const callAI = async (prompt, presetConfig) => {
  if (!prompt) {
    throw new Error("AI prompt is empty");
  }

  // 🔐 TOKEN GUARD
  const tokenCount = countTokens(prompt);
  if (tokenCount > 6000) {
    throw new Error("Prompt too large — exceeds safe token limit");
  }

  const messages = [
    {
      role: "user",
      content: prompt,
    },
  ];

  let attempts = 0;
  let response;
  let content;

  while (attempts < 2) {
    // 👉 GROQ MODE
    if (provider === "groq") {
      response = await callWithTimeout(
        groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.3,
        }),
        20000
      );
    }

    // 👉 OPENAI MODE
    else if (provider === "openai") {
      response = await callWithTimeout(
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.3,
        }),
        20000
      );
    }

    content = response.choices[0].message.content;

    // 🧠 STRICT MCQ VALIDATION
    if (presetConfig?.type === "mcq") {
      const validation = validateMCQOutput(
        content,
        presetConfig.questionCount
      );

      if (validation.valid) {
        break; // ✅ valid output
      } else {
        console.log("MCQ validation failed:", validation.error);
      }
    } else {
      break; // not MCQ preset
    }

    attempts++;
  }

  if (presetConfig?.type === "mcq" && attempts === 2) {
    console.warn("MCQ generation failed after 2 attempts");
  }

  // 📊 TOKEN LOGGING
  if (response?.usage) {
    console.log("Prompt tokens:", response.usage.prompt_tokens);
    console.log("Completion tokens:", response.usage.completion_tokens);
    console.log("Total tokens:", response.usage.total_tokens);
  }

  return content;
};

module.exports = { callAI };