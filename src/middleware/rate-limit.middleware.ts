import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "../config/rate-limit";

export const globalRateLimiter = rateLimit(rateLimitConfig);

export const strictAuthRateLimiter = rateLimit({
  ...rateLimitConfig,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
    timestamp: new Date().toISOString(),
  },
});
