import { Router } from "express";
import { QuestionsRepository } from "./questions.repository";
import { QuestionsService } from "./questions.service";
import { QuestionsController } from "./questions.controller";
import {
  validateCreateQuestion,
  validateBulkCreateQuestions,
  validateUpdateQuestion,
  validateQuestionQuery,
  validateQuestionIdParam,
} from "./questions.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const questionsRepository = new QuestionsRepository();
const questionsService = new QuestionsService(questionsRepository);
const questionsController = new QuestionsController(questionsService);

const router = Router();

// Read Question Bank (Protected for registered users and admins)
router.get(
  "/",
  authMiddleware,
  validateQuestionQuery,
  asyncHandler(questionsController.getAllQuestions),
);
router.get(
  "/:id",
  authMiddleware,
  validateQuestionIdParam,
  asyncHandler(questionsController.getQuestionById),
);

// Admin-protected Question Bank mutations
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateQuestion,
  asyncHandler(questionsController.createQuestion),
);
router.post(
  "/bulk",
  authMiddleware,
  adminMiddleware,
  validateBulkCreateQuestions,
  asyncHandler(questionsController.bulkCreateQuestions),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateQuestion,
  asyncHandler(questionsController.updateQuestion),
);
router.patch(
  "/:id/publish",
  authMiddleware,
  adminMiddleware,
  validateQuestionIdParam,
  asyncHandler(questionsController.publishQuestion),
);
router.patch(
  "/:id/archive",
  authMiddleware,
  adminMiddleware,
  validateQuestionIdParam,
  asyncHandler(questionsController.archiveQuestion),
);
router.patch(
  "/:id/draft",
  authMiddleware,
  adminMiddleware,
  validateQuestionIdParam,
  asyncHandler(questionsController.draftQuestion),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateQuestionIdParam,
  asyncHandler(questionsController.deleteQuestion),
);

export const questionsRouter = router;
