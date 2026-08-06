import { Router } from "express";
import { AttemptAnswersRepository } from "./attempt-answers.repository";
import { AttemptAnswersService } from "./attempt-answers.service";
import { AttemptAnswersController } from "./attempt-answers.controller";
import {
  validateSaveAnswer,
  validateAttemptAnswerParams,
} from "./attempt-answers.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../core/async-handler";

const attemptAnswersRepository = new AttemptAnswersRepository();
const attemptAnswersService = new AttemptAnswersService(
  attemptAnswersRepository,
);
const attemptAnswersController = new AttemptAnswersController(
  attemptAnswersService,
);

const router = Router({ mergeParams: true });

router.get(
  "/",
  authMiddleware,
  validateAttemptAnswerParams,
  asyncHandler(attemptAnswersController.getAnswersByAttemptId),
);
router.post(
  "/",
  authMiddleware,
  validateSaveAnswer,
  asyncHandler(attemptAnswersController.saveAnswerProgress),
);

export const attemptAnswersRouter = router;
