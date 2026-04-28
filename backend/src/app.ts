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

app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true
}));
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
