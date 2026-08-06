import { validateRequest } from "../../middleware/validation.middleware";
import {
  createExamSchema,
  updateExamSchema,
  examQuerySchema,
  examIdParamSchema,
} from "./exams.schema";

export const validateCreateExam = validateRequest({
  body: createExamSchema,
});

export const validateUpdateExam = validateRequest({
  params: examIdParamSchema,
  body: updateExamSchema,
});

export const validateExamQuery = validateRequest({
  query: examQuerySchema,
});

export const validateExamIdParam = validateRequest({
  params: examIdParamSchema,
});
