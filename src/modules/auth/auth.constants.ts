export const AUTH_MESSAGES = {
  LOGGED_IN: "User authenticated successfully via Firebase",
  LOGGED_OUT: "Session logged out successfully",
  LOGGED_OUT_ALL: "Logged out from all devices successfully",
  TOKEN_REFRESHED: "Tokens rotated and refreshed successfully",
  INVALID_TOKEN: "Invalid, expired, or revoked token",
  ACCOUNT_DISABLED: "Your account has been disabled. Please contact support.",
  SESSION_REVOKED: "Refresh session has been revoked",
  USER_DISABLED: "User account disabled successfully",
  USER_ENABLED: "User account enabled successfully",
} as const;
