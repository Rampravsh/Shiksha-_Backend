import { env } from "./env";

export const appConfig = {
  name: env.APP_NAME,
  env: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
} as const;

export type AppConfig = typeof appConfig;
