import { Response } from "express";
import { HttpStatus, HttpStatusCode } from "./http-status";

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  statusCode: HttpStatusCode;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: HttpStatusCode = HttpStatus.OK,
    meta?: Record<string, unknown>,
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      statusCode,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  public static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, HttpStatus.CREATED);
  }

  public static noContent(res: Response): Response {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  public static error(
    res: Response,
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errors: unknown[] = [],
  ): Response {
    const payload = {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
