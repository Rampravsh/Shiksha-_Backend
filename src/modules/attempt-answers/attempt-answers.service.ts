import { AttemptAnswer, AttemptStatus } from "@prisma/client";
import { AttemptAnswersRepository } from "./attempt-answers.repository";
import { SaveAnswerInput } from "./attempt-answers.types";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../core/errors";
import { ATTEMPT_ANSWERS_MESSAGES } from "./attempt-answers.constants";
import { prisma } from "../../core/prisma";

export class AttemptAnswersService {
  constructor(
    private readonly attemptAnswersRepository: AttemptAnswersRepository,
  ) {}

  async getAnswersByAttemptId(
    userId: string,
    attemptId: string,
  ): Promise<AttemptAnswer[]> {
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundError(ATTEMPT_ANSWERS_MESSAGES.NOT_FOUND);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenError(ATTEMPT_ANSWERS_MESSAGES.FORBIDDEN_ACCESS);
    }

    return this.attemptAnswersRepository.findByAttemptId(attemptId);
  }

  async saveAnswerProgress(
    userId: string,
    attemptId: string,
    input: SaveAnswerInput,
  ): Promise<AttemptAnswer> {
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundError(ATTEMPT_ANSWERS_MESSAGES.NOT_FOUND);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenError(ATTEMPT_ANSWERS_MESSAGES.FORBIDDEN_ACCESS);
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestError(ATTEMPT_ANSWERS_MESSAGES.ATTEMPT_CLOSED);
    }

    return this.attemptAnswersRepository.upsertAnswer(attemptId, input);
  }
}
