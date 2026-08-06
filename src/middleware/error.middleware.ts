import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../core/errors";
import { ApiResponse } from "../core/response";
import { HttpStatus } from "../core/http-status";
import { logger } from "../core/logger";
import { env } from "../config/env";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(
    {
      err,
      requestId: req.requestId,
      url: req.originalUrl,
      method: req.method,
    },
    "Unhandled Exception Captured",
  );

  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  const isProd = env.NODE_ENV === "production";
  const message = isProd ? "Internal server error" : err.message;
  const errors = isProd ? [] : [{ stack: err.stack }];

  ApiResponse.error(res, message, HttpStatus.INTERNAL_SERVER_ERROR, errors);
};
