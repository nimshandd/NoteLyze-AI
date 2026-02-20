const applyPreset = (chunks, presetConfig) => {
  return chunks.map((chunk, index) => ({
    section: `Section ${index + 1}`,
    content: chunk,
    presetApplied: presetConfig.name,
    rulesUsed: presetConfig.rules
  }));
};

module.exports = { applyPreset };
