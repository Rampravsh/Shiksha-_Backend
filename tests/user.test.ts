import { UsersService } from "../src/modules/users/users.service";
import { UsersRepository } from "../src/modules/users/users.repository";
import { Role } from "@prisma/client";

describe("Users Module Unit Tests", () => {
  let usersRepository: jest.Mocked<UsersRepository>;
  let usersService: UsersService;

  beforeEach(() => {
    usersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByFirebaseUid: jest.fn(),
      findByEmail: jest.fn(),
      updateProfile: jest.fn(),
      updateAvatar: jest.fn(),
      setActiveStatus: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    usersService = new UsersService(usersRepository);
  });

  it("should fetch user profile by ID", async () => {
    const mockUser = {
      id: "user-100",
      firebaseUid: "fb_100",
      email: "learner@shiksha.app",
      passwordHash: null,
      fullName: "Sample Student",
      role: Role.USER,
      phone: "9876543210",
      dateOfBirth: null,
      avatarUrl: null,
      bio: null,
      stateId: null,
      fcmToken: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: null,
    };

    usersRepository.findById.mockResolvedValue(mockUser);

    const result = await usersService.getUserById("user-100");

    expect(result.fullName).toBe("Sample Student");
    expect(usersRepository.findById).toHaveBeenCalledWith("user-100");
  });
});
