export interface ComponentStatus {
  status: "UP" | "DOWN" | "DEGRADED";
  message?: string;
  latencyMs?: number;
}

export interface DetailedHealthStatus {
  status: "UP" | "DOWN" | "DEGRADED";
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
  components: {
    database: ComponentStatus;
    firebase: ComponentStatus;
    cloudinary: ComponentStatus;
  };
  system: {
    memoryUsageMB: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    nodeVersion: string;
    platform: string;
  };
}
