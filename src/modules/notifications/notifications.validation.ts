import { validateRequest } from "../../middleware/validation.middleware";
import {
  createNotificationSchema,
  notificationQuerySchema,
  notificationIdParamSchema,
} from "./notifications.schema";

export const validateCreateNotification = validateRequest({
  body: createNotificationSchema,
});

export const validateNotificationQuery = validateRequest({
  query: notificationQuerySchema,
});

export const validateNotificationIdParam = validateRequest({
  params: notificationIdParamSchema,
});
