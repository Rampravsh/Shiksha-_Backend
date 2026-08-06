import { validateRequest } from "../../middleware/validation.middleware";
import {
  createExamCategorySchema,
  updateExamCategorySchema,
  examCategoryQuerySchema,
  examCategoryIdParamSchema,
} from "./exam-categories.schema";

export const validateCreateExamCategory = validateRequest({
  body: createExamCategorySchema,
});

export const validateUpdateExamCategory = validateRequest({
  params: examCategoryIdParamSchema,
  body: updateExamCategorySchema,
});

export const validateExamCategoryQuery = validateRequest({
  query: examCategoryQuerySchema,
});

export const validateExamCategoryIdParam = validateRequest({
  params: examCategoryIdParamSchema,
});
