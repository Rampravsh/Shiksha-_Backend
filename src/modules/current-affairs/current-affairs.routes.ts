import { Router } from "express";
import { CurrentAffairsRepository } from "./current-affairs.repository";
import { CurrentAffairsService } from "./current-affairs.service";
import { CurrentAffairsController } from "./current-affairs.controller";
import {
  validateCreateCurrentAffair,
  validateUpdateCurrentAffair,
  validateCurrentAffairQuery,
  validateCurrentAffairIdParam,
} from "./current-affairs.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const currentAffairsRepository = new CurrentAffairsRepository();
const currentAffairsService = new CurrentAffairsService(
  currentAffairsRepository,
);
const currentAffairsController = new CurrentAffairsController(
  currentAffairsService,
);

const router = Router();

router.get(
  "/",
  validateCurrentAffairQuery,
  asyncHandler(currentAffairsController.getAll),
);
router.get(
  "/:id",
  validateCurrentAffairIdParam,
  asyncHandler(currentAffairsController.getById),
);

// Admin-protected mutations
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateCurrentAffair,
  asyncHandler(currentAffairsController.create),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateCurrentAffair,
  asyncHandler(currentAffairsController.update),
);
router.patch(
  "/:id/publish",
  authMiddleware,
  adminMiddleware,
  validateCurrentAffairIdParam,
  asyncHandler(currentAffairsController.publish),
);
router.patch(
  "/:id/archive",
  authMiddleware,
  adminMiddleware,
  validateCurrentAffairIdParam,
  asyncHandler(currentAffairsController.archive),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateCurrentAffairIdParam,
  asyncHandler(currentAffairsController.delete),
);

export const currentAffairsRouter = router;
