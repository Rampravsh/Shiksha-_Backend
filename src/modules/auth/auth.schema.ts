import { z } from "zod";

export const firebaseLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
  platform: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
  platform: z.string().optional(),
});
