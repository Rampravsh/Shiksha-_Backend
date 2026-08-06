import { PrismaClient } from "@prisma/client";
import { databaseConfig } from "../config/database";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: databaseConfig.logLevel as ("query" | "info" | "warn" | "error")[],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
