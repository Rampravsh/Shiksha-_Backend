import { User, RefreshSession, Role, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";

export interface CreateUserData {
  firebaseUid: string;
  email: string;
  fullName: string;
  role?: Role;
}

export interface CreateRefreshSessionData {
  userId: string;
  hashedRefreshToken: string;
  deviceId?: string;
  deviceName?: string;
  platform?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export class AuthRepository {
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        firebaseUid: data.firebaseUid,
        email: data.email.toLowerCase(),
        fullName: data.fullName,
        role: data.role || Role.USER,
        isActive: true,
      },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async createRefreshSession(
    data: CreateRefreshSessionData,
  ): Promise<RefreshSession> {
    return prisma.refreshSession.create({
      data: {
        userId: data.userId,
        hashedRefreshToken: data.hashedRefreshToken,
        deviceId: data.deviceId,
        deviceName: data.deviceName,
        platform: data.platform,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
      },
    });
  }

  async createSessionAndUpdateLastLogin(
    sessionData: CreateRefreshSessionData,
  ): Promise<RefreshSession> {
    const [session] = await prisma.$transaction([
      prisma.refreshSession.create({
        data: {
          userId: sessionData.userId,
          hashedRefreshToken: sessionData.hashedRefreshToken,
          deviceId: sessionData.deviceId,
          deviceName: sessionData.deviceName,
          platform: sessionData.platform,
          ipAddress: sessionData.ipAddress,
          userAgent: sessionData.userAgent,
          expiresAt: sessionData.expiresAt,
        },
      }),
      prisma.user.update({
        where: { id: sessionData.userId },
        data: { lastLoginAt: new Date() },
      }),
    ]);
    return session;
  }

  async findRefreshSessionByHash(
    hashedRefreshToken: string,
  ): Promise<(RefreshSession & { user: User }) | null> {
    return prisma.refreshSession.findUnique({
      where: { hashedRefreshToken },
      include: { user: true },
    });
  }

  async updateRefreshSession(
    sessionId: string,
    newHashedRefreshToken: string,
    newExpiresAt: Date,
  ): Promise<RefreshSession> {
    return prisma.refreshSession.update({
      where: { id: sessionId },
      data: {
        hashedRefreshToken: newHashedRefreshToken,
        expiresAt: newExpiresAt,
        lastUsedAt: new Date(),
      },
    });
  }

  async revokeRefreshSession(sessionId: string): Promise<RefreshSession> {
    return prisma.refreshSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async deleteRefreshSession(sessionId: string): Promise<RefreshSession> {
    return prisma.refreshSession.delete({
      where: { id: sessionId },
    });
  }

  async deleteAllUserSessions(userId: string): Promise<Prisma.BatchPayload> {
    return prisma.refreshSession.deleteMany({
      where: { userId },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async deleteUserAndSessions(userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.refreshSession.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  }

  async disableUserAndSessions(userId: string): Promise<User> {
    const [, user] = await prisma.$transaction([
      prisma.refreshSession.deleteMany({ where: { userId } }),
      prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      }),
    ]);
    return user;
  }
}
