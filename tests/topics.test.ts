import { TopicsService } from "../src/modules/topics/topics.service";
import { TopicsRepository } from "../src/modules/topics/topics.repository";
import { NotFoundError } from "../src/core/errors";
import { prisma } from "../src/core/prisma";
import { Topic } from "@prisma/client";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    subject: { findUnique: jest.fn() },
  },
}));

describe("Topics Module Unit Tests", () => {
  let topicsRepository: jest.Mocked<TopicsRepository>;
  let topicsService: TopicsService;

  beforeEach(() => {
    topicsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TopicsRepository>;

    topicsService = new TopicsService(topicsRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated topics list", async () => {
    const mockTopics = [
      { id: "top-1", name: "Percentage", slug: "percentage" },
    ] as unknown as Topic[];
    topicsRepository.findAll.mockResolvedValue([mockTopics, 1]);

    const result = await topicsService.getAllTopics(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("should create topic successfully when subject exists", async () => {
    (prisma.subject.findUnique as jest.Mock).mockResolvedValue({ id: "sub-1" });
    topicsRepository.findByName.mockResolvedValue(null);
    topicsRepository.create.mockResolvedValue({
      id: "top-1",
      name: "Profit & Loss",
      slug: "profit-loss",
    } as unknown as Topic);

    const result = await topicsService.createTopic({
      name: "Profit & Loss",
      subjectId: "sub-1",
    });

    expect(result.name).toBe("Profit & Loss");
  });

  it("should throw NotFoundError if parent subject does not exist", async () => {
    (prisma.subject.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      topicsService.createTopic({
        name: "Profit & Loss",
        subjectId: "invalid-sub",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
