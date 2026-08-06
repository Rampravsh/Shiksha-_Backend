import { Role } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  firebaseUid: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firebaseUid: string;
    email: string;
    fullName: string;
    role: Role;
    avatarUrl?: string | null;
    isActive: boolean;
  };
  tokens: AuthTokens;
}

export interface FirebaseLoginInput {
  idToken: string;
  deviceId?: string;
  deviceName?: string;
  platform?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RefreshTokenInput {
  refreshToken?: string;
  deviceId?: string;
  deviceName?: string;
  platform?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RefreshSessionInfo {
  id: string;
  deviceId?: string | null;
  deviceName?: string | null;
  platform?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt: Date;
}
