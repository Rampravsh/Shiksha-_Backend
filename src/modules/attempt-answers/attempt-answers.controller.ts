import { Request, Response } from "express";
import { AttemptAnswersService } from "./attempt-answers.service";
import { ApiResponse } from "../../core/response";
import { ATTEMPT_ANSWERS_MESSAGES } from "./attempt-answers.constants";
import { SaveAnswerInput } from "./attempt-answers.types";
import { UnauthorizedError } from "../../core/errors";

export class AttemptAnswersController {
  constructor(private readonly attemptAnswersService: AttemptAnswersService) {}

  getAnswersByAttemptId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const attemptId = req.params.attemptId as string;
    const answers = await this.attemptAnswersService.getAnswersByAttemptId(
      req.user.id,
      attemptId,
    );
    ApiResponse.success(res, ATTEMPT_ANSWERS_MESSAGES.FETCHED_ALL, answers);
  };

  saveAnswerProgress = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const attemptId = req.params.attemptId as string;
    const input: SaveAnswerInput = req.body;
    const saved = await this.attemptAnswersService.saveAnswerProgress(
      req.user.id,
      attemptId,
      input,
    );
    ApiResponse.success(res, ATTEMPT_ANSWERS_MESSAGES.SAVED, saved);
  };
}
