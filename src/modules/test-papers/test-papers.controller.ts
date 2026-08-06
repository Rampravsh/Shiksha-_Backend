import { Request, Response } from "express";
import { TestPapersService } from "./test-papers.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { TEST_PAPERS_MESSAGES } from "./test-papers.constants";
import {
  CreateTestPaperInput,
  UpdateTestPaperInput,
} from "./test-papers.types";
import { Language } from "@prisma/client";

export class TestPapersController {
  constructor(private readonly testPapersService: TestPapersService) {}

  getAllTestPapers = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      examId: req.query.examId as string | undefined,
      language: req.query.language as Language | undefined,
      isPublished:
        req.query.isPublished !== undefined
          ? req.query.isPublished === "true"
          : undefined,
    };

    const result = await this.testPapersService.getAllTestPapers(
      filters,
      pagination,
    );
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.FETCHED_ALL, result);
  };

  getTestPaperById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const testPaper = await this.testPapersService.getTestPaperByIdOrSlug(id);
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.FETCHED_ONE, testPaper);
  };

  createTestPaper = async (req: Request, res: Response): Promise<void> => {
    const input: CreateTestPaperInput = req.body;
    const newTestPaper = await this.testPapersService.createTestPaper(input);
    ApiResponse.created(res, TEST_PAPERS_MESSAGES.CREATED, newTestPaper);
  };

  updateTestPaper = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateTestPaperInput = req.body;
    const updated = await this.testPapersService.updateTestPaper(id, input);
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.UPDATED, updated);
  };

  publishTestPaper = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const published = await this.testPapersService.setPublishStatus(id, true);
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.PUBLISHED, published);
  };

  unpublishTestPaper = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const unpublished = await this.testPapersService.setPublishStatus(
      id,
      false,
    );
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.DRAFT, unpublished);
  };

  archiveTestPaper = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const archived = await this.testPapersService.setPublishStatus(id, false);
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.ARCHIVED, archived);
  };

  cloneTestPaper = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const cloned = await this.testPapersService.cloneTestPaper(id);
    ApiResponse.created(res, TEST_PAPERS_MESSAGES.CLONED, cloned);
  };

  deleteTestPaper = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deleted = await this.testPapersService.deleteTestPaper(id);
    ApiResponse.success(res, TEST_PAPERS_MESSAGES.DELETED, deleted);
  };
}
