import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { kycRouter } from "./routes/kyc.js";
import { listingsRouter } from "./routes/listings.js";
import { metricsRouter } from "./routes/metrics.js";
import { rfqRouter } from "./routes/rfq.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { rfqRateLimit } from "./middleware/rateLimit.js";

export const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOriginSet = new Set(allowedOrigins);

// Allow any *.vercel.app subdomain that starts with "raseen" to cover preview deployments
const VERCEL_PATTERN = /^https:\/\/raseen[a-zA-Z0-9-]*\.vercel\.app$/;

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOriginSet.has(origin) || VERCEL_PATTERN.test(origin)) {
        return callback(null, true);
      }

      return callback(
        Object.assign(new Error("CORS origin is not allowed"), {
          status: 403,
          code: "CORS_ORIGIN_DENIED",
        })
      );
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ service: "raseen-backend", version: "1.0.0" });
});

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/kyc", kycRouter);
app.use("/listings", listingsRouter);
app.use("/rfq", rfqRateLimit, rfqRouter);
app.use("/metrics", metricsRouter);

app.use(notFound);
app.use(errorHandler);
