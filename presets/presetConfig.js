const PRESETS = {
  /* =========================
     CORE NOTE PRESETS
  ========================= */

  exam: {
    key: "exam",
    name: "Exam Focused Notes",
    description: "Definitions and key exam-oriented points only",
    compressionLevel: "medium",
    maxWordsPerSection: 120,
    outputStyle: "bullets",
    rules: [
      "definitions_only",
      "key_points_only",
      "no_examples",
      "concise_explanations",
      "exam_relevant_only"
    ]
  },

  full: {
    key: "full",
    name: "Full Lecture Notes",
    description: "Complete, structured lecture notes with explanations",
    compressionLevel: "low",
    maxWordsPerSection: 300,
    outputStyle: "structured_paragraphs",
    rules: [
      "include_definitions",
      "include_explanations",
      "include_examples",
      "preserve_structure",
      "detailed_coverage"
    ]
  },

  cheat: {
    key: "cheat",
    name: "Quick Revision / Cheat Sheet",
    description: "Ultra-short last-minute revision notes",
    compressionLevel: "high",
    maxWordsPerSection: 50,
    outputStyle: "one_liners",
    rules: [
      "keywords_only",
      "one_line_definitions",
      "remove_explanations",
      "no_filler_text",
      "high_density_info"
    ],
    maxChunks: 1
  },

  /* =========================
     QUESTION GENERATION
  ========================= */

mcq: {
  key: "mcq",
  type: "mcq",
  name: "MCQ Generator",
  description: "Multiple choice questions for self-testing",
  outputStyle: "mcq",
  questionCount: 20,
  rules: [
    "generate_mcq",
    "four_options_each",
    "single_correct_answer",
    "highlight_correct_answer",
    "exam_relevant_only"
  ],
  maxChunks: 2
},

  shortQA: {
    key: "shortQA",
    name: "Short Answer Q&A",
    description: "Exam-style short questions with answers",
    outputStyle: "qa",
    questionCount: 20,
    rules: [
      "generate_questions",
      "short_answers_only",
      "exam_style_language",
      "direct_answers"
    ]
  },

  /* =========================
     CONTENT FILTERING
  ========================= */

  definitionsOnly: {
    key: "definitionsOnly",
    name: "Definitions Only",
    description: "Pure definition list for memorization",
    compressionLevel: "high",
    outputStyle: "definitions",
    rules: [
      "definitions_only",
      "no_explanations",
      "no_examples",
      "clear_and_precise"
    ]
  },

  eli5: {
    key: "eli5",
    name: "Explain Like I'm 5",
    description: "Very simple explanations for beginners",
    compressionLevel: "medium",
    outputStyle: "simple_paragraphs",
    rules: [
      "very_simple_language",
      "short_sentences",
      "use_analogies",
      "no_jargon",
      "beginner_friendly"
    ]
  },

  /* =========================
     STRUCTURED OUTPUT
  ========================= */

  comparison: {
    key: "comparison",
    name: "Comparison Tables",
    description: "Side-by-side comparison of related concepts",
    outputStyle: "table",
    rules: [
      "identify_related_concepts",
      "generate_comparison_table",
      "concise_cells",
      "clear_headings"
    ]
  },

  formulaSheet: {
    key: "formulaSheet",
    name: "Formula / Code Sheet",
    description: "Formulas and code snippets only",
    compressionLevel: "high",
    outputStyle: "formula",
    rules: [
      "extract_formulas",
      "extract_code_snippets",
      "no_explanations",
      "no_examples"
    ]
  },

 
};

module.exports = { PRESETS };
