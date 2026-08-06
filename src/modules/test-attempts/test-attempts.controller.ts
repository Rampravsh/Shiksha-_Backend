import { Request, Response } from "express";
import { TestAttemptsService } from "./test-attempts.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { TEST_ATTEMPTS_MESSAGES } from "./test-attempts.constants";
import { StartAttemptInput } from "./test-attempts.types";
import { UnauthorizedError } from "../../core/errors";

export class TestAttemptsController {
  constructor(private readonly testAttemptsService: TestAttemptsService) {}

  startAttempt = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const input: StartAttemptInput = req.body;
    const attempt = await this.testAttemptsService.startAttempt(
      req.user.id,
      input.testPaperId,
    );
    ApiResponse.created(res, TEST_ATTEMPTS_MESSAGES.STARTED, attempt);
  };

  getAttemptById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const id = req.params.id as string;
    const attempt = await this.testAttemptsService.getAttemptById(
      req.user.id,
      id,
    );
    ApiResponse.success(res, TEST_ATTEMPTS_MESSAGES.FETCHED_ONE, attempt);
  };

  getMyAttemptHistory = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const pagination = getPaginationParams(req.query);
    const filters = {
      testPaperId: req.query.testPaperId as string | undefined,
    };

    const result = await this.testAttemptsService.getUserAttemptHistory(
      req.user.id,
      filters,
      pagination,
    );
    ApiResponse.success(res, TEST_ATTEMPTS_MESSAGES.FETCHED_ALL, result);
  };

  submitAttempt = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const id = req.params.id as string;
    const attempt = await this.testAttemptsService.submitAttempt(
      req.user.id,
      id,
    );
    ApiResponse.success(res, TEST_ATTEMPTS_MESSAGES.SUBMITTED, attempt);
  };
}
