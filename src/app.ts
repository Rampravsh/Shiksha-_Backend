import express, { Application } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import yaml from "yaml";

import { env } from "./config/env";
import {
  helmetMiddleware,
  corsMiddleware,
} from "./middleware/security.middleware";
import { globalRateLimiter } from "./middleware/rate-limit.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import rootRouter from "./routes";

export const createApp = (): Application => {
  const app: Application = express();

  // Trust proxy for rate limiter and headers behind AWS ALB/Nginx
  app.set("trust proxy", 1);

  // Healthcheck for Railway / AWS ALB load balancers (bypasses rate limit)
  app.get(["/health/live", "/api/v1/health/live"], (_req, res) => {
    res.status(200).json({ status: "UP", uptime: process.uptime() });
  });

  // Security Middleware
  app.use(requestIdMiddleware);
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(globalRateLimiter);

  // Request Parsing & Compression
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // HTTP Request Logging
  app.use(loggerMiddleware);

  // OpenAPI / Swagger Documentation Setup
  try {
    const openapiPath = path.resolve(process.cwd(), "openapi.yaml");
    if (fs.existsSync(openapiPath)) {
      const openapiFile = fs.readFileSync(openapiPath, "utf8");
      const swaggerDocument = yaml.parse(openapiFile);
      app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  } catch (error) {
    console.error("Failed to load Swagger documentation file:", error);
  }

  // Primary API Router Mounting
  app.use(env.API_PREFIX, rootRouter);

  // 404 & Error Handler
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
