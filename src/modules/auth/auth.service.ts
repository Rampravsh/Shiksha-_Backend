import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import {
  FirebaseLoginInput,
  RefreshTokenInput,
  AuthResponse,
  AuthTokens,
  TokenPayload,
} from "./auth.types";
import { hashToken } from "../../common/crypto";
import { jwtConfig } from "../../config/jwt";
import {
  verifyFirebaseToken,
  deleteFirebaseUser,
} from "../../integrations/firebase";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../../core/errors";
import { AUTH_MESSAGES } from "./auth.constants";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken };
  }

  async firebaseLogin(input: FirebaseLoginInput): Promise<AuthResponse> {
    const decodedToken = await verifyFirebaseToken(input.idToken);
    if (!decodedToken) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    const { uid, email, name, picture } = decodedToken;
    const userEmail = email || `${uid}@firebase.shiksha.app`;

    let user = await this.authRepository.findByFirebaseUid(uid);

    if (!user) {
      user = await this.authRepository.findByEmail(userEmail);
    }

    if (!user) {
      user = await this.authRepository.createUser({
        firebaseUid: uid,
        email: userEmail,
        fullName: name || "Learner",
      });
    }

    if (!user.isActive) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_DISABLED);
    }

    const tokens = this.generateTokens({
      userId: user.id,
      firebaseUid: user.firebaseUid,
      role: user.role,
    });

    const hashedRefreshToken = hashToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.authRepository.createSessionAndUpdateLastLogin({
      userId: user.id,
      hashedRefreshToken,
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      platform: input.platform,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: picture || user.avatarUrl,
        isActive: user.isActive,
      },
      tokens,
    };
  }

  async refresh(input: RefreshTokenInput): Promise<AuthTokens> {
    const token = input.refreshToken;
    if (!token) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    const hashedInputToken = hashToken(token);
    const session =
      await this.authRepository.findRefreshSessionByHash(hashedInputToken);

    if (!session) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    if (
      session.revokedAt !== null ||
      session.expiresAt < new Date() ||
      !session.user.isActive
    ) {
      if (session.revokedAt === null) {
        await this.authRepository.revokeRefreshSession(session.id);
      }
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    // Verify JWT structure
    try {
      jwt.verify(token, jwtConfig.refreshSecret);
    } catch {
      await this.authRepository.revokeRefreshSession(session.id);
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    // Rotate refresh token
    const newTokens = this.generateTokens({
      userId: session.user.id,
      firebaseUid: session.user.firebaseUid,
      role: session.user.role,
    });

    const newHashedToken = hashToken(newTokens.refreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authRepository.updateRefreshSession(
      session.id,
      newHashedToken,
      newExpiresAt,
    );

    return newTokens;
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      const hashed = hashToken(refreshToken);
      const session =
        await this.authRepository.findRefreshSessionByHash(hashed);
      if (session) {
        await this.authRepository.deleteRefreshSession(session.id);
      }
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.authRepository.deleteAllUserSessions(userId);
  }

  async getCurrentUser(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.authRepository.findById(userId);
    if (user && user.firebaseUid) {
      await deleteFirebaseUser(user.firebaseUid);
    }
    await this.authRepository.deleteUserAndSessions(userId);
  }

  async adminSetUserActiveStatus(userId: string, isActive: boolean) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!isActive) {
      return this.authRepository.disableUserAndSessions(userId);
    }

    return this.authRepository.updateActiveStatus(userId, isActive);
  }
}
