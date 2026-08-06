import { Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { ApiResponse } from "../../core/response";
import { PROFILE_MESSAGES } from "./profile.constants";
import { UpdateProfileInput } from "./profile.types";
import { UnauthorizedError } from "../../core/errors";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const profile = await this.profileService.getProfile(req.user.id);
    ApiResponse.success(res, PROFILE_MESSAGES.FETCHED, profile);
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const input: UpdateProfileInput = req.body;
    const updated = await this.profileService.updateProfile(req.user.id, input);
    ApiResponse.success(res, PROFILE_MESSAGES.UPDATED, updated);
  };

  removeAvatar = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const updated = await this.profileService.removeAvatar(req.user.id);
    ApiResponse.success(res, PROFILE_MESSAGES.AVATAR_DELETED, updated);
  };

  getStatistics = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const stats = await this.profileService.getStatistics(req.user.id);
    ApiResponse.success(res, PROFILE_MESSAGES.STATISTICS, stats);
  };
}
