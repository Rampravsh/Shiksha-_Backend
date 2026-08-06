import { Role } from "@prisma/client";

export interface UserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  dateOfBirth?: Date | null;
  avatarUrl?: string | null;
  bio?: string | null;
  stateId?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  state?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface UpdateUserProfileInput {
  fullName?: string;
  phone?: string;
  dateOfBirth?: Date;
  stateId?: string;
  bio?: string;
}

export interface UpdateAvatarInput {
  avatarUrl: string;
}

export interface UserQueryFilters {
  search?: string;
  role?: Role;
  stateId?: string;
  isActive?: boolean;
}
