import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../core/errors";
import { ROLES } from "../core/roles";

export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    next(new UnauthorizedError());
    return;
  }

  if (req.user.role !== ROLES.ADMIN) {
    next(new ForbiddenError("Admin access required"));
    return;
  }

  next();
};
