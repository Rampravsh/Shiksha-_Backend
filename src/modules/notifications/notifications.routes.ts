import { Router } from "express";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationDeliveryService } from "./notification-delivery.service";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import {
  validateCreateNotification,
  validateNotificationQuery,
  validateNotificationIdParam,
} from "./notifications.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const notificationsRepository = new NotificationsRepository();
const deliveryService = new NotificationDeliveryService();
const notificationsService = new NotificationsService(
  notificationsRepository,
  deliveryService,
);
const notificationsController = new NotificationsController(
  notificationsService,
);

const router = Router();

router.get(
  "/",
  authMiddleware,
  validateNotificationQuery,
  asyncHandler(notificationsController.getAll),
);
router.get(
  "/:id",
  authMiddleware,
  validateNotificationIdParam,
  asyncHandler(notificationsController.getById),
);

// Admin-only endpoints
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateNotification,
  asyncHandler(notificationsController.createAndSend),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateNotificationIdParam,
  asyncHandler(notificationsController.delete),
);

export const notificationsRouter = router;
