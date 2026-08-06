import { AuthService } from "../src/modules/auth/auth.service";
import { AuthRepository } from "../src/modules/auth/auth.repository";
import { Role, User, RefreshSession } from "@prisma/client";
import { verifyFirebaseToken } from "../src/integrations/firebase";
import { hashToken } from "../src/common/crypto";
import { UnauthorizedError, ForbiddenError } from "../src/core/errors";

describe("Auth Module Unit Tests (Firebase Auth & RefreshSession)", () => {
  let authRepository: jest.Mocked<AuthRepository>;
  let authService: AuthService;

  beforeEach(() => {
    authRepository = {
      findByEmail: jest.fn(),
      findByFirebaseUid: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
      updateLastLogin: jest.fn(),
      updateActiveStatus: jest.fn(),
      createRefreshSession: jest.fn(),
      createSessionAndUpdateLastLogin: jest.fn(),
      deleteUserAndSessions: jest.fn(),
      disableUserAndSessions: jest.fn(),
      findRefreshSessionByHash: jest.fn(),
      updateRefreshSession: jest.fn(),
      revokeRefreshSession: jest.fn(),
      deleteRefreshSession: jest.fn(),
      deleteAllUserSessions: jest.fn(),
      deleteUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    authService = new AuthService(authRepository);
    jest.clearAllMocks();
  });

  describe("Firebase Login", () => {
    it("should authenticate existing user with valid Firebase ID token", async () => {
      const mockDecodedToken = {
        uid: "fb_user_123",
        email: "student@shiksha.app",
        name: "Shiksha Student",
        picture: "https://cloudinary.com/avatar.jpg",
      };

      const mockUser: User = {
        id: "user-uuid-1",
        firebaseUid: "fb_user_123",
        email: "student@shiksha.app",
        fullName: "Shiksha Student",
        role: Role.USER,
        phone: null,
        dateOfBirth: null,
        avatarUrl: "https://cloudinary.com/avatar.jpg",
        bio: null,
        stateId: null,
        fcmToken: null,
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (verifyFirebaseToken as jest.Mock).mockResolvedValue(mockDecodedToken);
      authRepository.findByFirebaseUid.mockResolvedValue(mockUser);
      authRepository.updateLastLogin.mockResolvedValue(mockUser);
      authRepository.createSessionAndUpdateLastLogin.mockResolvedValue(
        {} as RefreshSession,
      );

      const result = await authService.firebaseLogin({
        idToken: "valid-firebase-id-token",
        deviceId: "device-1",
      });

      expect(result.user.email).toBe("student@shiksha.app");
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(authRepository.createSessionAndUpdateLastLogin).toHaveBeenCalled();
    });

    it("should throw ForbiddenError if user is disabled", async () => {
      const mockDecodedToken = {
        uid: "fb_disabled_user",
        email: "disabled@shiksha.app",
      };

      const mockDisabledUser = {
        id: "user-disabled-id",
        firebaseUid: "fb_disabled_user",
        email: "disabled@shiksha.app",
        fullName: "Disabled User",
        role: Role.USER,
        isActive: false,
      } as unknown as User;

      (verifyFirebaseToken as jest.Mock).mockResolvedValue(mockDecodedToken);
      authRepository.findByFirebaseUid.mockResolvedValue(mockDisabledUser);

      await expect(
        authService.firebaseLogin({ idToken: "valid-token" }),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("Refresh Token Rotation & Revocation", () => {
    it("should rotate refresh token and issue new access token for valid session", async () => {
      const initialTokens = authService.generateTokens({
        userId: "user-1",
        firebaseUid: "fb-1",
        role: Role.USER,
      });

      const hashedToken = hashToken(initialTokens.refreshToken);

      const mockSession = {
        id: "session-1",
        userId: "user-1",
        hashedRefreshToken: hashedToken,
        expiresAt: new Date(Date.now() + 100000),
        revokedAt: null,
        user: {
          id: "user-1",
          firebaseUid: "fb-1",
          role: Role.USER,
          isActive: true,
        },
      } as unknown as RefreshSession & { user: User };

      authRepository.findRefreshSessionByHash.mockResolvedValue(mockSession);
      authRepository.updateRefreshSession.mockResolvedValue(mockSession);

      const newTokens = await authService.refresh({
        refreshToken: initialTokens.refreshToken,
      });

      expect(newTokens.accessToken).toBeDefined();
      expect(newTokens.refreshToken).toBeDefined();
      expect(authRepository.updateRefreshSession).toHaveBeenCalled();
    });

    it("should throw UnauthorizedError and revoke session if session is expired or revoked", async () => {
      const mockRevokedSession = {
        id: "session-2",
        userId: "user-2",
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 100000),
        user: { isActive: true },
      } as unknown as RefreshSession & { user: User };

      authRepository.findRefreshSessionByHash.mockResolvedValue(
        mockRevokedSession,
      );

      await expect(
        authService.refresh({ refreshToken: "some-revoked-token" }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("Logout & Logout All Devices", () => {
    it("should delete refresh session on logout", async () => {
      const mockSession = { id: "session-to-delete" } as RefreshSession & {
        user: User;
      };
      authRepository.findRefreshSessionByHash.mockResolvedValue(mockSession);
      authRepository.deleteRefreshSession.mockResolvedValue(mockSession);

      await authService.logout("raw-refresh-token");

      expect(authRepository.deleteRefreshSession).toHaveBeenCalledWith(
        "session-to-delete",
      );
    });

    it("should delete all user refresh sessions on logoutAll", async () => {
      authRepository.deleteAllUserSessions.mockResolvedValue({ count: 3 });

      await authService.logoutAll("user-uuid-1");

      expect(authRepository.deleteAllUserSessions).toHaveBeenCalledWith(
        "user-uuid-1",
      );
    });
  });
});
