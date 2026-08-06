import { validateRequest } from "../../middleware/validation.middleware";
import {
  createStateSchema,
  updateStateSchema,
  stateQuerySchema,
  stateIdParamSchema,
} from "./states.schema";

export const validateCreateState = validateRequest({
  body: createStateSchema,
});

export const validateUpdateState = validateRequest({
  params: stateIdParamSchema,
  body: updateStateSchema,
});

export const validateStateQuery = validateRequest({
  query: stateQuerySchema,
});

export const validateStateIdParam = validateRequest({
  params: stateIdParamSchema,
});
