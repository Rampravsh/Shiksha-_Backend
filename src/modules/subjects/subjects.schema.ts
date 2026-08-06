import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters")
    .max(150),
  examId: z.string().uuid("Invalid exam ID"),
  iconUrl: z.string().url("Invalid icon URL").optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  examId: z.string().uuid().optional(),
  iconUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const subjectQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  examId: z.string().optional(),
  isActive: z.string().optional(),
});

export const subjectIdParamSchema = z.object({
  id: z.string().min(1, "Subject ID or slug is required"),
});
