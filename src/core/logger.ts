import pino from "pino";
import { loggerConfig } from "../config/logger";

export const logger = pino({
  level: loggerConfig.level,
  redact: loggerConfig.redact as unknown as string[],
  transport: !loggerConfig.isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
