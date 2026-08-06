import { z } from "zod";
import { Role } from "@prisma/client";
import { REGEX_PATTERNS } from "../../common/regex";

export const updateUserProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100)
    .optional(),
  phone: z
    .string()
    .regex(REGEX_PATTERNS.PHONE_INDIAN, "Invalid 10-digit Indian phone number")
    .optional(),
  dateOfBirth: z.string().datetime().or(z.date()).optional(),
  stateId: z.string().uuid("Invalid state ID").optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z.string().url("Invalid avatar URL"),
});

export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  stateId: z.string().uuid().optional(),
  isActive: z.string().optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("User ID must be a valid UUID"),
});
