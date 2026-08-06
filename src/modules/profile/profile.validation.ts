import { validateRequest } from "../../middleware/validation.middleware";
import { updateProfileSchema } from "./profile.schema";

export const validateUpdateProfile = validateRequest({
  body: updateProfileSchema,
});
