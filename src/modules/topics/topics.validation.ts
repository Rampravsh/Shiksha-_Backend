import { validateRequest } from "../../middleware/validation.middleware";
import {
  createTopicSchema,
  updateTopicSchema,
  topicQuerySchema,
  topicIdParamSchema,
} from "./topics.schema";

export const validateCreateTopic = validateRequest({
  body: createTopicSchema,
});

export const validateUpdateTopic = validateRequest({
  params: topicIdParamSchema,
  body: updateTopicSchema,
});

export const validateTopicQuery = validateRequest({
  query: topicQuerySchema,
});

export const validateTopicIdParam = validateRequest({
  params: topicIdParamSchema,
});
