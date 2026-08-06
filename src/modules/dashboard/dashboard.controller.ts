import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { ApiResponse } from "../../core/response";
import { DASHBOARD_MESSAGES } from "./dashboard.constants";
import { UnauthorizedError } from "../../core/errors";

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getStudentDashboard = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const dashboard = await this.dashboardService.getStudentDashboard(
      req.user.id,
    );
    ApiResponse.success(res, DASHBOARD_MESSAGES.STUDENT_FETCHED, dashboard);
  };

  getAdminDashboard = async (_req: Request, res: Response): Promise<void> => {
    const dashboard = await this.dashboardService.getAdminDashboard();
    ApiResponse.success(res, DASHBOARD_MESSAGES.ADMIN_FETCHED, dashboard);
  };
}
