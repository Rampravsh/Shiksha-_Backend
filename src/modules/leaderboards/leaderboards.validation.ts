import { validateRequest } from "../../middleware/validation.middleware";
import {
  leaderboardQuerySchema,
  leaderboardParamsSchema,
} from "./leaderboards.schema";

export const validateLeaderboardQuery = validateRequest({
  params: leaderboardParamsSchema,
  query: leaderboardQuerySchema,
});
