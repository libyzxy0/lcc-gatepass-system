import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000, /* 1 minute */
  max: 100, /* 100 requests per minute */
})

/* Prevent spammer sh*ts and para makatipid sa resources */