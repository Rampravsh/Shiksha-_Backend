import { z } from "zod";

export const saveAnswerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID"),
  selectedAnswer: z.any().optional(),
  timeTakenSecs: z.number().int().min(0).optional().default(0),
  isMarkedForReview: z.boolean().optional().default(false),
  isSkipped: z.boolean().optional().default(false),
});

export const attemptAnswerParamsSchema = z.object({
  attemptId: z.string().uuid("Invalid attempt ID"),
});
