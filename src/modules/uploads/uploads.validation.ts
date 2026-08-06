import { validateRequest } from "../../middleware/validation.middleware";
import { uploadQuerySchema, uploadIdParamSchema } from "./uploads.schema";

export const validateUploadQuery = validateRequest({
  query: uploadQuerySchema,
});

export const validateUploadIdParam = validateRequest({
  params: uploadIdParamSchema,
});
