import { Category } from "@prisma/client";
import { CategoriesRepository } from "./categories.repository";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryFilters,
} from "./categories.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { CATEGORIES_MESSAGES } from "./categories.constants";

export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAllCategories(
    filters: CategoryQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Category>> {
    const [data, total] = await this.categoriesRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getCategoryByIdOrSlug(identifier: string): Promise<Category> {
    let category = await this.categoriesRepository.findById(identifier);
    if (!category) {
      category = await this.categoriesRepository.findBySlug(identifier);
    }
    if (!category) {
      throw new NotFoundError(CATEGORIES_MESSAGES.NOT_FOUND);
    }
    return category;
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const existingName = await this.categoriesRepository.findByName(input.name);
    if (existingName) {
      throw new ConflictError(CATEGORIES_MESSAGES.ALREADY_EXISTS);
    }

    return this.categoriesRepository.create(input);
  }

  async updateCategory(
    id: string,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    await this.getCategoryByIdOrSlug(id);

    if (input.name) {
      const existingName = await this.categoriesRepository.findByName(
        input.name,
      );
      if (existingName && existingName.id !== id) {
        throw new ConflictError(CATEGORIES_MESSAGES.ALREADY_EXISTS);
      }
    }

    return this.categoriesRepository.update(id, input);
  }

  async deleteCategory(id: string): Promise<Category> {
    await this.getCategoryByIdOrSlug(id);
    return this.categoriesRepository.delete(id);
  }
}
