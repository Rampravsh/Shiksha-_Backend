import { Router } from "express";
import { LeaderboardsRepository } from "./leaderboards.repository";
import { LeaderboardsService } from "./leaderboards.service";
import { LeaderboardsController } from "./leaderboards.controller";
import { validateLeaderboardQuery } from "./leaderboards.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../core/async-handler";

const leaderboardsRepository = new LeaderboardsRepository();
const leaderboardsService = new LeaderboardsService(leaderboardsRepository);
const leaderboardsController = new LeaderboardsController(leaderboardsService);

const router = Router();

router.get(
  "/test/:testPaperId",
  authMiddleware,
  validateLeaderboardQuery,
  asyncHandler(leaderboardsController.getTestLeaderboard),
);

export const leaderboardsRouter = router;
