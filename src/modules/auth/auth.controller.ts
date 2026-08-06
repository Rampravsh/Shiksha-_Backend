import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../core/response";
import { AUTH_MESSAGES } from "./auth.constants";
import { FirebaseLoginInput, RefreshTokenInput } from "./auth.types";
import { UnauthorizedError } from "../../core/errors";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  firebaseLogin = async (req: Request, res: Response): Promise<void> => {
    const body: FirebaseLoginInput = req.body;
    const input: FirebaseLoginInput = {
      ...body,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    const result = await this.authService.firebaseLogin(input);
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    ApiResponse.success(res, AUTH_MESSAGES.LOGGED_IN, result);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const rawToken = req.body.refreshToken || req.cookies?.refreshToken;
    const body: RefreshTokenInput = req.body;
    const input: RefreshTokenInput = {
      ...body,
      refreshToken: rawToken,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    const tokens = await this.authService.refresh(input);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    ApiResponse.success(res, AUTH_MESSAGES.TOKEN_REFRESHED, tokens);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    ApiResponse.success(res, AUTH_MESSAGES.LOGGED_OUT, null);
  };

  logoutAll = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    await this.authService.logoutAll(req.user.id);
    res.clearCookie("refreshToken");
    ApiResponse.success(res, AUTH_MESSAGES.LOGGED_OUT_ALL, null);
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = req.user.id;
    const user = await this.authService.getCurrentUser(userId);
    ApiResponse.success(res, "Current user session fetched", user);
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = req.user.id;
    await this.authService.deleteAccount(userId);
    res.clearCookie("refreshToken");
    ApiResponse.success(res, "Account deleted successfully", null);
  };

  adminDisableUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.authService.adminSetUserActiveStatus(id, false);
    ApiResponse.success(res, AUTH_MESSAGES.USER_DISABLED, user);
  };

  adminEnableUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.authService.adminSetUserActiveStatus(id, true);
    ApiResponse.success(res, AUTH_MESSAGES.USER_ENABLED, user);
  };
}
