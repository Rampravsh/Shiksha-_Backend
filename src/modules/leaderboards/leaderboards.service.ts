import { TestAttempt, User } from "@prisma/client";
import { LeaderboardsRepository } from "./leaderboards.repository";
import {
  LeaderboardEntry,
  LeaderboardQueryFilters,
} from "./leaderboards.types";
import { NotFoundError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { LEADERBOARDS_MESSAGES } from "./leaderboards.constants";
import { prisma } from "../../core/prisma";

type AttemptWithUser = TestAttempt & {
  user?: Partial<User> & { state?: { name: string } };
};

export class LeaderboardsService {
  constructor(
    private readonly leaderboardsRepository: LeaderboardsRepository,
  ) {}

  async getTestLeaderboard(
    testPaperId: string,
    filters: LeaderboardQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<LeaderboardEntry>> {
    const testPaper = await prisma.testPaper.findUnique({
      where: { id: testPaperId },
    });
    if (!testPaper) {
      throw new NotFoundError(LEADERBOARDS_MESSAGES.NOT_FOUND);
    }

    const [attempts, total] = await this.leaderboardsRepository.getTestRankings(
      testPaperId,
      filters,
      pagination.skip,
      pagination.limit,
    );

    const entries: LeaderboardEntry[] = attempts.map((attempt, index) => {
      const rank = pagination.skip + index + 1;
      const percentile =
        total > 1
          ? Math.round(((total - rank) / (total - 1)) * 100 * 100) / 100
          : 100;

      const u = (attempt as AttemptWithUser).user;
      return {
        rank,
        attemptId: attempt.id,
        userId: attempt.userId,
        userFullName: u?.fullName || "Learner",
        userAvatarUrl: u?.avatarUrl,
        stateName: u?.state?.name,
        score: attempt.score,
        totalCorrect: attempt.totalCorrect,
        totalIncorrect: attempt.totalIncorrect,
        timeTakenSecs: attempt.timeTakenSecs,
        accuracy: attempt.accuracy,
        percentile,
        submittedAt: attempt.submittedAt,
      };
    });

    return createPaginatedResponse(entries, total, pagination);
  }
}
