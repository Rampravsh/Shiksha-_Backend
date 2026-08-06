import { AttemptAnswer, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { SaveAnswerInput } from "./attempt-answers.types";

export class AttemptAnswersRepository {
  async findByAttemptId(testAttemptId: string): Promise<AttemptAnswer[]> {
    return prisma.attemptAnswer.findMany({
      where: { testAttemptId },
      include: {
        question: {
          select: { id: true, textEn: true, type: true, options: true },
        },
      },
    });
  }

  async upsertAnswer(
    testAttemptId: string,
    data: SaveAnswerInput,
  ): Promise<AttemptAnswer> {
    const isSkipped =
      data.isSkipped !== undefined
        ? data.isSkipped
        : data.selectedAnswer === undefined || data.selectedAnswer === null;

    return prisma.attemptAnswer.upsert({
      where: {
        testAttemptId_questionId: {
          testAttemptId,
          questionId: data.questionId,
        },
      },
      create: {
        testAttemptId,
        questionId: data.questionId,
        selectedAnswer: data.selectedAnswer as Prisma.InputJsonValue,
        timeTakenSecs: data.timeTakenSecs ?? 0,
        isMarkedForReview: data.isMarkedForReview ?? false,
        isSkipped,
      },
      update: {
        selectedAnswer: data.selectedAnswer as Prisma.InputJsonValue,
        timeTakenSecs: data.timeTakenSecs
          ? { increment: data.timeTakenSecs }
          : undefined,
        isMarkedForReview: data.isMarkedForReview,
        isSkipped,
      },
    });
  }
}
