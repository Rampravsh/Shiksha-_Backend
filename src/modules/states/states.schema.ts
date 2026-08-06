import { z } from "zod";

export const createStateSchema = z.object({
  name: z.string().min(2, "State name must be at least 2 characters").max(100),
  code: z
    .string()
    .min(2, "State code must be 2 characters")
    .max(5)
    .toUpperCase(),
  isActive: z.boolean().optional().default(true),
});

export const updateStateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z.string().min(2).max(5).toUpperCase().optional(),
  isActive: z.boolean().optional(),
});

export const stateQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  isActive: z.string().optional(),
});

export const stateIdParamSchema = z.object({
  id: z.string().min(1, "State ID or code is required"),
});
