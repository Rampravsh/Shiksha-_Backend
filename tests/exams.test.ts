import { ExamsService } from "../src/modules/exams/exams.service";
import { ExamsRepository } from "../src/modules/exams/exams.repository";
import { NotFoundError, ConflictError } from "../src/core/errors";
import { prisma } from "../src/core/prisma";
import { Exam } from "@prisma/client";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    examCategory: { findUnique: jest.fn() },
    state: { findUnique: jest.fn() },
  },
}));

describe("Exams Module Unit Tests", () => {
  let examsRepository: jest.Mocked<ExamsRepository>;
  let examsService: ExamsService;

  beforeEach(() => {
    examsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByTitle: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ExamsRepository>;

    examsService = new ExamsService(examsRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated exams list", async () => {
    const mockExams = [
      { id: "exam-1", title: "SSC CGL", slug: "ssc-cgl", isActive: true },
    ] as unknown as Exam[];
    examsRepository.findAll.mockResolvedValue([mockExams, 1]);

    const result = await examsService.getAllExams(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("should create exam successfully when category exists", async () => {
    (prisma.examCategory.findUnique as jest.Mock).mockResolvedValue({
      id: "cat-1",
    });
    examsRepository.findByTitle.mockResolvedValue(null);
    examsRepository.create.mockResolvedValue({
      id: "exam-1",
      title: "UPSC CSE",
      slug: "upsc-cse",
    } as unknown as Exam);

    const result = await examsService.createExam({
      title: "UPSC CSE",
      examCategoryId: "cat-1",
    });

    expect(result.title).toBe("UPSC CSE");
    expect(examsRepository.create).toHaveBeenCalled();
  });

  it("should throw NotFoundError if parent exam category does not exist", async () => {
    (prisma.examCategory.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      examsService.createExam({
        title: "UPSC CSE",
        examCategoryId: "non-existent-cat",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw ConflictError if exam with same title exists", async () => {
    (prisma.examCategory.findUnique as jest.Mock).mockResolvedValue({
      id: "cat-1",
    });
    examsRepository.findByTitle.mockResolvedValue({
      id: "existing-exam",
    } as unknown as Exam);

    await expect(
      examsService.createExam({
        title: "Existing Exam",
        examCategoryId: "cat-1",
      }),
    ).rejects.toThrow(ConflictError);
  });
});
