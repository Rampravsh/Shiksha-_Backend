import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().max(15).optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500).optional(),
  stateId: z.string().uuid().optional(),
});
