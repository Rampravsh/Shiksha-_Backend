import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { UnauthorizedError } from "../core/errors";
import { AuthUser } from "../types/express";
import { ROLES } from "../core/roles";

interface DecodedJwt {
  id?: string;
  userId?: string;
  email?: string;
  firebaseUid?: string;
  role?: (typeof ROLES)[keyof typeof ROLES];
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError("Authentication token missing");
    }

    // Verify Backend JWT Access Token ONLY
    try {
      const decoded = jwt.verify(token, jwtConfig.accessSecret) as DecodedJwt;
      const userId = decoded.userId || decoded.id;

      if (!userId) {
        throw new UnauthorizedError("Invalid token payload");
      }

      req.user = {
        id: userId,
        email: decoded.email || "",
        firebaseUid: decoded.firebaseUid || "",
        role: decoded.role || ROLES.USER,
      } as AuthUser;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new UnauthorizedError("Invalid or expired authentication token");
    }
  } catch (error) {
    next(error);
  }
};
