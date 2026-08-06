import { TestAttempt, Prisma, AttemptStatus } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { TestAttemptQueryFilters } from "./test-attempts.types";

export interface AnswerEvaluationUpdate {
  id: string;
  isCorrect: boolean;
  marksAwarded: number;
}

export interface EvaluationData {
  status: AttemptStatus;
  submittedAt: Date;
  timeTakenSecs: number;
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  score: number;
  maxScore: number;
  accuracy: number;
}

export class TestAttemptsRepository {
  async findByUserId(
    userId: string,
    filters: TestAttemptQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[TestAttempt[], number]> {
    const where: Prisma.TestAttemptWhereInput = { userId };
    if (filters.testPaperId) where.testPaperId = filters.testPaperId;
    if (filters.status) where.status = filters.status;

    return Promise.all([
      prisma.testAttempt.findMany({
        where,
        skip,
        take: limit,
        include: {
          testPaper: {
            select: {
              id: true,
              title: true,
              slug: true,
              totalMarks: true,
              totalQuestions: true,
            },
          },
        },
        orderBy: { startedAt: "desc" },
      }),
      prisma.testAttempt.count({ where }),
    ]);
  }

  async findById(id: string): Promise<TestAttempt | null> {
    return prisma.testAttempt.findUnique({
      where: { id },
      include: {
        testPaper: true,
        attemptAnswers: {
          include: {
            question: true,
          },
        },
      },
    });
  }

  async findActiveUserAttempt(
    userId: string,
    testPaperId: string,
  ): Promise<TestAttempt | null> {
    return prisma.testAttempt.findFirst({
      where: {
        userId,
        testPaperId,
        status: AttemptStatus.IN_PROGRESS,
      },
      include: {
        testPaper: true,
      },
    });
  }

  async create(userId: string, testPaperId: string): Promise<TestAttempt> {
    return prisma.testAttempt.create({
      data: {
        userId,
        testPaperId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      include: {
        testPaper: true,
      },
    });
  }

  async updateEvaluation(
    id: string,
    data: EvaluationData,
  ): Promise<TestAttempt> {
    return prisma.testAttempt.update({
      where: { id },
      data,
      include: {
        testPaper: true,
        attemptAnswers: true,
      },
    });
  }

  async submitEvaluationTransaction(
    attemptId: string,
    answerUpdates: AnswerEvaluationUpdate[],
    evaluationData: EvaluationData,
  ): Promise<TestAttempt> {
    return prisma.$transaction(async (tx) => {
      for (const update of answerUpdates) {
        await tx.attemptAnswer.update({
          where: { id: update.id },
          data: {
            isCorrect: update.isCorrect,
            isSkipped: false,
            marksAwarded: update.marksAwarded,
          },
        });
      }

      return tx.testAttempt.update({
        where: { id: attemptId },
        data: evaluationData,
        include: {
          testPaper: true,
          attemptAnswers: true,
        },
      });
    });
  }
}
