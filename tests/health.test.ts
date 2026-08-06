import { HealthService } from "../src/modules/health/health.service";
import { HealthRepository } from "../src/modules/health/health.repository";

describe("Health Module Unit Tests", () => {
  let healthRepository: jest.Mocked<HealthRepository>;
  let healthService: HealthService;

  beforeEach(() => {
    healthRepository = {
      checkDatabase: jest.fn(),
      checkFirebase: jest.fn(),
      checkCloudinary: jest.fn(),
    } as unknown as jest.Mocked<HealthRepository>;

    healthService = new HealthService(healthRepository);
    jest.clearAllMocks();
  });

  it("should return detailed system health status UP when DB is reachable", async () => {
    healthRepository.checkDatabase.mockResolvedValue({
      status: "UP",
      latencyMs: 5,
    });
    healthRepository.checkFirebase.mockReturnValue({ status: "UP" });
    healthRepository.checkCloudinary.mockReturnValue({ status: "UP" });

    const result = await healthService.getFullHealth();

    expect(result.status).toBe("UP");
    expect(result.components.database.status).toBe("UP");
    expect(result.components.firebase.status).toBe("UP");
    expect(result.components.cloudinary.status).toBe("UP");
  });
});
