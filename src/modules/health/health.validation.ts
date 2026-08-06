import { validateRequest } from "../../middleware/validation.middleware";
import { healthQuerySchema } from "./health.schema";

export const validateHealthQuery = validateRequest({
  query: healthQuerySchema,
});
