import { z } from "zod";

export const startAttemptSchema = z.object({
  testPaperId: z.string().uuid("Invalid test paper ID"),
});

export const attemptIdParamSchema = z.object({
  id: z.string().uuid("Invalid attempt ID"),
});

export const attemptQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  testPaperId: z.string().optional(),
});
