import { Notification, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateNotificationInput,
  NotificationQueryFilters,
} from "./notifications.types";

export class NotificationsRepository {
  async findAll(
    filters: NotificationQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Notification[], number]> {
    const where: Prisma.NotificationWhereInput = {};
    if (filters.type) where.type = filters.type;
    if (filters.target) where.target = filters.target;

    return Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        include: {
          createdBy: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async create(
    data: CreateNotificationInput,
    createdById: string,
  ): Promise<Notification> {
    return prisma.notification.create({
      data: {
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl,
        target: data.target,
        type: data.type,
        data: data.data as Prisma.InputJsonValue,
        createdById,
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({ where: { id } });
  }

  async getAllFcmTokens(): Promise<string[]> {
    const users = await prisma.user.findMany({
      where: { isActive: true, fcmToken: { not: null } },
      select: { fcmToken: true },
    });
    return users.map((u) => u.fcmToken).filter((t): t is string => t !== null);
  }
}
