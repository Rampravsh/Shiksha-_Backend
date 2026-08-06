import { validateRequest } from "../../middleware/validation.middleware";
import { dashboardQuerySchema } from "./dashboard.schema";

export const validateDashboardQuery = validateRequest({
  query: dashboardQuerySchema,
});
