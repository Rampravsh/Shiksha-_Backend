import { Role } from "../core/roles";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  firebaseUid?: string;
  permissions?: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      requestId?: string;
    }
  }
}
