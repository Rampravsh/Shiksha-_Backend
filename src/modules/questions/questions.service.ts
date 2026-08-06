import { Question, QuestionStatus } from "@prisma/client";
import { QuestionsRepository } from "./questions.repository";
import {
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionQueryFilters,
} from "./questions.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { QUESTIONS_MESSAGES } from "./questions.constants";
import { prisma } from "../../core/prisma";

export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async getAllQuestions(
    filters: QuestionQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Question>> {
    const [data, total] = await this.questionsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getQuestionById(id: string): Promise<Question> {
    const question = await this.questionsRepository.findById(id);
    if (!question) {
      throw new NotFoundError(QUESTIONS_MESSAGES.NOT_FOUND);
    }
    return question;
  }

  async createQuestion(input: CreateQuestionInput): Promise<Question> {
    const exam = await prisma.exam.findUnique({
      where: { id: input.examId },
    });
    if (!exam) {
      throw new NotFoundError(QUESTIONS_MESSAGES.EXAM_NOT_FOUND);
    }

    const subject = await prisma.subject.findUnique({
      where: { id: input.subjectId },
    });
    if (!subject) {
      throw new NotFoundError(QUESTIONS_MESSAGES.SUBJECT_NOT_FOUND);
    }

    if (input.topicId) {
      const topic = await prisma.topic.findUnique({
        where: { id: input.topicId },
      });
      if (!topic) {
        throw new NotFoundError(QUESTIONS_MESSAGES.TOPIC_NOT_FOUND);
      }
    }

    const duplicate = await this.questionsRepository.findByText(
      input.textEn,
      input.examId,
    );
    if (duplicate) {
      throw new ConflictError(QUESTIONS_MESSAGES.DUPLICATE_DETECTED);
    }

    return this.questionsRepository.create(input);
  }

  async bulkCreateQuestions(
    questions: CreateQuestionInput[],
  ): Promise<{ count: number }> {
    const count = await this.questionsRepository.createMany(questions);
    return { count };
  }

  async updateQuestion(
    id: string,
    input: UpdateQuestionInput,
  ): Promise<Question> {
    await this.getQuestionById(id);

    if (input.examId) {
      const exam = await prisma.exam.findUnique({
        where: { id: input.examId },
      });
      if (!exam) {
        throw new NotFoundError(QUESTIONS_MESSAGES.EXAM_NOT_FOUND);
      }
    }

    if (input.subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: input.subjectId },
      });
      if (!subject) {
        throw new NotFoundError(QUESTIONS_MESSAGES.SUBJECT_NOT_FOUND);
      }
    }

    if (input.topicId) {
      const topic = await prisma.topic.findUnique({
        where: { id: input.topicId },
      });
      if (!topic) {
        throw new NotFoundError(QUESTIONS_MESSAGES.TOPIC_NOT_FOUND);
      }
    }

    return this.questionsRepository.update(id, input);
  }

  async setQuestionStatus(
    id: string,
    status: QuestionStatus,
  ): Promise<Question> {
    await this.getQuestionById(id);
    return this.questionsRepository.setStatus(id, status);
  }

  async deleteQuestion(id: string): Promise<Question> {
    await this.getQuestionById(id);
    return this.questionsRepository.delete(id);
  }
}
