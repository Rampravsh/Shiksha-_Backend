import { validateRequest } from "../../middleware/validation.middleware";
import {
  createQuestionSchema,
  updateQuestionSchema,
  questionQuerySchema,
  questionIdParamSchema,
  bulkCreateQuestionsSchema,
} from "./questions.schema";

export const validateCreateQuestion = validateRequest({
  body: createQuestionSchema,
});

export const validateBulkCreateQuestions = validateRequest({
  body: bulkCreateQuestionsSchema,
});

export const validateUpdateQuestion = validateRequest({
  params: questionIdParamSchema,
  body: updateQuestionSchema,
});

export const validateQuestionQuery = validateRequest({
  query: questionQuerySchema,
});

export const validateQuestionIdParam = validateRequest({
  params: questionIdParamSchema,
});
