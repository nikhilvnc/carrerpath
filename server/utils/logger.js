/**
 * Structured Logger utility
 * Logs timestamp, level, request details, and avoids logging sensitive PII/secrets.
 */

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  // Sanitize meta to ensure passwords, tokens, API keys are never printed
  const safeMeta = { ...meta };
  const sensitiveKeys = ['password', 'password_hash', 'token', 'jwt', 'apiKey', 'authorization'];
  
  for (const key of Object.keys(safeMeta)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      safeMeta[key] = '[REDACTED]';
    }
  }

  return JSON.stringify({
    timestamp,
    level,
    message,
    ...(Object.keys(safeMeta).length > 0 ? { meta: safeMeta } : {})
  });
};

const logger = {
  info: (msg, meta) => {
    console.log(formatMessage('INFO', msg, meta));
  },
  warn: (msg, meta) => {
    console.warn(formatMessage('WARN', msg, meta));
  },
  error: (msg, meta) => {
    console.error(formatMessage('ERROR', msg, meta));
  },
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('DEBUG', msg, meta));
    }
  }
};

module.exports = logger;
