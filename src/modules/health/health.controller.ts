import { Request, Response } from "express";
import { HealthService } from "./health.service";
import { ApiResponse } from "../../core/response";
import { HEALTH_MESSAGES } from "./health.constants";
import { HttpStatus } from "../../core/http-status";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  getHealth = async (_req: Request, res: Response): Promise<void> => {
    const health = await this.healthService.getFullHealth();
    const statusCode =
      health.status === "UP" ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    ApiResponse.success(res, HEALTH_MESSAGES.HEALTHY, health, statusCode);
  };

  getLive = async (_req: Request, res: Response): Promise<void> => {
    ApiResponse.success(res, HEALTH_MESSAGES.LIVE, {
      status: "UP",
      uptime: process.uptime(),
    });
  };

  getReady = async (_req: Request, res: Response): Promise<void> => {
    const dbStatus = await this.healthService.checkDatabase();
    if (dbStatus.status === "UP") {
      ApiResponse.success(res, HEALTH_MESSAGES.READY, { status: "READY" });
    } else {
      ApiResponse.error(
        res,
        HEALTH_MESSAGES.DATABASE_FAIL,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  };

  getDatabaseHealth = async (_req: Request, res: Response): Promise<void> => {
    const status = await this.healthService.checkDatabase();
    const httpCode =
      status.status === "UP" ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    ApiResponse.success(res, HEALTH_MESSAGES.DATABASE_OK, status, httpCode);
  };

  getFirebaseHealth = async (_req: Request, res: Response): Promise<void> => {
    const status = this.healthService.checkFirebase();
    ApiResponse.success(res, HEALTH_MESSAGES.FIREBASE_OK, status);
  };

  getCloudinaryHealth = async (_req: Request, res: Response): Promise<void> => {
    const status = this.healthService.checkCloudinary();
    ApiResponse.success(res, HEALTH_MESSAGES.CLOUDINARY_OK, status);
  };

  getSystemMetrics = async (_req: Request, res: Response): Promise<void> => {
    const metrics = this.healthService.getSystemMetrics();
    ApiResponse.success(res, HEALTH_MESSAGES.SYSTEM_METRICS, metrics);
  };
}
