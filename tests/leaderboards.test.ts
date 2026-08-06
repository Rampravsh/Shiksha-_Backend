import { LeaderboardsService } from "../src/modules/leaderboards/leaderboards.service";
import { LeaderboardsRepository } from "../src/modules/leaderboards/leaderboards.repository";
import { prisma } from "../src/core/prisma";
import { TestAttempt } from "@prisma/client";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    testPaper: { findUnique: jest.fn() },
  },
}));

describe("Leaderboards Module Unit Tests", () => {
  let leaderboardsRepository: jest.Mocked<LeaderboardsRepository>;
  let leaderboardsService: LeaderboardsService;

  beforeEach(() => {
    leaderboardsRepository = {
      getTestRankings: jest.fn(),
    } as unknown as jest.Mocked<LeaderboardsRepository>;

    leaderboardsService = new LeaderboardsService(leaderboardsRepository);
    jest.clearAllMocks();
  });

  it("should fetch deterministic rankings for a test paper", async () => {
    (prisma.testPaper.findUnique as jest.Mock).mockResolvedValue({
      id: "tp-1",
    });

    const mockAttempts = [
      {
        id: "att-1",
        userId: "u-1",
        score: 90,
        totalCorrect: 45,
        totalIncorrect: 5,
        timeTakenSecs: 1800,
        accuracy: 90,
        submittedAt: new Date(),
        user: {
          fullName: "Top Scorer",
          avatarUrl: null,
          state: { name: "Delhi" },
        },
      },
    ] as unknown as TestAttempt[];

    leaderboardsRepository.getTestRankings.mockResolvedValue([mockAttempts, 1]);

    const result = await leaderboardsService.getTestLeaderboard(
      "tp-1",
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].rank).toBe(1);
    expect(result.data[0].score).toBe(90);
  });
});
