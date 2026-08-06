import { TestPapersService } from "../src/modules/test-papers/test-papers.service";
import { TestPapersRepository } from "../src/modules/test-papers/test-papers.repository";
import { NotFoundError } from "../src/core/errors";
import { prisma } from "../src/core/prisma";
import { TestPaper } from "@prisma/client";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    exam: { findUnique: jest.fn() },
    testQuestion: { findMany: jest.fn(), createMany: jest.fn() },
  },
}));

describe("Test Papers Module Unit Tests", () => {
  let testPapersRepository: jest.Mocked<TestPapersRepository>;
  let testPapersService: TestPapersService;

  beforeEach(() => {
    testPapersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByTitle: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      setStatus: jest.fn(),
      updateTotals: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TestPapersRepository>;

    testPapersService = new TestPapersService(testPapersRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated test papers list", async () => {
    const mockTestPapers = [
      { id: "tp-1", title: "SSC CGL Full Mock 1", slug: "ssc-cgl-mock-1" },
    ] as unknown as TestPaper[];
    testPapersRepository.findAll.mockResolvedValue([mockTestPapers, 1]);

    const result = await testPapersService.getAllTestPapers(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("should create test paper when associated exam exists", async () => {
    (prisma.exam.findUnique as jest.Mock).mockResolvedValue({ id: "exam-1" });
    testPapersRepository.findByTitle.mockResolvedValue(null);
    testPapersRepository.create.mockResolvedValue({
      id: "tp-1",
      title: "SSC CGL Full Mock 1",
    } as unknown as TestPaper);

    const result = await testPapersService.createTestPaper({
      title: "SSC CGL Full Mock 1",
      examId: "exam-1",
      durationMinutes: 60,
    });

    expect(result.title).toBe("SSC CGL Full Mock 1");
  });

  it("should throw NotFoundError if exam does not exist", async () => {
    (prisma.exam.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      testPapersService.createTestPaper({
        title: "Test Paper",
        examId: "non-existent-exam",
        durationMinutes: 60,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
