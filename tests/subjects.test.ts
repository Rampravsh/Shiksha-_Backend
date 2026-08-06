import { SubjectsService } from "../src/modules/subjects/subjects.service";
import { SubjectsRepository } from "../src/modules/subjects/subjects.repository";
import { NotFoundError } from "../src/core/errors";
import { prisma } from "../src/core/prisma";
import { Subject } from "@prisma/client";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    exam: { findUnique: jest.fn() },
  },
}));

describe("Subjects Module Unit Tests", () => {
  let subjectsRepository: jest.Mocked<SubjectsRepository>;
  let subjectsService: SubjectsService;

  beforeEach(() => {
    subjectsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubjectsRepository>;

    subjectsService = new SubjectsService(subjectsRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated subjects list", async () => {
    const mockSubjects = [
      { id: "sub-1", name: "Quantitative Aptitude", slug: "quant" },
    ] as unknown as Subject[];
    subjectsRepository.findAll.mockResolvedValue([mockSubjects, 1]);

    const result = await subjectsService.getAllSubjects(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("should create subject successfully when exam exists", async () => {
    (prisma.exam.findUnique as jest.Mock).mockResolvedValue({ id: "exam-1" });
    subjectsRepository.findByName.mockResolvedValue(null);
    subjectsRepository.create.mockResolvedValue({
      id: "sub-1",
      name: "General Awareness",
      slug: "general-awareness",
    } as unknown as Subject);

    const result = await subjectsService.createSubject({
      name: "General Awareness",
      examId: "exam-1",
    });

    expect(result.name).toBe("General Awareness");
  });

  it("should throw NotFoundError if parent exam does not exist", async () => {
    (prisma.exam.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      subjectsService.createSubject({
        name: "General Awareness",
        examId: "invalid-exam",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
