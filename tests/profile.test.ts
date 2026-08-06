import { ProfileService } from "../src/modules/profile/profile.service";
import { ProfileRepository } from "../src/modules/profile/profile.repository";
import { NotFoundError } from "../src/core/errors";
import { User } from "@prisma/client";

describe("Profile Module Unit Tests", () => {
  let profileRepository: jest.Mocked<ProfileRepository>;
  let profileService: ProfileService;

  beforeEach(() => {
    profileRepository = {
      findById: jest.fn(),
      updateProfile: jest.fn(),
      removeAvatar: jest.fn(),
      getStatistics: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    profileService = new ProfileService(profileRepository);
    jest.clearAllMocks();
  });

  it("should fetch current logged in user profile", async () => {
    profileRepository.findById.mockResolvedValue({
      id: "u-1",
      fullName: "Test User",
      email: "test@example.com",
    } as unknown as User);

    const result = await profileService.getProfile("u-1");
    expect(result.fullName).toBe("Test User");
  });

  it("should throw NotFoundError if profile user does not exist", async () => {
    profileRepository.findById.mockResolvedValue(null);

    await expect(profileService.getProfile("non-existent")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should update profile fields", async () => {
    profileRepository.findById.mockResolvedValue({
      id: "u-1",
    } as unknown as User);
    profileRepository.updateProfile.mockResolvedValue({
      id: "u-1",
      fullName: "Updated Name",
    } as unknown as User);

    const result = await profileService.updateProfile("u-1", {
      fullName: "Updated Name",
    });
    expect(result.fullName).toBe("Updated Name");
  });
});
