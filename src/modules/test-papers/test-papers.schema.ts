import { z } from "zod";
import { Language } from "@prisma/client";

export const createTestPaperSchema = z.object({
  title: z.string().min(2, "Test title must be at least 2 characters").max(150),
  examId: z.string().uuid("Invalid exam ID"),
  description: z.string().max(2000).optional(),
  durationMins: z.number().positive().optional().default(60),
  totalMarks: z.number().min(0).optional().default(100.0),
  positiveMarks: z.number().min(0).optional().default(1.0),
  negativeMarks: z.number().min(0).optional().default(0.0),
  language: z.nativeEnum(Language).optional().default(Language.ENGLISH),
  isPublished: z.boolean().optional().default(false),
});

export const updateTestPaperSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  examId: z.string().uuid().optional(),
  description: z.string().max(2000).optional(),
  durationMins: z.number().positive().optional(),
  totalMarks: z.number().min(0).optional(),
  positiveMarks: z.number().min(0).optional(),
  negativeMarks: z.number().min(0).optional(),
  language: z.nativeEnum(Language).optional(),
  isPublished: z.boolean().optional(),
});

export const testPaperQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  examId: z.string().optional(),
  language: z.nativeEnum(Language).optional(),
  isPublished: z.string().optional(),
});

export const testPaperIdParamSchema = z.object({
  id: z.string().min(1, "Test Paper ID or slug is required"),
});
