import { validateRequest } from "../../middleware/validation.middleware";
import {
  addTestQuestionSchema,
  bulkAddTestQuestionsSchema,
  reorderTestQuestionsSchema,
  testQuestionParamsSchema,
} from "./test-questions.schema";

export const validateAddTestQuestion = validateRequest({
  params: testQuestionParamsSchema,
  body: addTestQuestionSchema,
});

export const validateBulkAddTestQuestions = validateRequest({
  params: testQuestionParamsSchema,
  body: bulkAddTestQuestionsSchema,
});

export const validateReorderTestQuestions = validateRequest({
  params: testQuestionParamsSchema,
  body: reorderTestQuestionsSchema,
});

export const validateTestQuestionParams = validateRequest({
  params: testQuestionParamsSchema,
});
