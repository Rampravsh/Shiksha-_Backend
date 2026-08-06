import { z } from "zod";
import { NotificationTarget, NotificationType } from "@prisma/client";

export const createNotificationSchema = z.object({
  title: z.string().min(2).max(200),
  body: z.string().min(2).max(1000),
  imageUrl: z.string().url().optional(),
  target: z
    .nativeEnum(NotificationTarget)
    .optional()
    .default(NotificationTarget.ALL_USERS),
  type: z
    .nativeEnum(NotificationType)
    .optional()
    .default(NotificationType.GENERAL),
  data: z.record(z.string()).optional(),
});

export const notificationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.nativeEnum(NotificationType).optional(),
  target: z.nativeEnum(NotificationTarget).optional(),
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
});
