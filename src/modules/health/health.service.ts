import { HealthRepository } from "./health.repository";
import { ComponentStatus, DetailedHealthStatus } from "./health.types";
import { appConfig } from "../../config/app";

export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async getFullHealth(): Promise<DetailedHealthStatus> {
    const dbStatus = await this.healthRepository.checkDatabase();
    const fbStatus = this.healthRepository.checkFirebase();
    const cldStatus = this.healthRepository.checkCloudinary();

    const isUp = dbStatus.status === "UP";
    const status = isUp ? "UP" : "DOWN";

    const mem = process.memoryUsage();

    return {
      status,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: appConfig.env,
      version: "1.0.0",
      components: {
        database: dbStatus,
        firebase: fbStatus,
        cloudinary: cldStatus,
      },
      system: {
        memoryUsageMB: {
          rss: Math.round(mem.rss / 1024 / 1024),
          heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
          heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
          external: Math.round(mem.external / 1024 / 1024),
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
    };
  }

  async checkDatabase(): Promise<ComponentStatus> {
    return this.healthRepository.checkDatabase();
  }

  checkFirebase(): ComponentStatus {
    return this.healthRepository.checkFirebase();
  }

  checkCloudinary(): ComponentStatus {
    return this.healthRepository.checkCloudinary();
  }

  getSystemMetrics() {
    const mem = process.memoryUsage();
    return {
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        external: Math.round(mem.external / 1024 / 1024),
      },
      nodeVersion: process.version,
      platform: process.platform,
      cpuUsage: process.cpuUsage(),
    };
  }
}
