import { z } from "zod";

export const leaderboardQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  stateId: z.string().uuid().optional(),
});

export const leaderboardParamsSchema = z.object({
  testPaperId: z.string().uuid("Invalid test paper ID"),
});
