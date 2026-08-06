import { TestAttempt, AttemptStatus } from "@prisma/client";
import {
  TestAttemptsRepository,
  AnswerEvaluationUpdate,
} from "./test-attempts.repository";
import { TestAttemptQueryFilters } from "./test-attempts.types";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { TEST_ATTEMPTS_MESSAGES } from "./test-attempts.constants";
import { prisma } from "../../core/prisma";

export class TestAttemptsService {
  constructor(
    private readonly testAttemptsRepository: TestAttemptsRepository,
  ) {}

  async startAttempt(
    userId: string,
    testPaperId: string,
  ): Promise<TestAttempt> {
    const testPaper = await prisma.testPaper.findUnique({
      where: { id: testPaperId },
    });
    if (!testPaper) {
      throw new NotFoundError(TEST_ATTEMPTS_MESSAGES.TEST_NOT_FOUND);
    }

    const activeAttempt =
      await this.testAttemptsRepository.findActiveUserAttempt(
        userId,
        testPaperId,
      );
    if (activeAttempt) {
      return activeAttempt;
    }

    return this.testAttemptsRepository.create(userId, testPaperId);
  }

  async getAttemptById(
    userId: string,
    attemptId: string,
  ): Promise<TestAttempt> {
    const attempt = await this.testAttemptsRepository.findById(attemptId);
    if (!attempt) {
      throw new NotFoundError(TEST_ATTEMPTS_MESSAGES.NOT_FOUND);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenError(TEST_ATTEMPTS_MESSAGES.FORBIDDEN_ACCESS);
    }

    return attempt;
  }

  async getUserAttemptHistory(
    userId: string,
    filters: TestAttemptQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TestAttempt>> {
    const [data, total] = await this.testAttemptsRepository.findByUserId(
      userId,
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async submitAttempt(userId: string, attemptId: string): Promise<TestAttempt> {
    const attempt = await this.getAttemptById(userId, attemptId);

    if (attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestError(TEST_ATTEMPTS_MESSAGES.ALREADY_SUBMITTED);
    }

    const testPaper = await prisma.testPaper.findUnique({
      where: { id: attempt.testPaperId },
    });

    const testQuestions = await prisma.testQuestion.findMany({
      where: { testPaperId: attempt.testPaperId },
      include: { question: true },
    });

    const userAnswers = await prisma.attemptAnswer.findMany({
      where: { testAttemptId: attemptId },
    });

    const answerMap = new Map(userAnswers.map((a) => [a.questionId, a]));

    let totalScore = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalSkipped = 0;
    let totalTimeSpent = 0;
    const answerUpdates: AnswerEvaluationUpdate[] = [];

    for (const tq of testQuestions) {
      const ans = answerMap.get(tq.questionId);
      if (
        !ans ||
        ans.selectedAnswer === null ||
        ans.selectedAnswer === undefined
      ) {
        totalSkipped++;
      } else {
        totalTimeSpent += ans.timeTakenSecs;
        const isCorrect = evaluateAnswer(
          ans.selectedAnswer,
          tq.question.correctAnswer,
        );
        if (isCorrect) {
          totalCorrect++;
          const marks = tq.question.marks;
          totalScore += marks;
          answerUpdates.push({
            id: ans.id,
            isCorrect: true,
            marksAwarded: marks,
          });
        } else {
          totalIncorrect++;
          const negMarks = tq.question.negativeMarks;
          totalScore -= negMarks;
          answerUpdates.push({
            id: ans.id,
            isCorrect: false,
            marksAwarded: -negMarks,
          });
        }
      }
    }

    const totalAttempted = totalCorrect + totalIncorrect;
    const accuracy =
      totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const submittedAt = new Date();
    const timeTakenSecs = Math.max(
      totalTimeSpent,
      Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000),
    );

    return this.testAttemptsRepository.submitEvaluationTransaction(
      attemptId,
      answerUpdates,
      {
        status: AttemptStatus.COMPLETED,
        submittedAt,
        timeTakenSecs,
        totalQuestions: testQuestions.length,
        totalAttempted,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        score: Math.max(0, totalScore),
        maxScore: testPaper?.totalMarks || 0,
        accuracy: Math.round(accuracy * 100) / 100,
      },
    );
  }
}

function evaluateAnswer(userAnswer: unknown, correctAnswer: unknown): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;
  const userStr = JSON.stringify(userAnswer).trim().toLowerCase();
  const correctStr = JSON.stringify(correctAnswer).trim().toLowerCase();
  return userStr === correctStr;
}
