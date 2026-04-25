import { rateLimit } from "express-rate-limit";

function createLimiter(max: number, windowMs: number, code: string, message: string) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res, _next, options) => {
      return res.status(options.statusCode).json({
        code,
        message,
      });
    },
  });
}

export const authLoginRateLimit = createLimiter(
  10,
  15 * 60 * 1000,
  "AUTH_LOGIN_RATE_LIMITED",
  "Too many login attempts, please try again later"
);

export const authRegisterRateLimit = createLimiter(
  5,
  60 * 60 * 1000,
  "AUTH_REGISTER_RATE_LIMITED",
  "Too many registration attempts, please try again later"
);

export const rfqRateLimit = createLimiter(
  120,
  15 * 60 * 1000,
  "RFQ_RATE_LIMITED",
  "Too many RFQ requests, please try again later"
);