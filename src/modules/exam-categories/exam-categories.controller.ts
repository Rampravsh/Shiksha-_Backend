import { Request, Response } from "express";
import { ExamCategoriesService } from "./exam-categories.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { EXAM_CATEGORIES_MESSAGES } from "./exam-categories.constants";
import {
  CreateExamCategoryInput,
  UpdateExamCategoryInput,
} from "./exam-categories.types";
import { ExamCategoryType } from "@prisma/client";

export class ExamCategoriesController {
  constructor(private readonly examCategoriesService: ExamCategoriesService) {}

  getAllExamCategories = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      type: req.query.type as ExamCategoryType | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.examCategoriesService.getAllExamCategories(
      filters,
      pagination,
    );
    ApiResponse.success(res, EXAM_CATEGORIES_MESSAGES.FETCHED_ALL, result);
  };

  getExamCategoryById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const examCategory =
      await this.examCategoriesService.getExamCategoryByIdOrSlug(id);
    ApiResponse.success(
      res,
      EXAM_CATEGORIES_MESSAGES.FETCHED_ONE,
      examCategory,
    );
  };

  createExamCategory = async (req: Request, res: Response): Promise<void> => {
    const input: CreateExamCategoryInput = req.body;
    const newExamCategory =
      await this.examCategoriesService.createExamCategory(input);
    ApiResponse.created(res, EXAM_CATEGORIES_MESSAGES.CREATED, newExamCategory);
  };

  updateExamCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateExamCategoryInput = req.body;
    const updatedExamCategory =
      await this.examCategoriesService.updateExamCategory(id, input);
    ApiResponse.success(
      res,
      EXAM_CATEGORIES_MESSAGES.UPDATED,
      updatedExamCategory,
    );
  };

  deleteExamCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedExamCategory =
      await this.examCategoriesService.deleteExamCategory(id);
    ApiResponse.success(
      res,
      EXAM_CATEGORIES_MESSAGES.DELETED,
      deletedExamCategory,
    );
  };
}
