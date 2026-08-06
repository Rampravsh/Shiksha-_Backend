import { env } from "./env";

export const swaggerConfig = {
  route: "/docs",
  apiPrefix: env.API_PREFIX,
  specFilePath: "openapi.yaml",
} as const;

export type SwaggerConfig = typeof swaggerConfig;
