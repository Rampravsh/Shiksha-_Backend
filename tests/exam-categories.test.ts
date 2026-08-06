import { ExamCategoriesService } from "../src/modules/exam-categories/exam-categories.service";
import { ExamCategoriesRepository } from "../src/modules/exam-categories/exam-categories.repository";
import { ExamCategoryType } from "@prisma/client";

describe("Exam Categories Module Unit Tests", () => {
  let examCategoriesRepository: jest.Mocked<ExamCategoriesRepository>;
  let examCategoriesService: ExamCategoriesService;

  beforeEach(() => {
    examCategoriesRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ExamCategoriesRepository>;

    examCategoriesService = new ExamCategoriesService(examCategoriesRepository);
  });

  it("should fetch all exam categories with pagination", async () => {
    const mockExamCategories = [
      {
        id: "exam-cat-1",
        name: "SSC",
        slug: "ssc",
        type: ExamCategoryType.NATIONAL,
        categoryId: "cat-1",
        description: "Staff Selection Commission",
        iconUrl: null,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    examCategoriesRepository.findAll.mockResolvedValue([mockExamCategories, 1]);

    const result = await examCategoriesService.getAllExamCategories(
      {},
      { page: 1, limit: 10, skip: 0, sortOrder: "asc" },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
