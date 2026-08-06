import { HttpStatus, HttpStatusCode } from "./http-status";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly errors: unknown[];

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errors: unknown[] = [],
    isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errors: unknown[] = []) {
    super(message, HttpStatus.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors: unknown[] = []) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, errors);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests, please try again later.") {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, [], false);
  }
}
