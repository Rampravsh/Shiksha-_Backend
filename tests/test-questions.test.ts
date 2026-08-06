import { TestQuestionsService } from "../src/modules/test-questions/test-questions.service";
import { TestQuestionsRepository } from "../src/modules/test-questions/test-questions.repository";
import { ConflictError } from "../src/core/errors";
import { prisma } from "../src/core/prisma";
import { TestQuestion } from "@prisma/client";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    testPaper: { findUnique: jest.fn(), update: jest.fn() },
    question: { findUnique: jest.fn() },
  },
}));

describe("Test Questions Module Unit Tests", () => {
  let testQuestionsRepository: jest.Mocked<TestQuestionsRepository>;
  let testQuestionsService: TestQuestionsService;

  beforeEach(() => {
    testQuestionsRepository = {
      findByTestPaperId: jest.fn(),
      findByTestAndQuestion: jest.fn(),
      addQuestion: jest.fn(),
      addManyQuestions: jest.fn(),
      reorderQuestions: jest.fn(),
      removeQuestion: jest.fn(),
      countByTestPaperId: jest.fn(),
      addQuestionWithTotalsRecalculation: jest.fn(),
      removeQuestionWithTotalsRecalculation: jest.fn(),
    } as unknown as jest.Mocked<TestQuestionsRepository>;

    testQuestionsService = new TestQuestionsService(testQuestionsRepository);
    jest.clearAllMocks();
  });

  it("should fetch questions for a test paper", async () => {
    (prisma.testPaper.findUnique as jest.Mock).mockResolvedValue({
      id: "tp-1",
    });
    const mockTq = [
      { id: "tq-1", testPaperId: "tp-1", questionId: "q-1" },
    ] as unknown as TestQuestion[];
    testQuestionsRepository.findByTestPaperId.mockResolvedValue(mockTq);

    const result = await testQuestionsService.getQuestionsByTestPaperId("tp-1");

    expect(result).toHaveLength(1);
  });

  it("should add question to test paper and recalculate totals", async () => {
    (prisma.testPaper.findUnique as jest.Mock).mockResolvedValue({
      id: "tp-1",
    });
    (prisma.question.findUnique as jest.Mock).mockResolvedValue({ id: "q-1" });
    testQuestionsRepository.findByTestAndQuestion.mockResolvedValue(null);
    testQuestionsRepository.addQuestionWithTotalsRecalculation.mockResolvedValue(
      {
        id: "tq-1",
        testPaperId: "tp-1",
        questionId: "q-1",
      } as unknown as TestQuestion,
    );
    testQuestionsRepository.countByTestPaperId.mockResolvedValue({
      count: 1,
      totalMarks: 1.0,
    });

    const result = await testQuestionsService.addQuestionToTest("tp-1", {
      questionId: "q-1",
    });

    expect(result.questionId).toBe("q-1");
  });

  it("should throw ConflictError if question already attached to test paper", async () => {
    (prisma.testPaper.findUnique as jest.Mock).mockResolvedValue({
      id: "tp-1",
    });
    (prisma.question.findUnique as jest.Mock).mockResolvedValue({ id: "q-1" });
    testQuestionsRepository.findByTestAndQuestion.mockResolvedValue({
      id: "existing-tq",
    } as unknown as TestQuestion);

    await expect(
      testQuestionsService.addQuestionToTest("tp-1", { questionId: "q-1" }),
    ).rejects.toThrow(ConflictError);
  });
});
