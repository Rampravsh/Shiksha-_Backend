import { AttemptAnswersService } from "../src/modules/attempt-answers/attempt-answers.service";
import { AttemptAnswersRepository } from "../src/modules/attempt-answers/attempt-answers.repository";
import { BadRequestError } from "../src/core/errors";
import { AttemptStatus, AttemptAnswer } from "@prisma/client";
import { prisma } from "../src/core/prisma";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    testAttempt: { findUnique: jest.fn() },
  },
}));

describe("Attempt Answers Module Unit Tests", () => {
  let attemptAnswersRepository: jest.Mocked<AttemptAnswersRepository>;
  let attemptAnswersService: AttemptAnswersService;

  beforeEach(() => {
    attemptAnswersRepository = {
      findByAttemptId: jest.fn(),
      upsertAnswer: jest.fn(),
    } as unknown as jest.Mocked<AttemptAnswersRepository>;

    attemptAnswersService = new AttemptAnswersService(attemptAnswersRepository);
    jest.clearAllMocks();
  });

  it("should save answer progress for active attempt", async () => {
    (prisma.testAttempt.findUnique as jest.Mock).mockResolvedValue({
      id: "att-1",
      userId: "user-1",
      status: AttemptStatus.IN_PROGRESS,
    });

    attemptAnswersRepository.upsertAnswer.mockResolvedValue({
      id: "ans-1",
      attemptId: "att-1",
      questionId: "q-1",
      userAnswer: "A",
    } as unknown as AttemptAnswer);

    const result = await attemptAnswersService.saveAnswerProgress(
      "user-1",
      "att-1",
      {
        questionId: "q-1",
        userAnswer: "A",
        timeSpentSeconds: 15,
      },
    );

    expect(result.userAnswer).toBe("A");
  });

  it("should throw BadRequestError if attempt is already submitted", async () => {
    (prisma.testAttempt.findUnique as jest.Mock).mockResolvedValue({
      id: "att-1",
      userId: "user-1",
      status: AttemptStatus.SUBMITTED,
    });

    await expect(
      attemptAnswersService.saveAnswerProgress("user-1", "att-1", {
        questionId: "q-1",
        userAnswer: "A",
      }),
    ).rejects.toThrow(BadRequestError);
  });
});
