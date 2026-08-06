import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().min(2, "Exam title must be at least 2 characters").max(150),
  examCategoryId: z.string().uuid("Invalid exam category ID"),
  stateId: z.string().uuid("Invalid state ID").optional(),
  description: z.string().max(1000).optional(),
  iconUrl: z.string().url("Invalid icon URL").optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const updateExamSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  examCategoryId: z.string().uuid().optional(),
  stateId: z.string().uuid().optional(),
  description: z.string().max(1000).optional(),
  iconUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const examQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  examCategoryId: z.string().optional(),
  stateId: z.string().optional(),
  isActive: z.string().optional(),
});

export const examIdParamSchema = z.object({
  id: z.string().min(1, "Exam ID or slug is required"),
});
