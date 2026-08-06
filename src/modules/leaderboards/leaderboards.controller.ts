import { Request, Response } from "express";
import { LeaderboardsService } from "./leaderboards.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { LEADERBOARDS_MESSAGES } from "./leaderboards.constants";

export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  getTestLeaderboard = async (req: Request, res: Response): Promise<void> => {
    const testPaperId = req.params.testPaperId as string;
    const pagination = getPaginationParams(req.query);
    const filters = {
      stateId: req.query.stateId as string | undefined,
    };

    const result = await this.leaderboardsService.getTestLeaderboard(
      testPaperId,
      filters,
      pagination,
    );
    ApiResponse.success(res, LEADERBOARDS_MESSAGES.FETCHED_TEST, result);
  };
}
