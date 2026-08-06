import { TestAttemptsService } from "../src/modules/test-attempts/test-attempts.service";
import { TestAttemptsRepository } from "../src/modules/test-attempts/test-attempts.repository";
import { AttemptStatus, TestAttempt } from "@prisma/client";
import { prisma } from "../src/core/prisma";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    testPaper: { findUnique: jest.fn() },
    testQuestion: { findMany: jest.fn() },
    attemptAnswer: { findMany: jest.fn(), update: jest.fn() },
  },
}));

describe("Test Attempts Module Unit Tests", () => {
  let testAttemptsRepository: jest.Mocked<TestAttemptsRepository>;
  let testAttemptsService: TestAttemptsService;

  beforeEach(() => {
    testAttemptsRepository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      findActiveUserAttempt: jest.fn(),
      create: jest.fn(),
      updateEvaluation: jest.fn(),
      submitEvaluationTransaction: jest.fn(),
    } as unknown as jest.Mocked<TestAttemptsRepository>;

    testAttemptsService = new TestAttemptsService(testAttemptsRepository);
    jest.clearAllMocks();
  });

  it("should start new test attempt when test paper exists and active", async () => {
    (prisma.testPaper.findUnique as jest.Mock).mockResolvedValue({
      id: "tp-1",
      isActive: true,
    });
    testAttemptsRepository.findActiveUserAttempt.mockResolvedValue(null);
    testAttemptsRepository.create.mockResolvedValue({
      id: "att-1",
      userId: "user-1",
      testPaperId: "tp-1",
      status: AttemptStatus.IN_PROGRESS,
    } as unknown as TestAttempt);

    const result = await testAttemptsService.startAttempt("user-1", "tp-1");

    expect(result.id).toBe("att-1");
  });

  it("should return existing active attempt if already in progress", async () => {
    (prisma.testPaper.findUnique as jest.Mock).mockResolvedValue({
      id: "tp-1",
      isActive: true,
    });
    testAttemptsRepository.findActiveUserAttempt.mockResolvedValue({
      id: "existing-att",
      status: AttemptStatus.IN_PROGRESS,
    } as unknown as TestAttempt);

    const result = await testAttemptsService.startAttempt("user-1", "tp-1");

    expect(result.id).toBe("existing-att");
  });

  it("should evaluate score and submit attempt deterministically", async () => {
    const mockAttempt = {
      id: "att-1",
      userId: "user-1",
      testPaperId: "tp-1",
      status: AttemptStatus.IN_PROGRESS,
      startedAt: new Date(Date.now() - 60000),
    } as unknown as TestAttempt;

    testAttemptsRepository.findById.mockResolvedValue(mockAttempt);
    (prisma.testQuestion.findMany as jest.Mock).mockResolvedValue([
      {
        questionId: "q-1",
        marks: 2.0,
        negativeMarks: 0.5,
        question: { correctAnswer: "A" },
      },
    ]);
    (prisma.attemptAnswer.findMany as jest.Mock).mockResolvedValue([
      { id: "ans-1", questionId: "q-1", userAnswer: "A", timeSpentSeconds: 30 },
    ]);

    testAttemptsRepository.submitEvaluationTransaction.mockResolvedValue({
      id: "att-1",
      status: AttemptStatus.COMPLETED,
      score: 2.0,
      totalCorrect: 1,
    } as unknown as TestAttempt);

    const result = await testAttemptsService.submitAttempt("user-1", "att-1");

    expect(result.status).toBe(AttemptStatus.COMPLETED);
  });
});
