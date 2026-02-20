const { interpretRules } = require("./ruleInterpreter");

/**
 * GLOBAL STRICT MODE
 * Forces the AI to obey format and rules exactly
 */
const STRICT_MODE = true;

/**
 * Builds the final AI prompt based on:
 * - extracted text
 * - selected preset config
 */
function buildPrompt({ text, preset }) {
  if (!text || !preset) {
    throw new Error("Missing text or preset in prompt builder");
  }

  const ruleInstructions = interpretRules(preset.rules);

  let outputFormatInstruction = "";

  switch (preset.outputStyle) {
    case "bullets":
      outputFormatInstruction =
        "Present the output using bullet points under clear headings.";
      break;

    case "structured_paragraphs":
      outputFormatInstruction =
        "Present the output using structured paragraphs with headings and subheadings.";
      break;

    case "one_liners":
      outputFormatInstruction =
        "Each point must be a single concise line.";
      break;

    case "mcq":
      outputFormatInstruction = `
Generate EXACTLY ${preset.questionCount || 10} multiple-choice questions.

Format EXACTLY as:
Q1. Question text
A. Option A
B. Option B
C. Option C
D. Option D
Correct Answer: X
`;
      break;

    case "qa":
      outputFormatInstruction = `
Generate EXACTLY ${preset.questionCount || 10} questions.

Format EXACTLY as:
Q1. Question
Answer:
`;
      break;

    case "definitions":
      outputFormatInstruction =
        "List terms followed by their definitions. One definition per line.";
      break;

    case "simple_paragraphs":
      outputFormatInstruction =
        "Use very simple paragraphs with extremely easy language.";
      break;

    case "table":
      outputFormatInstruction =
        "Present the output strictly as a table. Do NOT add explanations outside the table.";
      break;

    case "formula":
      outputFormatInstruction =
        "List ONLY formulas or code snippets. No explanations.";
      break;

    case "flashcards":
      outputFormatInstruction = `
Generate flashcards in the EXACT format:
Card 1:
Q: Question
A: Answer
`;
      break;

    default:
      outputFormatInstruction =
        "Present the output in a clear and structured format.";
  }

  let lengthInstruction = "";
  if (preset.maxWordsPerSection) {
    lengthInstruction = `Each section must NOT exceed ${preset.maxWordsPerSection} words.`;
  }

  const strictBlock = STRICT_MODE
    ? `
STRICT MODE ENABLED:
- Follow ALL rules EXACTLY.
- Output format must be followed word-for-word.
- Do NOT add extra text.
- Do NOT explain what you are doing.
- If rules conflict, prioritize FORMAT RULES.
`
    : "";

  const prompt = `
You are an expert university lecturer and exam paper setter.

TASK:
Generate content strictly according to the preset rules below.

PRESET: ${preset.name}
DESCRIPTION: ${preset.description}

RULES:
${ruleInstructions}

FORMAT RULES:
${outputFormatInstruction}

LENGTH RULES:
${lengthInstruction}

${strictBlock}

IMPORTANT:
- Do NOT invent information.
- Use ONLY the provided content.
- Do NOT add introductions or conclusions unless explicitly required.

CONTENT TO PROCESS:
"""
${text}
"""
`;

  return prompt.trim();
}

module.exports = { buildPrompt };
