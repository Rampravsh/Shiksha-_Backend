import { NotificationsService } from "../src/modules/notifications/notifications.service";
import { NotificationsRepository } from "../src/modules/notifications/notifications.repository";
import { NotificationDeliveryService } from "../src/modules/notifications/notification-delivery.service";
import {
  Notification,
  NotificationTarget,
  NotificationType,
} from "@prisma/client";

describe("Notifications Module Unit Tests", () => {
  let notificationsRepository: jest.Mocked<NotificationsRepository>;
  let deliveryService: jest.Mocked<NotificationDeliveryService>;
  let notificationsService: NotificationsService;

  beforeEach(() => {
    notificationsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      getAllFcmTokens: jest.fn(),
    } as unknown as jest.Mocked<NotificationsRepository>;

    deliveryService = {
      sendToTokens: jest.fn(),
    } as unknown as jest.Mocked<NotificationDeliveryService>;

    notificationsService = new NotificationsService(
      notificationsRepository,
      deliveryService,
    );
    jest.clearAllMocks();
  });

  it("should create notification and deliver to targeted FCM tokens", async () => {
    const mockNotif = {
      id: "n-1",
      title: "Exam Date Announced",
      body: "SSC CGL Prelims starts from Next Month",
      target: NotificationTarget.ALL_USERS,
      type: NotificationType.GENERAL,
    } as unknown as Notification;

    notificationsRepository.create.mockResolvedValue(mockNotif);
    notificationsRepository.getAllFcmTokens.mockResolvedValue([
      "token-1",
      "token-2",
    ]);
    deliveryService.sendToTokens.mockResolvedValue({
      successCount: 2,
      failureCount: 0,
    });

    const result = await notificationsService.createAndSend(
      {
        title: "Exam Date Announced",
        body: "SSC CGL Prelims starts from Next Month",
      },
      "admin-1",
    );

    expect(result.notification.title).toBe("Exam Date Announced");
    expect(result.delivery.successCount).toBe(2);
  });
});
