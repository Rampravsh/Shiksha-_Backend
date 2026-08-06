import { env } from "./env";

export const databaseConfig = {
  url: env.DATABASE_URL,
  logLevel:
    env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
} as const;

export type DatabaseConfig = typeof databaseConfig;
