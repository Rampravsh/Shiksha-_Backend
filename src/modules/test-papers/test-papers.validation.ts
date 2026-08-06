import { validateRequest } from "../../middleware/validation.middleware";
import {
  createTestPaperSchema,
  updateTestPaperSchema,
  testPaperQuerySchema,
  testPaperIdParamSchema,
} from "./test-papers.schema";

export const validateCreateTestPaper = validateRequest({
  body: createTestPaperSchema,
});

export const validateUpdateTestPaper = validateRequest({
  params: testPaperIdParamSchema,
  body: updateTestPaperSchema,
});

export const validateTestPaperQuery = validateRequest({
  query: testPaperQuerySchema,
});

export const validateTestPaperIdParam = validateRequest({
  params: testPaperIdParamSchema,
});
