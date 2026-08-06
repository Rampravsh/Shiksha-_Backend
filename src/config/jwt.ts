import { env } from "./env";

export const jwtConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  refreshSecret: env.JWT_REFRESH_SECRET,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  issuer: env.APP_NAME,
} as const;

export type JwtConfig = typeof jwtConfig;
