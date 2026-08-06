import { validateRequest } from "../../middleware/validation.middleware";
import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectQuerySchema,
  subjectIdParamSchema,
} from "./subjects.schema";

export const validateCreateSubject = validateRequest({
  body: createSubjectSchema,
});

export const validateUpdateSubject = validateRequest({
  params: subjectIdParamSchema,
  body: updateSubjectSchema,
});

export const validateSubjectQuery = validateRequest({
  query: subjectQuerySchema,
});

export const validateSubjectIdParam = validateRequest({
  params: subjectIdParamSchema,
});
