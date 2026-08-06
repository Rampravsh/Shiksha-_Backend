import { Notification } from "@prisma/client";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationDeliveryService } from "./notification-delivery.service";
import {
  CreateNotificationInput,
  NotificationQueryFilters,
} from "./notifications.types";
import { NotFoundError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { NOTIFICATIONS_MESSAGES } from "./notifications.constants";
import { logger } from "../../core/logger";

export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly deliveryService: NotificationDeliveryService,
  ) {}

  async getAllNotifications(
    filters: NotificationQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Notification>> {
    const [data, total] = await this.notificationsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findById(id);
    if (!notification) {
      throw new NotFoundError(NOTIFICATIONS_MESSAGES.NOT_FOUND);
    }
    return notification;
  }

  async createAndSend(
    input: CreateNotificationInput,
    createdById: string,
  ): Promise<{
    notification: Notification;
    delivery: { successCount: number; failureCount: number };
  }> {
    const notification = await this.notificationsRepository.create(
      input,
      createdById,
    );

    logger.info(
      { notificationId: notification.id, target: notification.target },
      "Notification created, starting delivery",
    );

    const tokens = await this.notificationsRepository.getAllFcmTokens();
    const dataPayload = input.data
      ? (input.data as Record<string, string>)
      : undefined;

    const delivery = await this.deliveryService.sendToTokens(
      tokens,
      notification.title,
      notification.body,
      dataPayload,
    );

    return { notification, delivery };
  }

  async deleteNotification(id: string): Promise<Notification> {
    await this.getNotificationById(id);
    return this.notificationsRepository.delete(id);
  }
}
