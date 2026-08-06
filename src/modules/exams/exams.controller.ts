import { Request, Response } from "express";
import { ExamsService } from "./exams.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { EXAMS_MESSAGES } from "./exams.constants";
import { CreateExamInput, UpdateExamInput } from "./exams.types";

export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  getAllExams = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      examCategoryId: req.query.examCategoryId as string | undefined,
      stateId: req.query.stateId as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.examsService.getAllExams(filters, pagination);
    ApiResponse.success(res, EXAMS_MESSAGES.FETCHED_ALL, result);
  };

  getExamById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const exam = await this.examsService.getExamByIdOrSlug(id);
    ApiResponse.success(res, EXAMS_MESSAGES.FETCHED_ONE, exam);
  };

  createExam = async (req: Request, res: Response): Promise<void> => {
    const input: CreateExamInput = req.body;
    const newExam = await this.examsService.createExam(input);
    ApiResponse.created(res, EXAMS_MESSAGES.CREATED, newExam);
  };

  updateExam = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateExamInput = req.body;
    const updatedExam = await this.examsService.updateExam(id, input);
    ApiResponse.success(res, EXAMS_MESSAGES.UPDATED, updatedExam);
  };

  activateExam = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const updatedExam = await this.examsService.setExamActiveStatus(id, true);
    ApiResponse.success(res, EXAMS_MESSAGES.UPDATED, updatedExam);
  };

  deactivateExam = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const updatedExam = await this.examsService.setExamActiveStatus(id, false);
    ApiResponse.success(res, EXAMS_MESSAGES.UPDATED, updatedExam);
  };

  deleteExam = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedExam = await this.examsService.deleteExam(id);
    ApiResponse.success(res, EXAMS_MESSAGES.DELETED, deletedExam);
  };
}
