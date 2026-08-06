import { StatesService } from "../src/modules/states/states.service";
import { StatesRepository } from "../src/modules/states/states.repository";

describe("States Module Unit Tests", () => {
  let statesRepository: jest.Mocked<StatesRepository>;
  let statesService: StatesService;

  beforeEach(() => {
    statesRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<StatesRepository>;

    statesService = new StatesService(statesRepository);
  });

  it("should fetch all states with pagination", async () => {
    const mockStates = [
      {
        id: "state-1",
        name: "Delhi",
        code: "DL",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    statesRepository.findAll.mockResolvedValue([mockStates, 1]);

    const result = await statesService.getAllStates(
      {},
      { page: 1, limit: 10, skip: 0, sortOrder: "asc" },
    );

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(statesRepository.findAll).toHaveBeenCalledWith({}, 0, 10);
  });

  it("should create a new state when name and code are unique", async () => {
    const input = { name: "Punjab", code: "PB" };
    const mockCreated = {
      id: "state-2",
      name: "Punjab",
      code: "PB",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    statesRepository.findByCode.mockResolvedValue(null);
    statesRepository.findByName.mockResolvedValue(null);
    statesRepository.create.mockResolvedValue(mockCreated);

    const result = await statesService.createState(input);

    expect(result.name).toBe("Punjab");
    expect(result.code).toBe("PB");
    expect(statesRepository.create).toHaveBeenCalledWith(input);
  });
});
