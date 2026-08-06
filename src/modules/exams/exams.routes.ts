import { Router } from "express";
import { ExamsRepository } from "./exams.repository";
import { ExamsService } from "./exams.service";
import { ExamsController } from "./exams.controller";
import {
  validateCreateExam,
  validateUpdateExam,
  validateExamQuery,
  validateExamIdParam,
} from "./exams.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const examsRepository = new ExamsRepository();
const examsService = new ExamsService(examsRepository);
const examsController = new ExamsController(examsService);

const router = Router();

router.get("/", validateExamQuery, asyncHandler(examsController.getAllExams));
router.get(
  "/:id",
  validateExamIdParam,
  asyncHandler(examsController.getExamById),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateExam,
  asyncHandler(examsController.createExam),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateExam,
  asyncHandler(examsController.updateExam),
);
router.patch(
  "/:id/activate",
  authMiddleware,
  adminMiddleware,
  validateExamIdParam,
  asyncHandler(examsController.activateExam),
);
router.patch(
  "/:id/deactivate",
  authMiddleware,
  adminMiddleware,
  validateExamIdParam,
  asyncHandler(examsController.deactivateExam),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateExamIdParam,
  asyncHandler(examsController.deleteExam),
);

export const examsRouter = router;
