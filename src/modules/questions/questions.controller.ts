import { Request, Response } from "express";
import { QuestionsService } from "./questions.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { QUESTIONS_MESSAGES } from "./questions.constants";
import { CreateQuestionInput, UpdateQuestionInput } from "./questions.types";
import {
  QuestionStatus,
  QuestionType,
  QuestionSource,
  Difficulty,
} from "@prisma/client";

export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  getAllQuestions = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      examId: req.query.examId as string | undefined,
      subjectId: req.query.subjectId as string | undefined,
      topicId: req.query.topicId as string | undefined,
      type: req.query.type as QuestionType | undefined,
      source: req.query.source as QuestionSource | undefined,
      status: req.query.status as QuestionStatus | undefined,
      difficulty: req.query.difficulty as Difficulty | undefined,
      yearAsked: req.query.yearAsked
        ? parseInt(req.query.yearAsked as string, 10)
        : undefined,
    };

    const result = await this.questionsService.getAllQuestions(
      filters,
      pagination,
    );
    ApiResponse.success(res, QUESTIONS_MESSAGES.FETCHED_ALL, result);
  };

  getQuestionById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const question = await this.questionsService.getQuestionById(id);
    ApiResponse.success(res, QUESTIONS_MESSAGES.FETCHED_ONE, question);
  };

  createQuestion = async (req: Request, res: Response): Promise<void> => {
    const input: CreateQuestionInput = req.body;
    const newQuestion = await this.questionsService.createQuestion(input);
    ApiResponse.created(res, QUESTIONS_MESSAGES.CREATED, newQuestion);
  };

  bulkCreateQuestions = async (req: Request, res: Response): Promise<void> => {
    const questions: CreateQuestionInput[] = req.body.questions;
    const result = await this.questionsService.bulkCreateQuestions(questions);
    ApiResponse.created(res, QUESTIONS_MESSAGES.BULK_CREATED, result);
  };

  updateQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateQuestionInput = req.body;
    const updatedQuestion = await this.questionsService.updateQuestion(
      id,
      input,
    );
    ApiResponse.success(res, QUESTIONS_MESSAGES.UPDATED, updatedQuestion);
  };

  publishQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const question = await this.questionsService.setQuestionStatus(
      id,
      QuestionStatus.PUBLISHED,
    );
    ApiResponse.success(res, QUESTIONS_MESSAGES.PUBLISHED, question);
  };

  archiveQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const question = await this.questionsService.setQuestionStatus(
      id,
      QuestionStatus.ARCHIVED,
    );
    ApiResponse.success(res, QUESTIONS_MESSAGES.ARCHIVED, question);
  };

  draftQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const question = await this.questionsService.setQuestionStatus(
      id,
      QuestionStatus.DRAFT,
    );
    ApiResponse.success(res, QUESTIONS_MESSAGES.STATUS_UPDATED, question);
  };

  deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedQuestion = await this.questionsService.deleteQuestion(id);
    ApiResponse.success(res, QUESTIONS_MESSAGES.DELETED, deletedQuestion);
  };
}
