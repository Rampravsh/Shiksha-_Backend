import { TestQuestion } from "@prisma/client";
import { TestQuestionsRepository } from "./test-questions.repository";
import {
  AddTestQuestionInput,
  ReorderTestQuestionsInput,
} from "./test-questions.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import { TEST_QUESTIONS_MESSAGES } from "./test-questions.constants";
import { prisma } from "../../core/prisma";

export class TestQuestionsService {
  constructor(
    private readonly testQuestionsRepository: TestQuestionsRepository,
  ) {}

  async getQuestionsByTestPaperId(
    testPaperId: string,
  ): Promise<TestQuestion[]> {
    const testPaper = await prisma.testPaper.findUnique({
      where: { id: testPaperId },
    });
    if (!testPaper) {
      throw new NotFoundError(TEST_QUESTIONS_MESSAGES.TEST_NOT_FOUND);
    }

    return this.testQuestionsRepository.findByTestPaperId(testPaperId);
  }

  async addQuestionToTest(
    testPaperId: string,
    input: AddTestQuestionInput,
  ): Promise<TestQuestion> {
    const testPaper = await prisma.testPaper.findUnique({
      where: { id: testPaperId },
    });
    if (!testPaper) {
      throw new NotFoundError(TEST_QUESTIONS_MESSAGES.TEST_NOT_FOUND);
    }

    const question = await prisma.question.findUnique({
      where: { id: input.questionId },
    });
    if (!question) {
      throw new NotFoundError(TEST_QUESTIONS_MESSAGES.QUESTION_NOT_FOUND);
    }

    const existing = await this.testQuestionsRepository.findByTestAndQuestion(
      testPaperId,
      input.questionId,
    );
    if (existing) {
      throw new ConflictError(TEST_QUESTIONS_MESSAGES.ALREADY_ATTACHED);
    }

    return this.testQuestionsRepository.addQuestionWithTotalsRecalculation(
      testPaperId,
      input,
    );
  }

  async bulkAddQuestionsToTest(
    testPaperId: string,
    questions: AddTestQuestionInput[],
  ): Promise<{ count: number }> {
    const testPaper = await prisma.testPaper.findUnique({
      where: { id: testPaperId },
    });
    if (!testPaper) {
      throw new NotFoundError(TEST_QUESTIONS_MESSAGES.TEST_NOT_FOUND);
    }

    const count = await this.testQuestionsRepository.addManyQuestions(
      testPaperId,
      questions,
    );
    await this.recalculateTestTotals(testPaperId);
    return { count };
  }

  async reorderTestQuestions(
    testPaperId: string,
    input: ReorderTestQuestionsInput,
  ): Promise<void> {
    const testPaper = await prisma.testPaper.findUnique({
      where: { id: testPaperId },
    });
    if (!testPaper) {
      throw new NotFoundError(TEST_QUESTIONS_MESSAGES.TEST_NOT_FOUND);
    }

    await this.testQuestionsRepository.reorderQuestions(testPaperId, input);
  }

  async removeQuestionFromTest(
    testPaperId: string,
    questionId: string,
  ): Promise<TestQuestion> {
    const existing = await this.testQuestionsRepository.findByTestAndQuestion(
      testPaperId,
      questionId,
    );
    if (!existing) {
      throw new NotFoundError(TEST_QUESTIONS_MESSAGES.NOT_FOUND);
    }

    return this.testQuestionsRepository.removeQuestionWithTotalsRecalculation(
      testPaperId,
      questionId,
    );
  }

  private async recalculateTestTotals(testPaperId: string): Promise<void> {
    const { count, totalMarks } =
      await this.testQuestionsRepository.countByTestPaperId(testPaperId);
    await prisma.testPaper.update({
      where: { id: testPaperId },
      data: {
        totalQuestions: count,
        totalMarks,
      },
    });
  }
}
