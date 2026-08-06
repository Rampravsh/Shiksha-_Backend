import { ExamCategory } from "@prisma/client";
import { ExamCategoriesRepository } from "./exam-categories.repository";
import {
  CreateExamCategoryInput,
  UpdateExamCategoryInput,
  ExamCategoryQueryFilters,
} from "./exam-categories.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { EXAM_CATEGORIES_MESSAGES } from "./exam-categories.constants";
import { prisma } from "../../core/prisma";

export class ExamCategoriesService {
  constructor(
    private readonly examCategoriesRepository: ExamCategoriesRepository,
  ) {}

  async getAllExamCategories(
    filters: ExamCategoryQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ExamCategory>> {
    const [data, total] = await this.examCategoriesRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getExamCategoryByIdOrSlug(identifier: string): Promise<ExamCategory> {
    let examCategory = await this.examCategoriesRepository.findById(identifier);
    if (!examCategory) {
      examCategory = await this.examCategoriesRepository.findBySlug(identifier);
    }
    if (!examCategory) {
      throw new NotFoundError(EXAM_CATEGORIES_MESSAGES.NOT_FOUND);
    }
    return examCategory;
  }

  async createExamCategory(
    input: CreateExamCategoryInput,
  ): Promise<ExamCategory> {
    const parentCategory = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!parentCategory) {
      throw new NotFoundError(
        EXAM_CATEGORIES_MESSAGES.PARENT_CATEGORY_NOT_FOUND,
      );
    }

    const existingName = await this.examCategoriesRepository.findByName(
      input.name,
    );
    if (existingName) {
      throw new ConflictError(EXAM_CATEGORIES_MESSAGES.ALREADY_EXISTS);
    }

    return this.examCategoriesRepository.create(input);
  }

  async updateExamCategory(
    id: string,
    input: UpdateExamCategoryInput,
  ): Promise<ExamCategory> {
    await this.getExamCategoryByIdOrSlug(id);

    if (input.categoryId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!parentCategory) {
        throw new NotFoundError(
          EXAM_CATEGORIES_MESSAGES.PARENT_CATEGORY_NOT_FOUND,
        );
      }
    }

    if (input.name) {
      const existingName = await this.examCategoriesRepository.findByName(
        input.name,
      );
      if (existingName && existingName.id !== id) {
        throw new ConflictError(EXAM_CATEGORIES_MESSAGES.ALREADY_EXISTS);
      }
    }

    return this.examCategoriesRepository.update(id, input);
  }

  async deleteExamCategory(id: string): Promise<ExamCategory> {
    await this.getExamCategoryByIdOrSlug(id);
    return this.examCategoriesRepository.delete(id);
  }
}
