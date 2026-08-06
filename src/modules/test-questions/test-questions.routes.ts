import { Router } from "express";
import { TestQuestionsRepository } from "./test-questions.repository";
import { TestQuestionsService } from "./test-questions.service";
import { TestQuestionsController } from "./test-questions.controller";
import {
  validateAddTestQuestion,
  validateBulkAddTestQuestions,
  validateReorderTestQuestions,
  validateTestQuestionParams,
} from "./test-questions.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const testQuestionsRepository = new TestQuestionsRepository();
const testQuestionsService = new TestQuestionsService(testQuestionsRepository);
const testQuestionsController = new TestQuestionsController(
  testQuestionsService,
);

const router = Router({ mergeParams: true });

router.get(
  "/",
  authMiddleware,
  validateTestQuestionParams,
  asyncHandler(testQuestionsController.getQuestionsByTestPaperId),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateAddTestQuestion,
  asyncHandler(testQuestionsController.addQuestionToTest),
);
router.post(
  "/bulk",
  authMiddleware,
  adminMiddleware,
  validateBulkAddTestQuestions,
  asyncHandler(testQuestionsController.bulkAddQuestionsToTest),
);
router.post(
  "/reorder",
  authMiddleware,
  adminMiddleware,
  validateReorderTestQuestions,
  asyncHandler(testQuestionsController.reorderTestQuestions),
);
router.delete(
  "/:questionId",
  authMiddleware,
  adminMiddleware,
  validateTestQuestionParams,
  asyncHandler(testQuestionsController.removeQuestionFromTest),
);

export const testQuestionsRouter = router;
