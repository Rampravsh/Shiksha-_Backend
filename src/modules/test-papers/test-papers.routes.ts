import { Router } from "express";
import { TestPapersRepository } from "./test-papers.repository";
import { TestPapersService } from "./test-papers.service";
import { TestPapersController } from "./test-papers.controller";
import {
  validateCreateTestPaper,
  validateUpdateTestPaper,
  validateTestPaperQuery,
  validateTestPaperIdParam,
} from "./test-papers.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const testPapersRepository = new TestPapersRepository();
const testPapersService = new TestPapersService(testPapersRepository);
const testPapersController = new TestPapersController(testPapersService);

const router = Router();

router.get(
  "/",
  validateTestPaperQuery,
  asyncHandler(testPapersController.getAllTestPapers),
);
router.get(
  "/:id",
  validateTestPaperIdParam,
  asyncHandler(testPapersController.getTestPaperById),
);

// Admin-protected mutations
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateTestPaper,
  asyncHandler(testPapersController.createTestPaper),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateTestPaper,
  asyncHandler(testPapersController.updateTestPaper),
);
router.patch(
  "/:id/publish",
  authMiddleware,
  adminMiddleware,
  validateTestPaperIdParam,
  asyncHandler(testPapersController.publishTestPaper),
);
router.patch(
  "/:id/archive",
  authMiddleware,
  adminMiddleware,
  validateTestPaperIdParam,
  asyncHandler(testPapersController.archiveTestPaper),
);
router.post(
  "/:id/clone",
  authMiddleware,
  adminMiddleware,
  validateTestPaperIdParam,
  asyncHandler(testPapersController.cloneTestPaper),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateTestPaperIdParam,
  asyncHandler(testPapersController.deleteTestPaper),
);

export const testPapersRouter = router;
