import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { USERS_MESSAGES } from "./users.constants";
import { UpdateUserProfileInput } from "./users.types";
import { Role } from "@prisma/client";
import { UnauthorizedError, BadRequestError } from "../../core/errors";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = req.user.id;
    const user = await this.usersService.getUserById(userId);
    ApiResponse.success(res, USERS_MESSAGES.FETCHED_PROFILE, user);
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = req.user.id;
    const input: UpdateUserProfileInput = req.body;
    const updatedUser = await this.usersService.updateProfile(userId, input);
    ApiResponse.success(res, USERS_MESSAGES.UPDATED_PROFILE, updatedUser);
  };

  updateAvatar = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const userId = req.user.id;

    if (req.file) {
      // 1. Image File Upload via Multer -> Cloudinary
      const updatedUser = await this.usersService.uploadAvatarFile(
        userId,
        req.file,
      );
      ApiResponse.success(res, USERS_MESSAGES.UPDATED_AVATAR, updatedUser);
      return;
    }

    if (req.body && req.body.avatarUrl) {
      // 2. Direct avatar URL update
      const updatedUser = await this.usersService.updateAvatar(
        userId,
        req.body.avatarUrl,
      );
      ApiResponse.success(res, USERS_MESSAGES.UPDATED_AVATAR, updatedUser);
      return;
    }

    throw new BadRequestError(
      "Please upload an avatar image file or provide an avatarUrl",
    );
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      role: req.query.role as Role | undefined,
      stateId: req.query.stateId as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.usersService.getAllUsers(filters, pagination);
    ApiResponse.success(res, USERS_MESSAGES.FETCHED_ALL, result);
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.usersService.getUserById(id);
    ApiResponse.success(res, USERS_MESSAGES.FETCHED_ONE, user);
  };

  activateUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.usersService.setUserActiveStatus(id, true);
    ApiResponse.success(res, USERS_MESSAGES.ACTIVATED, user);
  };

  deactivateUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.usersService.setUserActiveStatus(id, false);
    ApiResponse.success(res, USERS_MESSAGES.DEACTIVATED, user);
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedUser = await this.usersService.deleteUser(id);
    ApiResponse.success(res, USERS_MESSAGES.DELETED, deletedUser);
  };
}
