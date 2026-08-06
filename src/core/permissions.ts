export const PERMISSIONS = {
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_DELETE: "users:delete",

  EXAMS_READ: "exams:read",
  EXAMS_WRITE: "exams:write",
  EXAMS_DELETE: "exams:delete",

  QUESTIONS_READ: "questions:read",
  QUESTIONS_WRITE: "questions:write",
  QUESTIONS_DELETE: "questions:delete",

  SYSTEM_ADMIN: "system:admin",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
