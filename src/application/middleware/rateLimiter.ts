import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  legacyHeaders: false,
  limit: 100,
  standardHeaders: "draft-8",
  windowMs: 1 * 60 * 1000,
});
