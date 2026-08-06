import { sendMulticastNotification } from "../../integrations/firebase";
import { logger } from "../../core/logger";

export class NotificationDeliveryService {
  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ successCount: number; failureCount: number }> {
    if (tokens.length === 0) {
      logger.warn("No FCM tokens to deliver notification to");
      return { successCount: 0, failureCount: 0 };
    }

    const batchSize = 500;
    let totalSuccess = 0;
    let totalFailure = 0;

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const result = await sendMulticastNotification(batch, title, body, data);
      if (result) {
        totalSuccess += result.successCount;
        totalFailure += result.failureCount;
      } else {
        totalFailure += batch.length;
      }
    }

    logger.info(
      { title, totalSuccess, totalFailure },
      "FCM notification delivery completed",
    );

    return { successCount: totalSuccess, failureCount: totalFailure };
  }
}
