import { Request, Response } from "express";
import { TopicsService } from "./topics.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { TOPICS_MESSAGES } from "./topics.constants";
import { CreateTopicInput, UpdateTopicInput } from "./topics.types";

export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  getAllTopics = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      subjectId: req.query.subjectId as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.topicsService.getAllTopics(filters, pagination);
    ApiResponse.success(res, TOPICS_MESSAGES.FETCHED_ALL, result);
  };

  getTopicById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const topic = await this.topicsService.getTopicByIdOrSlug(id);
    ApiResponse.success(res, TOPICS_MESSAGES.FETCHED_ONE, topic);
  };

  createTopic = async (req: Request, res: Response): Promise<void> => {
    const input: CreateTopicInput = req.body;
    const newTopic = await this.topicsService.createTopic(input);
    ApiResponse.created(res, TOPICS_MESSAGES.CREATED, newTopic);
  };

  updateTopic = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateTopicInput = req.body;
    const updatedTopic = await this.topicsService.updateTopic(id, input);
    ApiResponse.success(res, TOPICS_MESSAGES.UPDATED, updatedTopic);
  };

  deleteTopic = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedTopic = await this.topicsService.deleteTopic(id);
    ApiResponse.success(res, TOPICS_MESSAGES.DELETED, deletedTopic);
  };
}
