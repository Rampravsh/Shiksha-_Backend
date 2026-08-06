import { z } from "zod";
import { ExamCategoryType } from "@prisma/client";

export const createExamCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Exam Category name must be at least 2 characters")
    .max(100),
  categoryId: z.string().uuid("Category ID must be a valid UUID"),
  type: z
    .nativeEnum(ExamCategoryType)
    .optional()
    .default(ExamCategoryType.NATIONAL),
  description: z.string().max(500).optional(),
  iconUrl: z.string().url("Icon URL must be a valid URL").optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const updateExamCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  categoryId: z.string().uuid().optional(),
  type: z.nativeEnum(ExamCategoryType).optional(),
  description: z.string().max(500).optional(),
  iconUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const examCategoryQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.nativeEnum(ExamCategoryType).optional(),
  isActive: z.string().optional(),
});

export const examCategoryIdParamSchema = z.object({
  id: z.string().min(1, "Exam Category ID or slug is required"),
});
