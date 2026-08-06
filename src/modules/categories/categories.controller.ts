import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { CATEGORIES_MESSAGES } from "./categories.constants";
import { CreateCategoryInput, UpdateCategoryInput } from "./categories.types";

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.categoriesService.getAllCategories(
      filters,
      pagination,
    );
    ApiResponse.success(res, CATEGORIES_MESSAGES.FETCHED_ALL, result);
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const category = await this.categoriesService.getCategoryByIdOrSlug(id);
    ApiResponse.success(res, CATEGORIES_MESSAGES.FETCHED_ONE, category);
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const input: CreateCategoryInput = req.body;
    const newCategory = await this.categoriesService.createCategory(input);
    ApiResponse.created(res, CATEGORIES_MESSAGES.CREATED, newCategory);
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateCategoryInput = req.body;
    const updatedCategory = await this.categoriesService.updateCategory(
      id,
      input,
    );
    ApiResponse.success(res, CATEGORIES_MESSAGES.UPDATED, updatedCategory);
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedCategory = await this.categoriesService.deleteCategory(id);
    ApiResponse.success(res, CATEGORIES_MESSAGES.DELETED, deletedCategory);
  };
}
