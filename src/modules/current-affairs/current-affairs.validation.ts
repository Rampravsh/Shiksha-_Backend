import { validateRequest } from "../../middleware/validation.middleware";
import {
  createCurrentAffairSchema,
  updateCurrentAffairSchema,
  currentAffairQuerySchema,
  currentAffairIdParamSchema,
} from "./current-affairs.schema";

export const validateCreateCurrentAffair = validateRequest({
  body: createCurrentAffairSchema,
});

export const validateUpdateCurrentAffair = validateRequest({
  params: currentAffairIdParamSchema,
  body: updateCurrentAffairSchema,
});

export const validateCurrentAffairQuery = validateRequest({
  query: currentAffairQuerySchema,
});

export const validateCurrentAffairIdParam = validateRequest({
  params: currentAffairIdParamSchema,
});
