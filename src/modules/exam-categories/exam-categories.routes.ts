import { Router } from "express";
import { ExamCategoriesRepository } from "./exam-categories.repository";
import { ExamCategoriesService } from "./exam-categories.service";
import { ExamCategoriesController } from "./exam-categories.controller";
import {
  validateCreateExamCategory,
  validateUpdateExamCategory,
  validateExamCategoryQuery,
  validateExamCategoryIdParam,
} from "./exam-categories.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const examCategoriesRepository = new ExamCategoriesRepository();
const examCategoriesService = new ExamCategoriesService(
  examCategoriesRepository,
);
const examCategoriesController = new ExamCategoriesController(
  examCategoriesService,
);

const router = Router();

router.get(
  "/",
  validateExamCategoryQuery,
  asyncHandler(examCategoriesController.getAllExamCategories),
);
router.get(
  "/:id",
  validateExamCategoryIdParam,
  asyncHandler(examCategoriesController.getExamCategoryById),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateExamCategory,
  asyncHandler(examCategoriesController.createExamCategory),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateExamCategory,
  asyncHandler(examCategoriesController.updateExamCategory),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateExamCategoryIdParam,
  asyncHandler(examCategoriesController.deleteExamCategory),
);

export const examCategoriesRouter = router;
