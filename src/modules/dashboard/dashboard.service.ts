import { DashboardRepository } from "./dashboard.repository";
import { StudentDashboard, AdminDashboard } from "./dashboard.types";

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getStudentDashboard(userId: string): Promise<StudentDashboard> {
    return this.dashboardRepository.getStudentDashboard(userId);
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    return this.dashboardRepository.getAdminDashboard();
  }
}
