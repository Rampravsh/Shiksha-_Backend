import { Router } from "express";
import { StatesRepository } from "./states.repository";
import { StatesService } from "./states.service";
import { StatesController } from "./states.controller";
import {
  validateCreateState,
  validateUpdateState,
  validateStateQuery,
  validateStateIdParam,
} from "./states.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const statesRepository = new StatesRepository();
const statesService = new StatesService(statesRepository);
const statesController = new StatesController(statesService);

const router = Router();

router.get(
  "/",
  validateStateQuery,
  asyncHandler(statesController.getAllStates),
);
router.get(
  "/:id",
  validateStateIdParam,
  asyncHandler(statesController.getStateById),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateState,
  asyncHandler(statesController.createState),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateState,
  asyncHandler(statesController.updateState),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateStateIdParam,
  asyncHandler(statesController.deleteState),
);

export const statesRouter = router;
