import { Request, Response } from "express";
import { TestQuestionsService } from "./test-questions.service";
import { ApiResponse } from "../../core/response";
import { TEST_QUESTIONS_MESSAGES } from "./test-questions.constants";
import {
  AddTestQuestionInput,
  ReorderTestQuestionsInput,
} from "./test-questions.types";

export class TestQuestionsController {
  constructor(private readonly testQuestionsService: TestQuestionsService) {}

  getQuestionsByTestPaperId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const testPaperId = req.params.testPaperId as string;
    const questions =
      await this.testQuestionsService.getQuestionsByTestPaperId(testPaperId);
    ApiResponse.success(res, TEST_QUESTIONS_MESSAGES.FETCHED_ALL, questions);
  };

  addQuestionToTest = async (req: Request, res: Response): Promise<void> => {
    const testPaperId = req.params.testPaperId as string;
    const input: AddTestQuestionInput = req.body;
    const result = await this.testQuestionsService.addQuestionToTest(
      testPaperId,
      input,
    );
    ApiResponse.created(res, TEST_QUESTIONS_MESSAGES.ADDED, result);
  };

  bulkAddQuestionsToTest = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const testPaperId = req.params.testPaperId as string;
    const questions: AddTestQuestionInput[] = req.body.questions;
    const result = await this.testQuestionsService.bulkAddQuestionsToTest(
      testPaperId,
      questions,
    );
    ApiResponse.created(res, TEST_QUESTIONS_MESSAGES.BULK_ADDED, result);
  };

  reorderTestQuestions = async (req: Request, res: Response): Promise<void> => {
    const testPaperId = req.params.testPaperId as string;
    const input: ReorderTestQuestionsInput = req.body;
    await this.testQuestionsService.reorderTestQuestions(testPaperId, input);
    ApiResponse.success(res, TEST_QUESTIONS_MESSAGES.REORDERED, null);
  };

  removeQuestionFromTest = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const testPaperId = req.params.testPaperId as string;
    const questionId = req.params.questionId as string;
    const result = await this.testQuestionsService.removeQuestionFromTest(
      testPaperId,
      questionId,
    );
    ApiResponse.success(res, TEST_QUESTIONS_MESSAGES.REMOVED, result);
  };
}
