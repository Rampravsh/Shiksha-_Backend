import { CurrentAffairsService } from "../src/modules/current-affairs/current-affairs.service";
import { CurrentAffairsRepository } from "../src/modules/current-affairs/current-affairs.repository";
import { NotFoundError } from "../src/core/errors";
import { CurrentAffair } from "@prisma/client";

describe("Current Affairs Module Unit Tests", () => {
  let currentAffairsRepository: jest.Mocked<CurrentAffairsRepository>;
  let currentAffairsService: CurrentAffairsService;

  beforeEach(() => {
    currentAffairsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CurrentAffairsRepository>;

    currentAffairsService = new CurrentAffairsService(currentAffairsRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated current affairs", async () => {
    const mockCA = [
      { id: "ca-1", title: "Union Budget Highlights", isPublished: true },
    ] as unknown as CurrentAffair[];
    currentAffairsRepository.findAll.mockResolvedValue([mockCA, 1]);

    const result = await currentAffairsService.getAllCurrentAffairs(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("should create new current affair record", async () => {
    currentAffairsRepository.create.mockResolvedValue({
      id: "ca-1",
      title: "Union Budget Highlights",
    } as unknown as CurrentAffair);

    const result = await currentAffairsService.create(
      {
        title: "Union Budget Highlights",
        description: "Full summary of Union Budget 2026",
      },
      "admin-1",
    );

    expect(result.title).toBe("Union Budget Highlights");
  });

  it("should throw NotFoundError if item does not exist", async () => {
    currentAffairsRepository.findById.mockResolvedValue(null);
    currentAffairsRepository.findBySlug.mockResolvedValue(null);

    await expect(
      currentAffairsService.getByIdOrSlug("non-existent"),
    ).rejects.toThrow(NotFoundError);
  });
});
