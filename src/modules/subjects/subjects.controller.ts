import { Request, Response } from "express";
import { SubjectsService } from "./subjects.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { SUBJECTS_MESSAGES } from "./subjects.constants";
import { CreateSubjectInput, UpdateSubjectInput } from "./subjects.types";

export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  getAllSubjects = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      examId: req.query.examId as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.subjectsService.getAllSubjects(
      filters,
      pagination,
    );
    ApiResponse.success(res, SUBJECTS_MESSAGES.FETCHED_ALL, result);
  };

  getSubjectById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const subject = await this.subjectsService.getSubjectByIdOrSlug(id);
    ApiResponse.success(res, SUBJECTS_MESSAGES.FETCHED_ONE, subject);
  };

  createSubject = async (req: Request, res: Response): Promise<void> => {
    const input: CreateSubjectInput = req.body;
    const newSubject = await this.subjectsService.createSubject(input);
    ApiResponse.created(res, SUBJECTS_MESSAGES.CREATED, newSubject);
  };

  updateSubject = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateSubjectInput = req.body;
    const updatedSubject = await this.subjectsService.updateSubject(id, input);
    ApiResponse.success(res, SUBJECTS_MESSAGES.UPDATED, updatedSubject);
  };

  deleteSubject = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedSubject = await this.subjectsService.deleteSubject(id);
    ApiResponse.success(res, SUBJECTS_MESSAGES.DELETED, deletedSubject);
  };
}
