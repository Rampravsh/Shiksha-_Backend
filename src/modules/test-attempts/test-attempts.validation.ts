import { validateRequest } from "../../middleware/validation.middleware";
import {
  startAttemptSchema,
  attemptIdParamSchema,
  attemptQuerySchema,
} from "./test-attempts.schema";

export const validateStartAttempt = validateRequest({
  body: startAttemptSchema,
});

export const validateAttemptIdParam = validateRequest({
  params: attemptIdParamSchema,
});

export const validateAttemptQuery = validateRequest({
  query: attemptQuerySchema,
});
