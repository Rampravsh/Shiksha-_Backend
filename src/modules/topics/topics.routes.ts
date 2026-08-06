import { Router } from "express";
import { TopicsRepository } from "./topics.repository";
import { TopicsService } from "./topics.service";
import { TopicsController } from "./topics.controller";
import {
  validateCreateTopic,
  validateUpdateTopic,
  validateTopicQuery,
  validateTopicIdParam,
} from "./topics.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const topicsRepository = new TopicsRepository();
const topicsService = new TopicsService(topicsRepository);
const topicsController = new TopicsController(topicsService);

const router = Router();

router.get(
  "/",
  validateTopicQuery,
  asyncHandler(topicsController.getAllTopics),
);
router.get(
  "/:id",
  validateTopicIdParam,
  asyncHandler(topicsController.getTopicById),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateTopic,
  asyncHandler(topicsController.createTopic),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateTopic,
  asyncHandler(topicsController.updateTopic),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateTopicIdParam,
  asyncHandler(topicsController.deleteTopic),
);

export const topicsRouter = router;
