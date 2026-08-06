import { Router } from "express";
import { DashboardRepository } from "./dashboard.repository";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);

const router = Router();

router.get(
  "/student",
  authMiddleware,
  asyncHandler(dashboardController.getStudentDashboard),
);
router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  asyncHandler(dashboardController.getAdminDashboard),
);

export const dashboardRouter = router;
