// config/appConfig.js

require("dotenv").config();

const appConfig = {
  server: {
    port: process.env.PORT
      ? parseInt(process.env.PORT)
      : 5000,

    nodeEnv:
      process.env.NODE_ENV || "development"
  },

  ai: {
    apiKey:
      process.env.OPENAI_API_KEY || ""
  },

  processing: {
    defaultCompression:
      process.env.DEFAULT_COMPRESSION || "medium",

    maxChunks:
      process.env.MAX_CHUNKS
        ? parseInt(process.env.MAX_CHUNKS)
        : 3
  }
};

module.exports = appConfig;