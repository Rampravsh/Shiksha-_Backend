import { NotificationTarget, NotificationType, Prisma } from "@prisma/client";

export interface CreateNotificationInput {
  title: string;
  body: string;
  imageUrl?: string;
  target?: NotificationTarget;
  type?: NotificationType;
  data?: Prisma.InputJsonValue;
}

export interface NotificationQueryFilters {
  type?: NotificationType;
  target?: NotificationTarget;
}
