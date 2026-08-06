import { Router } from "express";
import { SubjectsRepository } from "./subjects.repository";
import { SubjectsService } from "./subjects.service";
import { SubjectsController } from "./subjects.controller";
import {
  validateCreateSubject,
  validateUpdateSubject,
  validateSubjectQuery,
  validateSubjectIdParam,
} from "./subjects.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const subjectsRepository = new SubjectsRepository();
const subjectsService = new SubjectsService(subjectsRepository);
const subjectsController = new SubjectsController(subjectsService);

const router = Router();

router.get(
  "/",
  validateSubjectQuery,
  asyncHandler(subjectsController.getAllSubjects),
);
router.get(
  "/:id",
  validateSubjectIdParam,
  asyncHandler(subjectsController.getSubjectById),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateSubject,
  asyncHandler(subjectsController.createSubject),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateSubject,
  asyncHandler(subjectsController.updateSubject),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateSubjectIdParam,
  asyncHandler(subjectsController.deleteSubject),
);

export const subjectsRouter = router;
