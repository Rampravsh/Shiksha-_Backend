import { validateRequest } from "../../middleware/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  categoryIdParamSchema,
} from "./categories.schema";

export const validateCreateCategory = validateRequest({
  body: createCategorySchema,
});

export const validateUpdateCategory = validateRequest({
  params: categoryIdParamSchema,
  body: updateCategorySchema,
});

export const validateCategoryQuery = validateRequest({
  query: categoryQuerySchema,
});

export const validateCategoryIdParam = validateRequest({
  params: categoryIdParamSchema,
});
