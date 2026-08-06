import { z } from "zod";

export const addTestQuestionSchema = z.object({
  questionId: z.string().uuid("Invalid question ID"),
  sortOrder: z.number().int().optional().default(0),
});

export const bulkAddTestQuestionsSchema = z.object({
  questions: z
    .array(addTestQuestionSchema)
    .min(1, "At least one question is required"),
});

export const reorderTestQuestionsSchema = z.object({
  items: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        sortOrder: z.number().int(),
      }),
    )
    .min(1, "At least one item is required"),
});

export const testQuestionParamsSchema = z.object({
  testPaperId: z.string().uuid("Invalid test paper ID"),
  questionId: z.string().uuid("Invalid question ID").optional(),
});
