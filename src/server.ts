import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./core/logger";
import { prisma } from "./core/prisma";
import { initializeFirebase } from "./integrations/firebase";
import { initializeCloudinary } from "./integrations/cloudinary";

const startServer = async () => {
  try {
    // 1. Initialize External Integrations
    initializeFirebase();
    initializeCloudinary();

    // 2. Create Express Application Instance
    const app = createApp();

    // 3. Start HTTP Server Listener immediately for zero-downtime healthchecks
    const server = app.listen(env.PORT, "0.0.0.0", () => {
      logger.info(
        `🚀 Shiksha+ Backend API running in [${env.NODE_ENV}] mode on port ${env.PORT}`,
      );
      logger.info(
        `📚 Swagger Documentation live at http://localhost:${env.PORT}/docs`,
      );
    });

    // 4. Connect Database ORM
    await prisma.$connect();
    logger.info("🐘 Database connected successfully via Prisma");

    // Graceful Shutdown Handler
    const shutdown = async (signal: string) => {
      logger.info(`⚠️ Received ${signal}. Initiating graceful shutdown...`);

      server.close(async () => {
        logger.info("🛑 HTTP server closed successfully.");

        try {
          await prisma.$disconnect();
          logger.info("🔌 Database connection disconnected.");
          process.exit(0);
        } catch (dbError) {
          logger.error({ dbError }, "Error disconnecting database ORM");
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if connections refuse to close
      setTimeout(() => {
        logger.error(
          "⏰ Forceful shutdown timeout exceeded. Exiting immediately.",
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: unknown) => {
      logger.fatal({ reason }, "💥 Unhandled Promise Rejection detected!");
      process.exit(1);
    });

    process.on("uncaughtException", (error: Error) => {
      logger.fatal({ error }, "💥 Uncaught Exception thrown!");
      process.exit(1);
    });
  } catch (error) {
    logger.fatal({ error }, "💥 Failed to bootstrap application server");
    process.exit(1);
  }
};

startServer();
