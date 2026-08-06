import { QuestionsService } from "../src/modules/questions/questions.service";
import { QuestionsRepository } from "../src/modules/questions/questions.repository";
import { ConflictError } from "../src/core/errors";
import { QuestionStatus, Question } from "@prisma/client";
import { prisma } from "../src/core/prisma";

jest.mock("../src/core/prisma", () => ({
  prisma: {
    exam: { findUnique: jest.fn() },
    subject: { findUnique: jest.fn() },
    topic: { findUnique: jest.fn() },
  },
}));

describe("Questions Module Unit Tests (Question Bank)", () => {
  let questionsRepository: jest.Mocked<QuestionsRepository>;
  let questionsService: QuestionsService;

  beforeEach(() => {
    questionsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByText: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      setStatus: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<QuestionsRepository>;

    questionsService = new QuestionsService(questionsRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated question bank items", async () => {
    const mockQuestions = [
      { id: "q-1", textEn: "What is 2+2?" },
    ] as unknown as Question[];
    questionsRepository.findAll.mockResolvedValue([mockQuestions, 1]);

    const result = await questionsService.getAllQuestions(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
  });

  it("should create question item in question bank", async () => {
    (prisma.exam.findUnique as jest.Mock).mockResolvedValue({ id: "exam-1" });
    (prisma.subject.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
    });
    questionsRepository.findByText.mockResolvedValue(null);
    questionsRepository.create.mockResolvedValue({
      id: "q-1",
      textEn: "What is the capital of India?",
      status: QuestionStatus.DRAFT,
    } as unknown as Question);

    const result = await questionsService.createQuestion({
      textEn: "What is the capital of India?",
      examId: "exam-1",
      subjectId: "sub-1",
      options: [{ id: "opt-1", textEn: "New Delhi" }],
      correctAnswer: "opt-1",
    });

    expect(result.textEn).toBe("What is the capital of India?");
  });

  it("should detect duplicate question text for same exam", async () => {
    (prisma.exam.findUnique as jest.Mock).mockResolvedValue({ id: "exam-1" });
    (prisma.subject.findUnique as jest.Mock).mockResolvedValue({
      id: "sub-1",
    });
    questionsRepository.findByText.mockResolvedValue({
      id: "existing-q",
    } as unknown as Question);

    await expect(
      questionsService.createQuestion({
        textEn: "Duplicate Question Text",
        examId: "exam-1",
        subjectId: "sub-1",
        options: [],
        correctAnswer: "opt-1",
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("should publish a draft question", async () => {
    questionsRepository.findById.mockResolvedValue({
      id: "q-1",
      status: QuestionStatus.DRAFT,
    } as unknown as Question);
    questionsRepository.setStatus.mockResolvedValue({
      id: "q-1",
      status: QuestionStatus.PUBLISHED,
    } as unknown as Question);

    const result = await questionsService.setQuestionStatus(
      "q-1",
      QuestionStatus.PUBLISHED,
    );

    expect(result.status).toBe(QuestionStatus.PUBLISHED);
  });
});
