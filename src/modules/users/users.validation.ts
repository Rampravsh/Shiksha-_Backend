import { validateRequest } from "../../middleware/validation.middleware";
import {
  updateUserProfileSchema,
  updateAvatarSchema,
  userQuerySchema,
  userIdParamSchema,
} from "./users.schema";

export const validateUpdateProfile = validateRequest({
  body: updateUserProfileSchema,
});

export const validateUpdateAvatar = validateRequest({
  body: updateAvatarSchema,
});

export const validateUserQuery = validateRequest({
  query: userQuerySchema,
});

export const validateUserIdParam = validateRequest({
  params: userIdParamSchema,
});
