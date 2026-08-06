export const HEALTH_MESSAGES = {
  HEALTHY: "System health check performed successfully",
  LIVE: "Application is live and responding",
  READY: "Application readiness check passed",
  DATABASE_OK: "Database connectivity is healthy",
  DATABASE_FAIL: "Database connectivity failed",
  FIREBASE_OK: "Firebase SDK initialization verified",
  FIREBASE_FAIL: "Firebase SDK not configured or unreachable",
  CLOUDINARY_OK: "Cloudinary integration verified",
  CLOUDINARY_FAIL: "Cloudinary configuration incomplete",
  SYSTEM_METRICS: "System performance metrics retrieved",
} as const;
