import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../core/errors";

export const permissionMiddleware = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
};
