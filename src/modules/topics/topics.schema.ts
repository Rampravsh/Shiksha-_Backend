import { z } from "zod";

export const createTopicSchema = z.object({
  name: z.string().min(2, "Topic name must be at least 2 characters").max(150),
  subjectId: z.string().uuid("Invalid subject ID"),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const updateTopicSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  subjectId: z.string().uuid().optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const topicQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  subjectId: z.string().optional(),
  isActive: z.string().optional(),
});

export const topicIdParamSchema = z.object({
  id: z.string().min(1, "Topic ID or slug is required"),
});
