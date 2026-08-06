import { CategoriesService } from "../src/modules/categories/categories.service";
import { CategoriesRepository } from "../src/modules/categories/categories.repository";

describe("Categories Module Unit Tests", () => {
  let categoriesRepository: jest.Mocked<CategoriesRepository>;
  let categoriesService: CategoriesService;

  beforeEach(() => {
    categoriesRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CategoriesRepository>;

    categoriesService = new CategoriesService(categoriesRepository);
  });

  it("should fetch all categories with pagination", async () => {
    const mockCategories = [
      {
        id: "cat-1",
        name: "Competitive Exams",
        slug: "competitive-exams",
        description: "National & State Level Exams",
        iconUrl: null,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    categoriesRepository.findAll.mockResolvedValue([mockCategories, 1]);

    const result = await categoriesService.getAllCategories(
      {},
      { page: 1, limit: 10, skip: 0, sortOrder: "asc" },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("should create a new category when name is unique", async () => {
    const input = { name: "Banking Exams", description: "IBPS, SBI, RBI" };
    const mockCreated = {
      id: "cat-2",
      name: "Banking Exams",
      slug: "banking-exams",
      description: "IBPS, SBI, RBI",
      iconUrl: null,
      isActive: true,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    categoriesRepository.findByName.mockResolvedValue(null);
    categoriesRepository.create.mockResolvedValue(mockCreated);

    const result = await categoriesService.createCategory(input);

    expect(result.name).toBe("Banking Exams");
    expect(result.slug).toBe("banking-exams");
    expect(categoriesRepository.create).toHaveBeenCalledWith(input);
  });
});
