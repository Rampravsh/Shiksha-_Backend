import { TestAttempt, Prisma, AttemptStatus } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { LeaderboardQueryFilters } from "./leaderboards.types";

export class LeaderboardsRepository {
  async getTestRankings(
    testPaperId: string,
    filters: LeaderboardQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[TestAttempt[], number]> {
    const where: Prisma.TestAttemptWhereInput = {
      testPaperId,
      status: AttemptStatus.COMPLETED,
    };

    if (filters.stateId) {
      where.user = { stateId: filters.stateId };
    }

    return Promise.all([
      prisma.testAttempt.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              state: { select: { id: true, name: true, code: true } },
            },
          },
        },
        orderBy: [
          { score: "desc" },
          { totalCorrect: "desc" },
          { totalIncorrect: "asc" },
          { timeTakenSecs: "asc" },
          { submittedAt: "asc" },
        ],
      }),
      prisma.testAttempt.count({ where }),
    ]);
  }
}
