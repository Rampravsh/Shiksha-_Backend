import { TestPaper } from "@prisma/client";
import { TestPapersRepository } from "./test-papers.repository";
import {
  CreateTestPaperInput,
  UpdateTestPaperInput,
  TestPaperQueryFilters,
} from "./test-papers.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { TEST_PAPERS_MESSAGES } from "./test-papers.constants";
import { prisma } from "../../core/prisma";

export class TestPapersService {
  constructor(private readonly testPapersRepository: TestPapersRepository) {}

  async getAllTestPapers(
    filters: TestPaperQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TestPaper>> {
    const [data, total] = await this.testPapersRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getTestPaperByIdOrSlug(identifier: string): Promise<TestPaper> {
    let testPaper = await this.testPapersRepository.findById(identifier);
    if (!testPaper) {
      testPaper = await this.testPapersRepository.findBySlug(identifier);
    }
    if (!testPaper) {
      throw new NotFoundError(TEST_PAPERS_MESSAGES.NOT_FOUND);
    }
    return testPaper;
  }

  async createTestPaper(input: CreateTestPaperInput): Promise<TestPaper> {
    const exam = await prisma.exam.findUnique({
      where: { id: input.examId },
    });
    if (!exam) {
      throw new NotFoundError(TEST_PAPERS_MESSAGES.EXAM_NOT_FOUND);
    }

    const existingTitle = await this.testPapersRepository.findByTitle(
      input.title,
      input.examId,
    );
    if (existingTitle) {
      throw new ConflictError(TEST_PAPERS_MESSAGES.ALREADY_EXISTS);
    }

    return this.testPapersRepository.create(input);
  }

  async updateTestPaper(
    id: string,
    input: UpdateTestPaperInput,
  ): Promise<TestPaper> {
    await this.getTestPaperByIdOrSlug(id);

    if (input.examId) {
      const exam = await prisma.exam.findUnique({
        where: { id: input.examId },
      });
      if (!exam) {
        throw new NotFoundError(TEST_PAPERS_MESSAGES.EXAM_NOT_FOUND);
      }
    }

    return this.testPapersRepository.update(id, input);
  }

  async setPublishStatus(id: string, isPublished: boolean): Promise<TestPaper> {
    await this.getTestPaperByIdOrSlug(id);
    return this.testPapersRepository.setPublishStatus(id, isPublished);
  }

  async cloneTestPaper(id: string): Promise<TestPaper> {
    const original = await this.getTestPaperByIdOrSlug(id);

    const cloned = await this.createTestPaper({
      title: `${original.title} (Copy)`,
      examId: original.examId,
      description: original.description ?? undefined,
      durationMins: original.durationMins,
      totalMarks: original.totalMarks,
      positiveMarks: original.positiveMarks,
      negativeMarks: original.negativeMarks,
      language: original.language,
      isPublished: false,
    });

    const testQuestions = await prisma.testQuestion.findMany({
      where: { testPaperId: original.id },
    });

    if (testQuestions.length > 0) {
      await prisma.testQuestion.createMany({
        data: testQuestions.map((q) => ({
          testPaperId: cloned.id,
          questionId: q.questionId,
          sortOrder: q.sortOrder,
        })),
      });

      await this.testPapersRepository.updateTotals(
        cloned.id,
        testQuestions.length,
        original.totalMarks,
      );
    }

    return this.getTestPaperByIdOrSlug(cloned.id);
  }

  async deleteTestPaper(id: string): Promise<TestPaper> {
    await this.getTestPaperByIdOrSlug(id);
    return this.testPapersRepository.delete(id);
  }
}
