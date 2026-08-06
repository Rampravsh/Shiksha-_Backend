import { Topic } from "@prisma/client";
import { TopicsRepository } from "./topics.repository";
import {
  CreateTopicInput,
  UpdateTopicInput,
  TopicQueryFilters,
} from "./topics.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { TOPICS_MESSAGES } from "./topics.constants";
import { prisma } from "../../core/prisma";

export class TopicsService {
  constructor(private readonly topicsRepository: TopicsRepository) {}

  async getAllTopics(
    filters: TopicQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Topic>> {
    const [data, total] = await this.topicsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getTopicByIdOrSlug(identifier: string): Promise<Topic> {
    let topic = await this.topicsRepository.findById(identifier);
    if (!topic) {
      topic = await this.topicsRepository.findBySlug(identifier);
    }
    if (!topic) {
      throw new NotFoundError(TOPICS_MESSAGES.NOT_FOUND);
    }
    return topic;
  }

  async createTopic(input: CreateTopicInput): Promise<Topic> {
    const subject = await prisma.subject.findUnique({
      where: { id: input.subjectId },
    });
    if (!subject) {
      throw new NotFoundError(TOPICS_MESSAGES.SUBJECT_NOT_FOUND);
    }

    const existingName = await this.topicsRepository.findByName(input.name);
    if (existingName) {
      throw new ConflictError(TOPICS_MESSAGES.ALREADY_EXISTS);
    }

    return this.topicsRepository.create(input);
  }

  async updateTopic(id: string, input: UpdateTopicInput): Promise<Topic> {
    await this.getTopicByIdOrSlug(id);

    if (input.subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: input.subjectId },
      });
      if (!subject) {
        throw new NotFoundError(TOPICS_MESSAGES.SUBJECT_NOT_FOUND);
      }
    }

    if (input.name) {
      const existingName = await this.topicsRepository.findByName(input.name);
      if (existingName && existingName.id !== id) {
        throw new ConflictError(TOPICS_MESSAGES.ALREADY_EXISTS);
      }
    }

    return this.topicsRepository.update(id, input);
  }

  async deleteTopic(id: string): Promise<Topic> {
    await this.getTopicByIdOrSlug(id);
    return this.topicsRepository.delete(id);
  }
}
