import { Request, Response } from "express";
import { NotificationsService } from "./notifications.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { NOTIFICATIONS_MESSAGES } from "./notifications.constants";
import { CreateNotificationInput } from "./notifications.types";
import { NotificationType, NotificationTarget } from "@prisma/client";
import { UnauthorizedError } from "../../core/errors";

export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      type: req.query.type as NotificationType | undefined,
      target: req.query.target as NotificationTarget | undefined,
    };
    const result = await this.notificationsService.getAllNotifications(
      filters,
      pagination,
    );
    ApiResponse.success(res, NOTIFICATIONS_MESSAGES.FETCHED_ALL, result);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const notification = await this.notificationsService.getNotificationById(
      req.params.id as string,
    );
    ApiResponse.success(res, NOTIFICATIONS_MESSAGES.FETCHED_ONE, notification);
  };

  createAndSend = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const input: CreateNotificationInput = req.body;
    const result = await this.notificationsService.createAndSend(
      input,
      req.user.id,
    );
    ApiResponse.created(res, NOTIFICATIONS_MESSAGES.SENT, result);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.notificationsService.deleteNotification(
      req.params.id as string,
    );
    ApiResponse.success(res, NOTIFICATIONS_MESSAGES.DELETED, deleted);
  };
}
