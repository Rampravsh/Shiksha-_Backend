import { User } from "@prisma/client";
import { UsersRepository } from "./users.repository";
import { UpdateUserProfileInput, UserQueryFilters } from "./users.types";
import { NotFoundError, BadRequestError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { USERS_MESSAGES } from "./users.constants";
import { prisma } from "../../core/prisma";
import { uploadImageBuffer } from "../../integrations/cloudinary";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError(USERS_MESSAGES.NOT_FOUND);
    }
    return user;
  }

  async updateProfile(
    userId: string,
    input: UpdateUserProfileInput,
  ): Promise<User> {
    await this.getUserById(userId);

    if (input.stateId) {
      const state = await prisma.state.findUnique({
        where: { id: input.stateId },
      });
      if (!state) {
        throw new NotFoundError(USERS_MESSAGES.STATE_NOT_FOUND);
      }
    }

    return this.usersRepository.updateProfile(userId, input);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    await this.getUserById(userId);
    return this.usersRepository.updateAvatar(userId, avatarUrl);
  }

  async uploadAvatarFile(
    userId: string,
    file?: Express.Multer.File,
  ): Promise<User> {
    await this.getUserById(userId);

    if (!file) {
      throw new BadRequestError("Avatar image file is required");
    }

    // 1. Upload image buffer directly to Cloudinary
    const uploadResult = await uploadImageBuffer(
      file.buffer,
      "shiksha/avatars",
    );

    // 2. Save file upload metadata to PostgreSQL uploads table
    await this.usersRepository.createUploadRecord({
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      folder: uploadResult.folder,
      uploadedById: userId,
    });

    // 3. Update user avatarUrl field
    return this.usersRepository.updateAvatar(userId, uploadResult.secure_url);
  }

  async getAllUsers(
    filters: UserQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<User>> {
    const [data, total] = await this.usersRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async setUserActiveStatus(userId: string, isActive: boolean): Promise<User> {
    await this.getUserById(userId);
    return this.usersRepository.setActiveStatus(userId, isActive);
  }

  async deleteUser(userId: string): Promise<User> {
    await this.getUserById(userId);
    return this.usersRepository.delete(userId);
  }
}
