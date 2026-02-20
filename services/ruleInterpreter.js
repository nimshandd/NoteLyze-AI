/**
 * Maps preset rules to explicit AI instructions
 * This is the brain of the preset system
 */

const RULE_MAP = {
  /* =========================
     CONTENT INCLUSION / EXCLUSION
  ========================= */

  definitions_only:
    "Include ONLY clear, exam-relevant definitions. Do not add explanations or examples.",

  include_definitions:
    "Include clear and accurate definitions for all important terms.",

  key_points_only:
    "Extract only key points and important facts. Ignore descriptive or narrative content.",

  include_explanations:
    "Provide clear explanations for each concept.",

  concise_explanations:
    "Keep explanations very short and to the point.",

  remove_explanations:
    "Do not include explanations of any kind.",

  no_examples:
    "Do not include examples, stories, or case studies.",

  include_examples:
    "Include relevant examples where helpful.",

  exam_relevant_only:
    "Focus only on content that is likely to appear in exams.",

  detailed_coverage:
    "Cover the topic in detail without skipping important subtopics.",

  preserve_structure:
    "Preserve the original lecture structure and topic order.",

  /* =========================
     COMPRESSION & STYLE
  ========================= */

  keywords_only:
    "Use keywords and phrases only. Avoid full sentences.",

  one_line_definitions:
    "Each definition must be exactly one line.",

  no_filler_text:
    "Do not include filler words, introductions, or conclusions.",

  high_density_info:
    "Pack maximum information into minimum text.",

  short_sentences:
    "Use very short and simple sentences.",

  very_simple_language:
    "Use extremely simple language suitable for a 5-year-old.",

  no_jargon:
    "Avoid technical jargon. Replace with simple words.",

  beginner_friendly:
    "Assume the reader has no prior knowledge.",

  /* =========================
     QUESTION GENERATION
  ========================= */

  generate_mcq:
    "Generate multiple-choice questions based strictly on the content.",

  four_options_each:
    "Each question must have exactly four answer options.",

  single_correct_answer:
    "Only one option must be correct.",

  highlight_correct_answer:
    "Clearly mark the correct answer.",

  generate_questions:
    "Generate exam-style questions from the content.",

  short_answers_only:
    "Answers must be short (2–5 lines maximum).",

  exam_style_language:
    "Use formal exam-style wording.",

  direct_answers:
    "Answers must be direct and factual.",

  /* =========================
     STRUCTURED OUTPUT
  ========================= */

  generate_comparison_table:
    "Present information strictly in table format.",

  identify_related_concepts:
    "Identify related or contrasting concepts suitable for comparison.",

  concise_cells:
    "Each table cell must be concise and precise.",

  clear_headings:
    "Use clear and meaningful table headings.",

  extract_formulas:
    "Extract and list only formulas.",

  extract_code_snippets:
    "Extract only relevant code snippets.",

  no_explanations:
    "Do not explain formulas or code.",

  question_answer_pairs:
    "Generate question–answer pairs.",

  active_recall_style:
    "Design content to encourage active recall.",

  one_concept_per_card:
    "Each flashcard must cover exactly one concept."
};

/**
 * Converts rule keys into a single instruction block
 */
function interpretRules(rules = []) {
  return rules
    .map(rule => RULE_MAP[rule])
    .filter(Boolean)
    .join("\n");
}

module.exports = { interpretRules };
