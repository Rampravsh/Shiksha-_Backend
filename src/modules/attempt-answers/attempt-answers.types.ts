import { Prisma } from "@prisma/client";

export interface SaveAnswerInput {
  questionId: string;
  selectedAnswer?: Prisma.InputJsonValue;
  timeTakenSecs?: number;
  isMarkedForReview?: boolean;
  isSkipped?: boolean;
}

export interface AttemptAnswerResponse {
  id: string;
  testAttemptId: string;
  questionId: string;
  selectedAnswer?: Prisma.JsonValue | null;
  isCorrect: boolean;
  isSkipped: boolean;
  isMarkedForReview: boolean;
  marksAwarded: number;
  timeTakenSecs: number;
}
