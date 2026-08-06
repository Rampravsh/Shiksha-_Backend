import { validateRequest } from "../../middleware/validation.middleware";
import { firebaseLoginSchema, refreshTokenSchema } from "./auth.schema";

export const validateFirebaseLogin = validateRequest({
  body: firebaseLoginSchema,
});

export const validateRefreshToken = validateRequest({
  body: refreshTokenSchema,
});
