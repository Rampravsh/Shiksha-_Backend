import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../src/middleware/auth.middleware";
import { jwtConfig } from "../src/config/jwt";
import { UnauthorizedError } from "../src/core/errors";

describe("Auth Middleware Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
    };
    res = {};
    next = jest.fn();
  });

  it("should pass authentication with valid Bearer JWT access token", () => {
    const token = jwt.sign(
      { userId: "db-user-uuid-100", email: "test@shiksha.app", role: "USER" },
      jwtConfig.accessSecret,
      { expiresIn: "15m" },
    );

    req.headers = { authorization: `Bearer ${token}` };

    authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user?.id).toBe("db-user-uuid-100");
    expect(req.user?.email).toBe("test@shiksha.app");
    expect(req.user?.role).toBe("USER");
  });

  it("should pass authentication with valid cookie accessToken", () => {
    const token = jwt.sign(
      {
        userId: "db-user-uuid-200",
        email: "cookie@shiksha.app",
        role: "ADMIN",
      },
      jwtConfig.accessSecret,
      { expiresIn: "15m" },
    );

    req.cookies = { accessToken: token };

    authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user?.id).toBe("db-user-uuid-200");
    expect(req.user?.role).toBe("ADMIN");
  });

  it("should fail when authorization token is missing", () => {
    authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("should fail when JWT access token is invalid or expired", () => {
    req.headers = { authorization: "Bearer invalid-junk-token" };

    authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
