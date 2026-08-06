import { Exam } from "@prisma/client";
import { ExamsRepository } from "./exams.repository";
import {
  CreateExamInput,
  UpdateExamInput,
  ExamQueryFilters,
} from "./exams.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { EXAMS_MESSAGES } from "./exams.constants";
import { prisma } from "../../core/prisma";

export class ExamsService {
  constructor(private readonly examsRepository: ExamsRepository) {}

  async getAllExams(
    filters: ExamQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Exam>> {
    const [data, total] = await this.examsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getExamByIdOrSlug(identifier: string): Promise<Exam> {
    let exam = await this.examsRepository.findById(identifier);
    if (!exam) {
      exam = await this.examsRepository.findBySlug(identifier);
    }
    if (!exam) {
      throw new NotFoundError(EXAMS_MESSAGES.NOT_FOUND);
    }
    return exam;
  }

  async createExam(input: CreateExamInput): Promise<Exam> {
    const examCategory = await prisma.examCategory.findUnique({
      where: { id: input.examCategoryId },
    });
    if (!examCategory) {
      throw new NotFoundError(EXAMS_MESSAGES.CATEGORY_NOT_FOUND);
    }

    if (input.stateId) {
      const state = await prisma.state.findUnique({
        where: { id: input.stateId },
      });
      if (!state) {
        throw new NotFoundError(EXAMS_MESSAGES.STATE_NOT_FOUND);
      }
    }

    const existingTitle = await this.examsRepository.findByTitle(input.title);
    if (existingTitle) {
      throw new ConflictError(EXAMS_MESSAGES.ALREADY_EXISTS);
    }

    return this.examsRepository.create(input);
  }

  async updateExam(id: string, input: UpdateExamInput): Promise<Exam> {
    await this.getExamByIdOrSlug(id);

    if (input.examCategoryId) {
      const examCategory = await prisma.examCategory.findUnique({
        where: { id: input.examCategoryId },
      });
      if (!examCategory) {
        throw new NotFoundError(EXAMS_MESSAGES.CATEGORY_NOT_FOUND);
      }
    }

    if (input.stateId) {
      const state = await prisma.state.findUnique({
        where: { id: input.stateId },
      });
      if (!state) {
        throw new NotFoundError(EXAMS_MESSAGES.STATE_NOT_FOUND);
      }
    }

    if (input.title) {
      const existingTitle = await this.examsRepository.findByTitle(input.title);
      if (existingTitle && existingTitle.id !== id) {
        throw new ConflictError(EXAMS_MESSAGES.ALREADY_EXISTS);
      }
    }

    return this.examsRepository.update(id, input);
  }

  async setExamActiveStatus(id: string, isActive: boolean): Promise<Exam> {
    await this.getExamByIdOrSlug(id);
    return this.examsRepository.update(id, { isActive });
  }

  async deleteExam(id: string): Promise<Exam> {
    await this.getExamByIdOrSlug(id);
    return this.examsRepository.delete(id);
  }
}
