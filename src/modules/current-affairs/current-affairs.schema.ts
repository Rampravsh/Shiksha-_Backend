import { z } from "zod";

export const createCurrentAffairSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  imageUrl: z.string().url().optional(),
  isPublished: z.boolean().optional().default(false),
});

export const updateCurrentAffairSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  imageUrl: z.string().url().optional(),
  isPublished: z.boolean().optional(),
});

export const currentAffairQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  isPublished: z.string().optional(),
});

export const currentAffairIdParamSchema = z.object({
  id: z.string().min(1, "Current affair ID or slug is required"),
});
