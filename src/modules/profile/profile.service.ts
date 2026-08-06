import { User } from "@prisma/client";
import { ProfileRepository } from "./profile.repository";
import { UpdateProfileInput, ProfileStatistics } from "./profile.types";
import { NotFoundError } from "../../core/errors";
import { PROFILE_MESSAGES } from "./profile.constants";

export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.profileRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(PROFILE_MESSAGES.NOT_FOUND);
    }
    return user;
  }

  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<User> {
    await this.getProfile(userId);
    return this.profileRepository.updateProfile(userId, input);
  }

  async removeAvatar(userId: string): Promise<User> {
    await this.getProfile(userId);
    return this.profileRepository.removeAvatar(userId);
  }

  async getStatistics(userId: string): Promise<ProfileStatistics> {
    await this.getProfile(userId);
    return this.profileRepository.getStatistics(userId);
  }
}
