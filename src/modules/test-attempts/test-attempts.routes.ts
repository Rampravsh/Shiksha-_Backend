import { Router } from "express";
import { TestAttemptsRepository } from "./test-attempts.repository";
import { TestAttemptsService } from "./test-attempts.service";
import { TestAttemptsController } from "./test-attempts.controller";
import {
  validateStartAttempt,
  validateAttemptIdParam,
  validateAttemptQuery,
} from "./test-attempts.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../core/async-handler";

const testAttemptsRepository = new TestAttemptsRepository();
const testAttemptsService = new TestAttemptsService(testAttemptsRepository);
const testAttemptsController = new TestAttemptsController(testAttemptsService);

const router = Router();

router.post(
  "/start",
  authMiddleware,
  validateStartAttempt,
  asyncHandler(testAttemptsController.startAttempt),
);
router.get(
  "/my-history",
  authMiddleware,
  validateAttemptQuery,
  asyncHandler(testAttemptsController.getMyAttemptHistory),
);
router.get(
  "/:id",
  authMiddleware,
  validateAttemptIdParam,
  asyncHandler(testAttemptsController.getAttemptById),
);
router.post(
  "/:id/submit",
  authMiddleware,
  validateAttemptIdParam,
  asyncHandler(testAttemptsController.submitAttempt),
);

export const testAttemptsRouter = router;
