import { Subject } from "@prisma/client";
import { SubjectsRepository } from "./subjects.repository";
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectQueryFilters,
} from "./subjects.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { SUBJECTS_MESSAGES } from "./subjects.constants";
import { prisma } from "../../core/prisma";

export class SubjectsService {
  constructor(private readonly subjectsRepository: SubjectsRepository) {}

  async getAllSubjects(
    filters: SubjectQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Subject>> {
    const [data, total] = await this.subjectsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getSubjectByIdOrSlug(identifier: string): Promise<Subject> {
    let subject = await this.subjectsRepository.findById(identifier);
    if (!subject) {
      subject = await this.subjectsRepository.findBySlug(identifier);
    }
    if (!subject) {
      throw new NotFoundError(SUBJECTS_MESSAGES.NOT_FOUND);
    }
    return subject;
  }

  async createSubject(input: CreateSubjectInput): Promise<Subject> {
    const exam = await prisma.exam.findUnique({
      where: { id: input.examId },
    });
    if (!exam) {
      throw new NotFoundError(SUBJECTS_MESSAGES.EXAM_NOT_FOUND);
    }

    const existingName = await this.subjectsRepository.findByName(input.name);
    if (existingName) {
      throw new ConflictError(SUBJECTS_MESSAGES.ALREADY_EXISTS);
    }

    return this.subjectsRepository.create(input);
  }

  async updateSubject(id: string, input: UpdateSubjectInput): Promise<Subject> {
    await this.getSubjectByIdOrSlug(id);

    if (input.examId) {
      const exam = await prisma.exam.findUnique({
        where: { id: input.examId },
      });
      if (!exam) {
        throw new NotFoundError(SUBJECTS_MESSAGES.EXAM_NOT_FOUND);
      }
    }

    if (input.name) {
      const existingName = await this.subjectsRepository.findByName(input.name);
      if (existingName && existingName.id !== id) {
        throw new ConflictError(SUBJECTS_MESSAGES.ALREADY_EXISTS);
      }
    }

    return this.subjectsRepository.update(id, input);
  }

  async deleteSubject(id: string): Promise<Subject> {
    await this.getSubjectByIdOrSlug(id);
    return this.subjectsRepository.delete(id);
  }
}
