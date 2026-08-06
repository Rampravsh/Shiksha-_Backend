import pinoHttp from "pino-http";
import { logger } from "../core/logger";

export const loggerMiddleware = pinoHttp({
  logger,
  genReqId: (req) =>
    ((req as unknown as Record<string, unknown>).requestId as string) ||
    (req.headers["x-request-id"] as string) ||
    "unknown",
  autoLogging: {
    ignore: (req) => {
      const url = req.url || "";
      // Ignore static Swagger UI assets to prevent terminal log flooding
      return (
        url.startsWith("/docs") ||
        url.includes("swagger-ui") ||
        url.includes("favicon")
      );
    },
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} completed with status ${res.statusCode}`,
  customErrorMessage: (req, _res, err) =>
    `${req.method} ${req.url} failed with message: ${err?.message || "Unknown error"}`,
});
