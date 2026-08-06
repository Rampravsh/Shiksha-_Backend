import { prisma } from "../../core/prisma";
import { firebaseConfig } from "../../config/firebase";
import { cloudinaryConfig } from "../../config/cloudinary";
import { ComponentStatus } from "./health.types";

export class HealthRepository {
  async checkDatabase(): Promise<ComponentStatus> {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: "UP",
        message: "Database ping successful",
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        status: "DOWN",
        message:
          error instanceof Error ? error.message : "Database query failed",
        latencyMs: Date.now() - start,
      };
    }
  }

  checkFirebase(): ComponentStatus {
    if (firebaseConfig.isConfigured) {
      return {
        status: "UP",
        message: "Firebase Admin credentials loaded",
      };
    }
    return {
      status: "DEGRADED",
      message: "Firebase configuration incomplete",
    };
  }

  checkCloudinary(): ComponentStatus {
    if (cloudinaryConfig.isConfigured) {
      return {
        status: "UP",
        message: "Cloudinary credentials loaded",
      };
    }
    return {
      status: "DEGRADED",
      message: "Cloudinary configuration incomplete",
    };
  }
}
