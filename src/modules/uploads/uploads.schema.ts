import { z } from "zod";

export const uploadQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  folder: z.string().optional(),
  uploadedById: z.string().uuid().optional(),
});

export const uploadIdParamSchema = z.object({
  id: z.string().min(1, "Upload ID or publicId is required"),
});
