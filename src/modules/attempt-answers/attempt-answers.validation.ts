import { validateRequest } from "../../middleware/validation.middleware";
import {
  saveAnswerSchema,
  attemptAnswerParamsSchema,
} from "./attempt-answers.schema";

export const validateSaveAnswer = validateRequest({
  params: attemptAnswerParamsSchema,
  body: saveAnswerSchema,
});

export const validateAttemptAnswerParams = validateRequest({
  params: attemptAnswerParamsSchema,
});
