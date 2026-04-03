// Centralised export of all environment variables.
// Import from here instead of process.env directly so IDE autocomplete works.

module.exports = {
  PORT:                    process.env.PORT || 5000,
  MONGO_URI:               process.env.MONGO_URI,
  JWT_SECRET:              process.env.JWT_SECRET,
  JWT_REFRESH_SECRET:      process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN:          process.env.JWT_EXPIRES_IN      || '15m',
  JWT_REFRESH_EXPIRES_IN:  process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  GOOGLE_AI_API_KEY:       process.env.GOOGLE_AI_API_KEY,
  AI_PROVIDER:             process.env.AI_PROVIDER || 'gemini',
  OLLAMA_URL:              process.env.OLLAMA_URL || 'http://localhost:11434',
  OLLAMA_MODEL:            process.env.OLLAMA_MODEL || 'qwen3.5:9b',
  NODE_ENV:                process.env.NODE_ENV             || 'development',
  CLIENT_URL:               process.env.CLIENT_URL           || 'http://localhost:5173',
};
