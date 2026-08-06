import { DashboardService } from "../src/modules/dashboard/dashboard.service";
import { DashboardRepository } from "../src/modules/dashboard/dashboard.repository";

describe("Dashboard Module Unit Tests", () => {
  let dashboardRepository: jest.Mocked<DashboardRepository>;
  let dashboardService: DashboardService;

  beforeEach(() => {
    dashboardRepository = {
      getStudentDashboard: jest.fn(),
      getAdminDashboard: jest.fn(),
    } as unknown as jest.Mocked<DashboardRepository>;

    dashboardService = new DashboardService(dashboardRepository);
    jest.clearAllMocks();
  });

  it("should aggregate student dashboard metrics dynamically", async () => {
    dashboardRepository.getStudentDashboard.mockResolvedValue({
      performance: {
        totalAttempts: 10,
        totalCompleted: 8,
        averageScore: 75.5,
        averageAccuracy: 85.0,
        bestScore: 92.0,
      },
      recentAttempts: [],
      latestTestPapers: [],
      recentCurrentAffairs: [],
    });

    const result = await dashboardService.getStudentDashboard("u-1");
    expect(result.performance.totalAttempts).toBe(10);
    expect(result.performance.averageScore).toBe(75.5);
  });

  it("should aggregate admin system counts dynamically", async () => {
    dashboardRepository.getAdminDashboard.mockResolvedValue({
      counts: {
        totalUsers: 100,
        totalExams: 10,
        totalQuestions: 500,
        totalTestPapers: 20,
        totalAttempts: 300,
        totalCurrentAffairs: 50,
        totalNotifications: 15,
      },
      recentUsers: [],
      recentTestPapers: [],
    });

    const result = await dashboardService.getAdminDashboard();
    expect(result.counts.totalUsers).toBe(100);
    expect(result.counts.totalQuestions).toBe(500);
  });
});
